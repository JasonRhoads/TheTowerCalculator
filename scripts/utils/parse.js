// scripts/utils/parse.js

import { cleanText } from './helpers.js'

export function parseTimeToMinutes(timeStr) {
  const s = cleanText(timeStr)

  const days = Number((s.match(/(\d+)\s*d/i) || [])[1] || 0)
  const hours = Number((s.match(/(\d+)\s*h/i) || [])[1] || 0)
  const minutes = Number((s.match(/(\d+)\s*m/i) || [])[1] || 0)

  return days * 1440 + hours * 60 + minutes
}

export function parseNumber(value) {
  if (!value) return 0
  return Number(String(value).replace(/[^\d]/g, '')) || 0
}

// your parseWikiTable + convertRows go here too