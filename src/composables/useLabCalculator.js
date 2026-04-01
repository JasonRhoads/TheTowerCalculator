export function useLabCalculator() {
  function getSelectedRows(lab, currentLevel, targetLevel) {
    if (!lab || !lab.rows) return []

    return lab.rows.filter(
      row => row.level > currentLevel && row.level <= targetLevel
    )
  }

  function calculateTotals(rows, labSpeedMultiplier = 1) {
    let totalCost = 0
    let totalMinutes = 0

    for (const row of rows) {
      totalCost += parseNumber(row.cost)
      totalMinutes += parseTimeToMinutes(row.time)
    }

    const adjustedMinutes =
      labSpeedMultiplier > 0 ? totalMinutes / labSpeedMultiplier : totalMinutes

    return {
      totalCost,
      totalMinutes,
      adjustedMinutes
    }
  }

  function parseNumber(value) {
    if (!value) return 0

    const str = value.toString().trim().replace(/,/g, '')

    const match = str.match(/^([\d.]+)\s*([KMBTqQ]?)$/i)
    if (!match) {
      return Number(str.replace(/[^\d.]/g, '')) || 0
    }

    const num = Number(match[1])
    const suffix = match[2].toUpperCase()

    const multipliers = {
      '': 1,
      K: 1e3,
      M: 1e6,
      B: 1e9,
      T: 1e12,
      Q: 1e15
    }

    return num * (multipliers[suffix] || 1)
  }

  function parseTimeToMinutes(timeStr) {
    if (!timeStr) return 0

    let days = 0
    let hours = 0
    let minutes = 0

    const d = timeStr.match(/(\d+)d/)
    const h = timeStr.match(/(\d+)h/)
    const m = timeStr.match(/(\d+)m/)

    if (d) days = parseInt(d[1], 10)
    if (h) hours = parseInt(h[1], 10)
    if (m) minutes = parseInt(m[1], 10)

    return days * 1440 + hours * 60 + minutes
  }

  return {
    getSelectedRows,
    calculateTotals
  }
}