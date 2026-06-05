/**
 * Format currency amount
 */
export const formatCurrency = (amount: number, currency: string = 'XOF'): string => {
  return new Intl.NumberFormat('fr-CI', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date to readable format
 */
export const formatDate = (date: string | Date, format: 'short' | 'long' = 'short'): string => {
  const d = new Date(date);
  
  if (format === 'short') {
    return d.toLocaleDateString('fr-CI', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    });
  }
  
  return d.toLocaleDateString('fr-CI', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format time to readable format
 */
export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('fr-CI', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format datetime
 */
export const formatDateTime = (date: string | Date): string => {
  return `${formatDate(date, 'short')} ${formatTime(date)}`;
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (seconds < 60) return 'À l\'instant';
  if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `Il y a ${Math.floor(seconds / 86400)}j`;
  
  return formatDate(date, 'short');
};

/**
 * Calculate transaction fee
 */
export const calculateFee = (amount: number, feePercentage: number): number => {
  return Math.ceil((amount * feePercentage) / 100);
};

/**
 * Calculate total amount including fee
 */
export const calculateTotal = (amount: number, feePercentage: number): number => {
  return amount + calculateFee(amount, feePercentage);
};

/**
 * Truncate string with ellipsis
 */
export const truncate = (text: string, length: number = 50): string => {
  return text.length > length ? `${text.slice(0, length)}...` : text;
};
