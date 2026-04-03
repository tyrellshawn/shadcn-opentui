export interface SearchItem {
  id: string
  title: string
  description?: string
  href: string
  category: string
  keywords?: string[]
}

export function filterSearchItems<T extends SearchItem>(items: T[], query: string): T[] {
  if (!query) {
    return items
  }

  const normalized = query.toLowerCase()
  return items.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(normalized)
    const descriptionMatch = item.description?.toLowerCase().includes(normalized)
    const keywordMatch = item.keywords?.some((keyword) =>
      keyword.toLowerCase().includes(normalized),
    )
    const categoryMatch = item.category.toLowerCase().includes(normalized)

    return titleMatch || descriptionMatch || keywordMatch || categoryMatch
  })
}

export function groupSearchItems<T extends SearchItem>(items: T[]): Record<string, T[]> {
  const groups: Record<string, T[]> = {}

  for (const item of items) {
    if (!groups[item.category]) {
      groups[item.category] = []
    }
    groups[item.category].push(item)
  }

  return groups
}
