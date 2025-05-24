import moment from 'moment';

export const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'GBP'
  }).format(amount).replace(/^(£)/, '£ ');
};

export const formatDate = (date: string): string => {
  return moment(date).format('DD MMM YYYY');
};

export const formatDateTime = (date: string): string => {
  return moment(date).format('DD MMM YYYY HH:mm:ss');
};