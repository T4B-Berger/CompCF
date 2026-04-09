export type CountryOption = {
  code: string
  name: string
  flag: string
  label: string
}

const EUROPE_REGION_CODES = new Set([
  'AL',
  'AD',
  'AM',
  'AT',
  'AZ',
  'BY',
  'BE',
  'BA',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'GE',
  'DE',
  'GR',
  'HU',
  'IS',
  'IE',
  'IT',
  'XK',
  'LV',
  'LI',
  'LT',
  'LU',
  'MT',
  'MD',
  'MC',
  'ME',
  'NL',
  'MK',
  'NO',
  'PL',
  'PT',
  'RO',
  'RU',
  'SM',
  'RS',
  'SK',
  'SI',
  'ES',
  'SE',
  'CH',
  'TR',
  'UA',
  'GB',
  'VA',
])

const flagFromCountryCode = (code: string) =>
  code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))

const getRegionCodes = () => {
  if (typeof Intl.supportedValuesOf === 'function') {
    return Intl.supportedValuesOf('region').filter((code) => /^[A-Z]{2}$/.test(code))
  }

  return ['FR', 'DE', 'ES', 'IT', 'GB', 'US', 'CA', 'AU', 'BR', 'JP']
}

export const getCountryOptions = () => {
  const regionCodes = getRegionCodes()
  const displayNames = new Intl.DisplayNames(['fr'], { type: 'region' })

  const rawOptions = regionCodes
    .map((code) => {
      const name = displayNames.of(code)
      if (!name) return null
      const flag = flagFromCountryCode(code)
      return {
        code,
        name,
        flag,
        label: `${flag} ${name}`,
      }
    })
    .filter((option): option is CountryOption => Boolean(option))

  const france = rawOptions.find((option) => option.code === 'FR')
  const europe = rawOptions
    .filter((option) => option.code !== 'FR' && EUROPE_REGION_CODES.has(option.code))
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
  const rest = rawOptions
    .filter((option) => option.code !== 'FR' && !EUROPE_REGION_CODES.has(option.code))
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'))

  return france ? [france, ...europe, ...rest] : [...europe, ...rest]
}

export const resolveCountryCode = (
  rawCountry: string | null | undefined,
  options: CountryOption[]
) => {
  const normalized = (rawCountry || '').trim()
  if (!normalized) return 'FR'

  const upper = normalized.toUpperCase()
  const byCode = options.find((option) => option.code === upper)
  if (byCode) return byCode.code

  const lower = normalized.toLowerCase()
  const byName = options.find((option) => option.name.toLowerCase() === lower)
  if (byName) return byName.code

  return 'FR'
}
