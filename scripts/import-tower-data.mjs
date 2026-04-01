import fs from 'node:fs/promises'
import path from 'node:path'
import slugify from 'slugify'


const API_BASE = 'https://the-tower-idle-tower-defense.fandom.com/api.php'
const OUT_DIR = path.resolve('./public/data')

const CATEGORY_MAP = {
//   main: { id: 'main', name: 'Main', file: 'main.json', labs: [] },
//   attack: { id: 'attack', name: 'Attack', file: 'attack.json', labs: [] },
//   defense: { id: 'defense', name: 'Defense', file: 'defense.json', labs: [] },
//   utility: { id: 'utility', name: 'Utility', file: 'utility.json', labs: [] },
//   'ultimate-weapon': { id: 'ultimate-weapon', name: 'Ultimate Weapon', file: 'ultimate-weapon.json', labs: [] },
//   cards: { id: 'cards', name: 'Cards', file: 'cards.json', labs: [] },
//   perks: { id: 'perks', name: 'Perks', file: 'perks.json', labs: [] },
//   bots: { id: 'bots', name: 'Bots', file: 'bots.json', labs: [] },
//   enemies: { id: 'enemies', name: 'Enemies', file: 'enemies.json', labs: [] },
//   module: { id: 'module', name: 'Module', file: 'module.json', labs: [] },
  'battle-condition': { id: 'battle-condition', name: 'Battle Condition', file: 'battle-condition.json', labs: [] },
}

