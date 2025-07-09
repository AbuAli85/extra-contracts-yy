/**
 * Utility functions for formatting data
 */

<<<<<<< HEAD
export const formatCurrency = (amount?: number, currency?: string): string => {
=======
export const formatCurrency = (amount?: number, currency?: string | null): string => {
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
  if (!amount) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD'
  }).format(amount)
}

<<<<<<< HEAD
export const formatDate = (dateString?: string): string => {
=======
export const formatDate = (dateString?: string | null): string => {
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

<<<<<<< HEAD
export const formatDateTime = (dateString?: string): string => {
=======
export const formatDateTime = (dateString?: string | null): string => {
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}

<<<<<<< HEAD
export const calculateDuration = (startDate?: string, endDate?: string): string => {
=======
export const calculateDuration = (startDate?: string | null, endDate?: string | null): string => {
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
  if (!startDate || !endDate) return 'N/A'
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 30) return `${diffDays} days`
  if (diffDays < 365) return `${Math.round(diffDays / 30)} months`
  return `${Math.round(diffDays / 365)} years`
}

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}
