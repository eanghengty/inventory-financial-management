export const PALETTE = [
  '#00b87a','#4d9fff','#ff6b35','#a855f7',
  '#f59e0b','#ec4899','#06b6d4','#84cc16','#f97316','#6366f1'
]

export const TXN_CATS = {
  income:  ['Product Sales', 'Service Revenue', 'Returns & Refunds', 'Other Income'],
  expense: ['Supplier Payment', 'Rent', 'Utilities', 'Salaries', 'Shipping', 'Marketing', 'Equipment', 'Maintenance', 'Other']
}

export function stockStatus(p) {
  if (p.qty === 0)        return 'out'
  if (p.qty <= p.reorder) return 'low'
  return 'ok'
}
