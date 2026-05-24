const noopTranslator = {
  name: 'noop',
  async translate(text) {
    return text
  },
}

const translators = {
  noop: noopTranslator,
}

export function resolveTranslator(provider = 'noop') {
  return translators[provider] ?? noopTranslator
}

export async function translateSummary({
  text,
  sourceLanguage,
  targetLanguage = 'English',
  provider = 'noop',
}) {
  const normalizedText = text?.toString().trim()
  if (!normalizedText) {
    return null
  }

  const fromLanguage = sourceLanguage?.toString().trim().toLowerCase()
  const toLanguage = targetLanguage?.toString().trim().toLowerCase()

  if (fromLanguage && toLanguage && fromLanguage === toLanguage) {
    return normalizedText
  }

  const translator = resolveTranslator(provider)
  return translator.translate(normalizedText, { sourceLanguage, targetLanguage })
}
