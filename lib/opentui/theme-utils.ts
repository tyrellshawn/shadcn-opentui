interface NamedTheme {
  name: string
}

export function mergeThemes<T extends NamedTheme>(
  defaults: T[],
  customThemes: T[] = [],
): T[] {
  const map = new Map<string, T>()
  const validCustom = customThemes.filter(Boolean) as T[]

  for (const theme of defaults) {
    map.set(theme.name, theme)
  }

  for (const theme of validCustom) {
    map.set(theme.name, theme)
  }

  return [...map.values()]
}
