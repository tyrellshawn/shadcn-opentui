import { bench, describe } from 'vitest'

import { mergeThemes } from '@/lib/opentui/theme-utils'

const defaultThemes = Array.from({ length: 20 }).map((_, index) => ({
  name: `default-${index}`,
  displayName: `Default ${index}`,
}))

const customThemes = Array.from({ length: 200 }).map((_, index) => ({
  ...defaultThemes[index % defaultThemes.length],
  name: `custom-${index}`,
  displayName: `Custom ${index}`,
}))

describe('theme-utils benchmarks', () => {
  bench('mergeThemes / defaults + custom', () => {
    mergeThemes(defaultThemes, customThemes)
  })

  bench('mergeThemes / override by name', () => {
    mergeThemes(defaultThemes, [
      {
        ...defaultThemes[0],
        displayName: 'Overridden',
      },
    ])
  })
})
