// scripts/utils/helpers.js

export function cleanText(text) {
  return (text || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function toSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function pageTitleToLabName(pageTitle) {
  const raw = String(pageTitle || '')

  return cleanText(
    raw
      .replace(/^Perk[_ ]Labs\//i, '')
      .replace(/^Lab\//i, '')
      .replace(/_/g, ' ')
  )
}