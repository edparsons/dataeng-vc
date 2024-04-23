import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(dateTimeStr: string | null) {
  if (!dateTimeStr) {
    return '';
  }
  const date = new Date(dateTimeStr);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Los_Angeles',
    year: '2-digit',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  return date.toLocaleString('en-US', options);
}

export const getRootDomain = (url: string | null) => {
  if (!url) return '';
  let domain = url.split('/')[2];
  if (!domain) {
    console.error('No domain found for url', url)
  }
  if (domain?.split('.').length > 2) {
    domain = domain.split('.').slice(1).join('.')
  }
  return domain;
}

export const formatCurrency = new Intl.NumberFormat(undefined, {
	style: 'currency',
	currency: 'USD'
});
