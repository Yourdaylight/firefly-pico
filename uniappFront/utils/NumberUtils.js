import { useProfileStore } from '@/stores/profileStore'

export const NUMBER_FORMAT = {
  eu: { name: '1234.56 -> 1.234,56', code: 'de-DE' },
  international: { name: '1234.56 -> 1,234.56', code: 'en-EN' },
}

export const formatNumber = (value, digits) => {
  const profileStore = useProfileStore()
  let numberFormatCode = profileStore.numberFormat.code ?? NUMBER_FORMAT.eu.code

  return new Intl.NumberFormat(numberFormatCode, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

export const formatNumberForDashboard = (value) => {
  const profileStore = useProfileStore()
  if (!profileStore.dashboard.showAccountAmounts) {
    return '******'
  }
  let digits = profileStore.dashboard.showDecimal ? 2 : 0
  return formatNumber(value, digits)
}
