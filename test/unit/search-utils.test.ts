import { describe, expect, it } from 'vitest'

import { filterSearchItems, groupSearchItems, type SearchItem } from '@/lib/opentui/search-utils'

const ITEMS: SearchItem[] = [
  {
    id: '1',
    title: 'Introduction',
    description: 'OpenTUI overview',
    href: '/docs',
    category: 'Getting Started',
    keywords: ['overview', 'terminal'],
  },
  {
    id: '2',
    title: 'Theme Picker',
    description: 'Pick terminal themes',
    href: '/docs/themes',
    category: 'Components',
    keywords: ['theme', 'palette'],
  },
  {
    id: '3',
    title: 'Hooks',
    description: 'Keyboard and resize events',
    href: '/docs/hooks',
    category: 'OpenTUI Integration',
    keywords: ['useKeyboard'],
  },
]

describe('search utils', () => {
  it('returns all items for empty query', () => {
    expect(filterSearchItems(ITEMS, '')).toHaveLength(3)
  })

  it('matches by title, description, keywords, and category', () => {
    expect(filterSearchItems(ITEMS, 'intro')).toHaveLength(1)
    expect(filterSearchItems(ITEMS, 'terminal themes')).toHaveLength(1)
    expect(filterSearchItems(ITEMS, 'usekeyboard')).toHaveLength(1)
    expect(filterSearchItems(ITEMS, 'components')).toHaveLength(1)
  })

  it('groups by category key', () => {
    const grouped = groupSearchItems(ITEMS)
    expect(Object.keys(grouped)).toEqual([
      'Getting Started',
      'Components',
      'OpenTUI Integration',
    ])
    expect(grouped['Components'][0].id).toBe('2')
  })
})