// Start with a small set first, then expand.
const LAB_PAGES = [
//     // Main
//   { title: 'Lab/Game Speed', category: 'main' },                // Max Lv 7
//   { title: 'Lab/Starting Cash', category: 'main' },             // Max Lv 99
//   { title: 'Lab/Workshop Attack Discount', category: 'main' },  // Max Lv 99
//   { title: 'Lab/Workshop Defense Discount', category: 'main' }, // Max Lv 99
//   { title: 'Lab/Workshop Utility Discount', category: 'main' }, // Max Lv 99
//   { title: 'Lab/Labs Coin Discount', category: 'main' },        // Max Lv 99
//   { title: 'Labs Speed', category: 'main' },                    // Max Lv 99, transcludes Lab/Lab Speed
//   { title: 'Lab/Buy multiplier', category: 'main' },            // Max Lv 4
//   { title: 'Lab/More Round Stats', category: 'main' },          // Max Lv 1
//   { title: 'Lab/Target Priority', category: 'main' },           // Max Lv 2
//   { title: 'Lab/Card Presets', category: 'main' },              // Max Lv 1
//   { title: 'Lab/Workshop Respec', category: 'main' },           // Max Lv 1
//   { title: 'Reroll Daily Missions', category: 'main' },         // Max Lv 1
//   { title: 'Lab/Workshop Enhancement', category: 'main' },      // Max Lv 1
//   { title: 'Lab/Enhancement Coin Discount', category: 'main' }  // Max Lv 100
// // Attack
//   { title: 'Lab/Damage', category: 'attack' },                // Max Lv 99
//   { title: 'Lab/Attack Speed', category: 'attack' },          // Max Lv 99
//   { title: 'Lab/Critical Hits', category: 'attack' },         // Max Lv 99
//   { title: 'Lab/Range', category: 'attack' },                 // Max Lv 99
//   { title: 'Lab/Damage Per Meter', category: 'attack' },      // Max Lv 99
//   { title: 'Lab/Super Critical', category: 'attack' },        // Max Lv 99
//   { title: 'Lab/Rend Armor', category: 'attack' }             // Max Lv 99
// //Defense
//  { title: 'Lab/Health', category: 'defense' },
//   { title: 'Lab/Health Regen', category: 'defense' },
//   { title: 'Lab/Defense Percent', category: 'defense' },
//   { title: 'Lab/Defense Absolute', category: 'defense' },
//   { title: 'Lab/Orbs', category: 'defense' },
//   { title: 'Lab/Land Mine', category: 'defense' },
//   { title: 'Lab/Shockwave', category: 'defense' },

//   // these two are likely wrapper/group pages, not single simple lab pages
//   { title: 'Wall_Labs', category: 'defense' },
//   { title: 'Thorn_Damage', category: 'defense' }
//  //Utility
//   { title: 'Lab/Cash Bonus', category: 'utility' },
//   { title: 'Cash_Per_Wave', category: 'utility' },
//   { title: 'Coins_Per_Kill_Bonus', category: 'utility' },
//   { title: 'Coins_Per_Wave', category: 'utility' },
//   { title: 'Interest', category: 'utility' },
//   { title: 'Max_Interest', category: 'utility' },
//   { title: 'Package_After_Boss', category: 'utility' },
//   { title: 'Recovery_Package_Amount', category: 'utility' },
//   { title: 'Recovery_Package_Max', category: 'utility' },
//   { title: 'Recovery_Package_Chance', category: 'utility' },
//   { title: 'Enemy_Level_Skip', category: 'utility' }

// // Ultimate Weapons
//   { title: 'Smart_Missiles', category: 'ultimate-weapon' },
//   { title: 'Chrono_Field', category: 'ultimate-weapon' },
//   { title: 'Poison_Swamp', category: 'ultimate-weapon' },
//   { title: 'Golden_Tower', category: 'ultimate-weapon' },
//   { title: 'Chain_Lightning', category: 'ultimate-weapon' },
//   { title: 'Death_Wave', category: 'ultimate-weapon' },
//   { title: 'Inner_Land_Mines', category: 'ultimate-weapon' },
//   { title: 'Black_Hole', category: 'ultimate-weapon' },
//   { title: 'Spotlight', category: 'ultimate-weapon' }

// // Cards
//   { title: 'Second_Wind', category: 'cards' },
//   { title: 'Death_Ray', category: 'cards' },
//   { title: 'Extra_Orb', category: 'cards' },
//   { title: 'Energy_Shield', category: 'cards' },
//   { title: 'Super_Tower', category: 'cards' },
//   { title: 'Demon_Mode', category: 'cards' },
//   { title: 'Nuke', category: 'cards' },
//   { title: 'Card_Masteries', category: 'cards' }

// //Perks
//   { title: 'Perk_Labs/Unlock_Perks', category: 'perks' },
//   { title: 'Perk_Labs/Waves_Required', category: 'perks' },
//   { title: 'Perk_Labs/Standard_Perk_Bonus', category: 'perks' },
//   { title: 'Perk_Labs/Perk_Option_Quantity', category: 'perks' },
//   { title: 'Perk_Labs/First_Perk_Choice', category: 'perks' },
//   { title: 'Perk_Labs/Ban_Perks', category: 'perks' },
//   { title: 'Perk_Labs/Improve_Trade-Off_Perks', category: 'perks' },
//   { title: 'Perk_Labs/Auto_Pick_Ranking', category: 'perks' },
// //Bots
//   { title: 'Flame_Bot', category: 'bots' },
//   { title: 'Thunder_Bot', category: 'bots' },
//   { title: 'Golden_Bot', category: 'bots' },
//   { title: 'Amplify_Bot', category: 'bots' }
// // Enemies
//   { title: 'Common_Enemy_Labs', category: 'enemies' },
//   { title: 'Fast_Enemy_Labs', category: 'enemies' },
//   { title: 'Tank_Enemy_Labs', category: 'enemies' },
//   { title: 'Ranged_Enemy_Labs', category: 'enemies' },
//   { title: 'Boss_Labs', category: 'enemies' },
//   { title: 'Protector_Labs', category: 'enemies' },

//   // direct lab pages
//   { title: 'Lab/Vampire_Enemy_Attack', category: 'enemies' },
//   { title: 'Lab/Vampire_Enemy_Health', category: 'enemies' },
//   { title: 'Lab/Ray_Enemy_Attack', category: 'enemies' },
//   { title: 'Lab/Ray_Enemy_Health', category: 'enemies' },
//   { title: 'Lab/Scatter_Enemy_Attack', category: 'enemies' },
//   { title: 'Lab/Scatter_Enemy_Health', category: 'enemies' }

// // Modules
//   { title: 'Module_Labs', category: 'module' },
//   { title: 'Assist_Module_Labs', category: 'module' },

//   // direct pages that are definitely module labs
//   { title: 'Module_Labs/Reroll_Shards', category: 'module' },
//   { title: 'Module_Labs/Unmerge_Module', category: 'module' },
//   { title: 'Lab/Shatter_Shards', category: 'module' }

// Battle Conditions
  { title: 'Lab/Battle_Condition_Reduction', category: 'battle-condition' },
  { title: 'Lab/Battle_Conditions_Group_1', category: 'battle-condition' },
  { title: 'Lab/Battle_Conditions_Group_2', category: 'battle-condition' },
  { title: 'Lab/Battle_Conditions_Group_3', category: 'battle-condition' },
  { title: 'Lab/Battle_Conditions_Group_4', category: 'battle-condition' }
]

function toSlug(text) {
  return slugify(text || '', { lower: true, strict: true, trim: true })
}

