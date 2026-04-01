<template>
  <div class="home">
    <h1>The Tower Calculator</h1>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else>
      <div class="card">
        <h2>Select Lab</h2>

        <select v-model="selectedLabName">
          <option disabled value="">Select a lab</option>
          <option v-for="lab in flatLabs" :key="lab.name" :value="lab.name">
            {{ lab.name }}
          </option>
        </select>
      </div>

      <div class="card" v-if="selectedLab">
        <h2>Research Settings</h2>

        <p><strong>Max Level:</strong> {{ selectedLab.max_level }}</p>

        <label>
          Current Level:
          <input
            type="number"
            v-model.number="currentLevel"
            min="0"
            :max="selectedLab.max_level"
          />
        </label>

        <br />

        <label>
          Target Level:
          <input
            type="number"
            v-model.number="targetLevel"
            :min="currentLevel"
            :max="selectedLab.max_level"
          />
        </label>

        <br />

        <label>
          Lab Speed Multiplier:
          <input
            type="number"
            v-model.number="labSpeedMultiplier"
            min="1"
            max="8"
            step="0.1"
          />
        </label>
      </div>

      <div class="card" v-if="results">
        <h2>Results</h2>

        <p><strong>Levels Researched:</strong> {{ results.levelCount }}</p>
        <p><strong>Total Cost:</strong> {{ formatNumber(results.totalCost) }}</p>
        <p><strong>Raw Time:</strong> {{ formatMinutes(results.totalMinutes) }}</p>
        <p><strong>Adjusted Time:</strong> {{ formatMinutes(results.adjustedMinutes) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useLabCalculator } from '../composables/useLabCalculator'

const { getSelectedRows, calculateTotals } = useLabCalculator()

const labData = ref(null)
const loading = ref(true)
const error = ref('')

const selectedLabName = ref('')
const currentLevel = ref(0)
const targetLevel = ref(1)
const labSpeedMultiplier = ref(1)

const flatLabs = computed(() => {
  if (!labData.value?.labs) return []

  const result = []

  for (const [key, value] of Object.entries(labData.value.labs)) {
    if (value?.sub_labs) {
      for (const [subName, subLab] of Object.entries(value.sub_labs)) {
        result.push({
          name: subName,
          ...subLab
        })
      }
    } else {
      result.push({
        name: key,
        ...value
      })
    }
  }

  return result
})

const selectedLab = computed(() =>
  flatLabs.value.find(lab => lab.name === selectedLabName.value)
)

watch(selectedLab, (lab) => {
  if (!lab) return
  currentLevel.value = 0
  targetLevel.value = Math.min(1, lab.max_level || 1)
})

const results = computed(() => {
  if (!selectedLab.value) return null
  if (targetLevel.value <= currentLevel.value) return null

  const maxLevel = selectedLab.value.max_level || 0
  const safeCurrent = Math.max(0, Math.min(currentLevel.value, maxLevel))
  const safeTarget = Math.max(safeCurrent, Math.min(targetLevel.value, maxLevel))

  const rows = getSelectedRows(selectedLab.value, safeCurrent, safeTarget)

  const { totalCost, totalMinutes, adjustedMinutes } = calculateTotals(
    rows,
    labSpeedMultiplier.value
  )

  return {
    levelCount: rows.length,
    totalCost,
    totalMinutes,
    adjustedMinutes
  }
})

function formatMinutes(minutes) {
  const rounded = Math.round(minutes)
  const d = Math.floor(rounded / 1440)
  const h = Math.floor((rounded % 1440) / 60)
  const m = rounded % 60

  return `${d}d ${h}h ${m}m`
}

function formatNumber(value) {
  return new Intl.NumberFormat().format(Math.round(value))
}

onMounted(async () => {
  try {
    const res = await fetch('/data/labs.json')

    if (!res.ok) {
      throw new Error('Failed to load labs.json')
    }

    labData.value = await res.json()
  } catch (err) {
    error.value = err.message || 'Failed to load data'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.home {
  max-width: 900px;
  margin: auto;
  padding: 2rem;
}

.card {
  margin-top: 1.5rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

input,
select {
  margin-top: 0.5rem;
  margin-bottom: 0.75rem;
}
</style>