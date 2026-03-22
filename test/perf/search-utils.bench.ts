import { bench, describe } from 'vitest'

import { filterSearchItems, groupSearchItems, type SearchItem } from '@/lib/opentui/search-utils'

function createItems(count: number): SearchItem[] {
  return Array.from({ length: count }).map((_, index) => ({
    id: `id-${index}`,
    title: `Item ${index} OpenTUI`,
    description: `Description for item ${index}`,
    href: `/docs/${index}`,
    category: index % 2 === 0 ? 'Components' : 'Getting Started',
    keywords: ['opentui', 'terminal', index % 5 === 0 ? 'theme' : 'search'],
  }))
}

const items = createItems(5000)

describe('search-utils benchmarks', () => {
  bench('filterSearchItems / keyword query', () => {
    filterSearchItems(items, 'theme')
  })

  bench('filterSearchItems / category query', () => {
    filterSearchItems(items, 'components')
  })

  bench('groupSearchItems / 5000 items', () => {
    groupSearchItems(items)
  })
})