function cleanText(text) {
  return (text || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseTimeToMinutes(timeStr) {
  const s = cleanText(timeStr)

  const years = Number((s.match(/(\d+)\s*y/i) || [])[1] || 0)
  const days = Number((s.match(/(\d+)\s*d/i) || [])[1] || 0)
  const hours = Number((s.match(/(\d+)\s*h/i) || [])[1] || 0)
  const minutes = Number((s.match(/(\d+)\s*m/i) || [])[1] || 0)
  const seconds = Number((s.match(/(\d+)\s*s/i) || [])[1] || 0)

  return years * 365 * 1440 + days * 1440 + hours * 60 + minutes + Math.round(seconds / 60)
}

function parseNumber(value) {
  if (value == null) return 0

  let s = cleanText(String(value)).replace(/\s+/g, '')

  const match = s.match(/^([\d.,]+)([KMBTQq])?$/)
  if (!match) {
    const plain = s.replace(/[^\d.]/g, '')
    return plain ? Number(plain) : 0
  }

  let [, numPart, suffix = ''] = match

  if (numPart.includes(',') && !numPart.includes('.')) {
    const commaCount = (numPart.match(/,/g) || []).length
    if (commaCount === 1 && numPart.split(',')[1].length <= 2) {
      numPart = numPart.replace(',', '.')
    } else {
      numPart = numPart.replace(/,/g, '')
    }
  } else {
    numPart = numPart.replace(/,/g, '')
  }

  const num = Number(numPart)
  if (Number.isNaN(num)) return 0

  const mult = {
    '': 1,
    K: 1e3,
    M: 1e6,
    B: 1e9,
    T: 1e12,
    Q: 1e15,
  }[suffix.toUpperCase()] ?? 1

  return Math.round(num * mult)
}

async function fetchWikiText(title) {
  const candidates = buildTitleCandidates(title)

  for (const candidate of candidates) {
    const url = new URL(API_BASE)
    url.searchParams.set('action', 'query')
    url.searchParams.set('prop', 'revisions')
    url.searchParams.set('titles', candidate)
    url.searchParams.set('rvslots', '*')
    url.searchParams.set('rvprop', 'content')
    url.searchParams.set('formatversion', '2')
    url.searchParams.set('format', 'json')

    const response = await fetch(url, {
      headers: {
        'user-agent': 'TowerCalculatorImporter/1.0'
      }
    })

    if (!response.ok) {
      continue
    }

    const data = await response.json()
    const page = data?.query?.pages?.[0]
    const content = page?.revisions?.[0]?.slots?.main?.content

    if (content) {
      return {
        title: page?.title || candidate,
        content
      }
    }
  }

  throw new Error(`No wikitext content found for "${title}"`)
}

function buildTitleCandidates(title) {
  const clean = title.trim()

  const variants = new Set([
    clean,
    clean.replace(/_/g, ' '),
    clean.replace(/\s+/g, '_'),
  ])

  if (clean.startsWith('Lab/')) {
    const rest = clean.slice(4)
    variants.add(rest)
    variants.add(rest.replace(/_/g, ' '))
    variants.add(rest.replace(/\s+/g, '_'))
  } else {
    variants.add(`Lab/${clean}`)
    variants.add(`Lab/${clean.replace(/_/g, ' ')}`)
    variants.add(`Lab/${clean.replace(/\s+/g, '_')}`)
  }

  if (/Labs Speed/i.test(clean)) {
    variants.add(clean.replace(/Labs Speed/gi, 'Lab Speed'))
    variants.add(clean.replace(/Labs Speed/gi, 'Laboratory Speed'))
    variants.add(clean.replace(/Labs Speed/gi, 'Labs_Speed'))
  }

  return [...variants]
}

function extractUnlockAndMax(text) {
  const unlockMatch = text.match(/Unlocks?.*?(?=\n|\{\||$)/i)
  const maxMatch =
    text.match(/maximum of (\d+) levels?/i) ||
    text.match(/There are maximum of (\d+) levels?/i) ||
    text.match(/Has (\d+) levels?/i)

  return {
    unlock: unlockMatch ? cleanText(unlockMatch[0]) : '',
    maxLevel: maxMatch ? Number(maxMatch[1]) : null
  }
}

function parseWikiTable(text) {
  const tableMatch = text.match(/\{\|[\s\S]*?\|\}/)
  if (!tableMatch) {
    return { headers: [], rows: [] }
  }

  const tableText = tableMatch[0]
  const lines = tableText
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)

  const headers = []
  const rows = []
  let currentRow = []

  for (const line of lines) {
    if (line.startsWith('{|') || line.startsWith('|}')) {
      continue
    }

    if (line.startsWith('|-')) {
      if (currentRow.length) {
        rows.push(currentRow)
        currentRow = []
      }
      continue
    }

    if (line.startsWith('!')) {
      const headerLine = line.slice(1)
      const parts = headerLine.split('!!').map(part => cleanText(part))
      headers.push(...parts)
      continue
    }

    if (line.startsWith('|')) {
      const rowLine = line.slice(1)
      const parts = rowLine.split('||').map(part => cleanText(part))
      currentRow.push(...parts)
    }
  }

  if (currentRow.length) {
    rows.push(currentRow)
  }

  return { headers, rows }
}

function normalizeHeader(header) {
  return cleanText(header)
    .replace(/'+/g, '')
    .toLowerCase()
}

function convertRows(headers, rows) {
  const normalizedHeaders = headers.map(normalizeHeader)

  const levelIndex = normalizedHeaders.findIndex(h => h.includes('level'))
  const costIndex = normalizedHeaders.findIndex(h => h === 'cost' || h.includes('cost'))
  const timeIndex = normalizedHeaders.findIndex(h => h.includes('time'))
  const valueIndex = normalizedHeaders.findIndex(
    h => h.includes('value') || h.includes('effect')
  )

  // real lab tables need level + cost + time
  if (levelIndex === -1 || costIndex === -1 || timeIndex === -1) {
    return []
  }

  return rows
    .map(row => {
      const rawLevel = row[levelIndex]
      const level = Number.parseInt(String(rawLevel), 10)

      return {
        level,
        cost: parseNumber(row[costIndex]),
        timeMinutes: parseTimeToMinutes(row[timeIndex]),
        timeDisplay: cleanText(row[timeIndex]),
        value: valueIndex >= 0 ? cleanText(row[valueIndex]) : ''
      }
    })
    .filter(row => Number.isFinite(row.level) && row.level > 0)
}

function pageTitleToLabName(pageTitle) {
  const raw = String(pageTitle || '')

  return cleanText(
    raw
      .replace(/^Perk[_ ]Labs\//i, '')
      .replace(/^Lab\//i, '')
      .replace(/_/g, ' ')
  )
}

async function buildLab(pageTitle, content, seenTitles = new Set()) {
  const safeTitle = String(pageTitle || '')

  if (seenTitles.has(safeTitle)) {
    return []
  }
  seenTitles.add(safeTitle)

  const { unlock, maxLevel } = extractUnlockAndMax(content)

  let { headers, rows } = parseWikiTable(content)
  let levels = convertRows(headers, rows)

  if (levels.length) {
    const name = pageTitleToLabName(safeTitle)

    return [{
      id: toSlug(name),
      name,
      maxLevel: maxLevel ?? levels[levels.length - 1].level,
      unlock,
      levels
    }]
  }

  const transclusions = [...content.matchAll(/\{\{:([^}]+)\}\}/g)]
    .map(match => cleanText(match[1]))
    .filter(Boolean)

  const labs = []

  for (const transcludedTitle of transclusions) {
    try {
      const transcluded = await fetchWikiText(transcludedTitle)
      const built = await buildLab(transcluded.title, transcluded.content, seenTitles)
      labs.push(...built)
    } catch (error) {
      console.warn(
        `Transclusion fetch failed for ${safeTitle} -> ${transcludedTitle}: ${error.message}`
      )
    }
  }

  if (labs.length) {
    return labs
  }

  console.log(`DEBUG FAILED: ${safeTitle}`)
  console.log('CONTENT PREVIEW:')
  console.log(content.slice(0, 1200))
  console.log('HEADERS:', headers)
  console.log('FIRST 20 ROWS:', rows.slice(0, 20))
  return []
}

async function ensureOutDir() {
  await fs.mkdir(OUT_DIR, { recursive: true })
}

async function writeIndex() {
  const payload = {
    categories: Object.values(CATEGORY_MAP).map(category => ({
      id: category.id,
      name: category.name,
      file: `/data/${category.file}`
    }))
  }

  await fs.writeFile(
    path.join(OUT_DIR, 'index.json'),
    JSON.stringify(payload, null, 2),
    'utf8'
  )
}

async function writeCategories() {
  for (const category of Object.values(CATEGORY_MAP)) {
    const payload = {
      id: category.id,
      name: category.name,
      labs: category.labs
        .filter(lab => lab && lab.name && lab.id)
        .sort((a, b) => a.name.localeCompare(b.name))
    }

    await fs.writeFile(
      path.join(OUT_DIR, category.file),
      JSON.stringify(payload, null, 2),
      'utf8'
    )
  }
}

async function main() {
  await ensureOutDir()

  for (const page of LAB_PAGES) {
    try {
      const { title, content } = await fetchWikiText(page.title)
      const labs = await buildLab(title, content)

      if (!labs.length) {
        console.warn(`Skipped: ${page.title} (no parseable table)`)
        continue
      }

      for (const lab of labs) {
        console.log('LAB OBJECT:', lab)
        CATEGORY_MAP[page.category].labs.push(lab)
        console.log(`Parsed: [${page.category}] ${lab?.name || '(missing name)'}`)
      }
    } catch (error) {
      console.warn(`Failed: ${page.title} -> ${error.message}`)
    }
  }

  await writeIndex()
  await writeCategories()

  console.log(`Done. Wrote files to ${OUT_DIR}`)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})