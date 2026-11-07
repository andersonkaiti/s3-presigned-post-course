const ONE_KILOBYTE = 1024
const ONE_MEGABYTE = 1024 * ONE_KILOBYTE

export const bytesToMB = (size: number) => (size / ONE_MEGABYTE).toFixed(2)
