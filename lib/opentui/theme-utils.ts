interface NamedTheme {
  name: string
}

export function mergeThemes<T extends NamedTheme>(
  defaults: T[],
  customThemes: T[] = [],
): T[] {
  const map = new Map<string, T>()

  for (const theme of defaults) {
    map.set(theme.name, theme)
  }

  for (const theme of customThemes) {
    map.set(theme.name, theme)
  }

  return [...map.values()]
}
