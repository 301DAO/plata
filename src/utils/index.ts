export * from './time'

export const percentage = (value: number, total: number) => (value / total) * 100

export const passEnsRegex = (name: string) => {
  if (!valueExists(name)) return false
  const regex = /^[a-zA-Z]{3,}(.eth)$/
  return regex.test(name)
}

export const passAddressRegex = (address: string) => {
  if (!valueExists(address)) return false
  const regex = /^(0x)?[0-9a-f]{40}$/i
  return regex.test(address)
}

export function base64Encode(str: string) {
  if (!valueExists(str)) return ''
  return Buffer.from(str, 'utf-8').toString('base64')
}

export const currency = (number: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(number)
}

export function eNotationToDecimal(value: number | string) {
  return parseFloat(`${value}`).toFixed(10)
}

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

export const valueExists = (value: any): boolean => value !== undefined && value !== null
