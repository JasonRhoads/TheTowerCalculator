// scripts/utils/fetch.js

const API_BASE = 'https://the-tower-idle-tower-defense.fandom.com/api.php'

export async function fetchWikiText(title) {
  const url = new URL(API_BASE)

  url.searchParams.set('action', 'query')
  url.searchParams.set('prop', 'revisions')
  url.searchParams.set('titles', title)
  url.searchParams.set('rvslots', '*')
  url.searchParams.set('rvprop', 'content')
  url.searchParams.set('formatversion', '2')
  url.searchParams.set('format', 'json')

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed: ${title}`)
  }

  const data = await response.json()
  const page = data?.query?.pages?.[0]

  return {
    title: page?.title,
    content: page?.revisions?.[0]?.slots?.main?.content
  }
}