export * from './time';

export const randomArrayElement = <T>(array: T[]): T => array[~~(Math.random() * array.length)];

export const percentage = (value: number, total: number) => (value / total) * 100;

export const eNotationToDecimal = (value: number | string) => parseFloat(`${value}`).toFixed(10);

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const valueExists = (value: any): boolean => value !== undefined && value !== null;

export const base64Encode = (s: string) =>
  valueExists(s) ? Buffer.from(s).toString('base64') : '';

export const maxInObject = (array: any[], key: string) =>
  array.reduce((a, b) => (a[key] > b[key] ? a : b));
export const minInObject = (array: any[], key: string) =>
  array.reduce((a, b) => (a[key] < b[key] ? a : b));

export const passEnsRegex = (name: string) => {
  const regex = /^[a-zA-Z]{3,}(.eth)$/;
  if (!valueExists(name)) return false;
  return regex.test(name);
};

export const passEthAddressRegex = (address: string) => {
  if (!valueExists(address)) return false;
  const regex = /^(0x)?[0-9a-f]{40}$/i;
  return regex.test(address);
};

export const currency = (number: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(number);
};
