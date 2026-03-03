export const DEFAULT_LANGUAGE = 'en'
export const SUPPORTED_LANGUAGES = ['en', 'ae'] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export function isSupportedLanguage(value?: string | null): value is SupportedLanguage {
  return Boolean(value && SUPPORTED_LANGUAGES.includes(value as SupportedLanguage))
}

export function normalizeLanguage(value?: string | null): SupportedLanguage {
  if (value && SUPPORTED_LANGUAGES.includes(value as SupportedLanguage)) {
    return value as SupportedLanguage
  }
  return DEFAULT_LANGUAGE
}

export function buildLanguageAlternates(
  baseUrl: string,
  pathname: string,
  languages: string[],
): Record<string, string> {
  const normalizedBase = baseUrl.replace(/\/$/, '')
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  const filtered = Array.from(new Set(languages.map((value) => normalizeLanguage(value))))

  return filtered.reduce<Record<string, string>>((acc, language) => {
    const localizedPath = language === DEFAULT_LANGUAGE ? normalizedPath : `/${language}${normalizedPath}`
    acc[language] = `${normalizedBase}${localizedPath}`
    return acc
  }, {})
}
