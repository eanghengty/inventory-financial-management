export const fmtMoney = n => '$' + Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const today = () => new Date().toISOString().split('T')[0]

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5)

export const fmtDate = dateStr => {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}
