import React from 'react';

import { InvoiceStatusBadgeProps } from '../../types/InvoiceListing.type';

const InvoiceStatusBadge: React.FC<InvoiceStatusBadgeProps> = ({ status }) => {
  const getButtonStatusStyles = () => {
    switch (status) {
      case 'draft':
        return 'bg-status-draft-bg text-text-dark dark:text-status-draft';
      case 'pending':
        return `bg-status-pending-bg text-text-dark dark:text-status-pending`; 
      case 'paid':
        return 'bg-status-paid-bg text-status-paid';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getIndicatorStatusStyles = () => {
    switch (status) {
      case 'draft':
        return 'bg-status-draft-indicator';
      case 'pending':
        return 'bg-status-pending-indicator';
      case 'paid':
        return 'bg-status-paid-indicator';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <span className={`inline-flex justify-center items-center px-4 py-2 rounded-md font-medium capitalize text-sm w-25 ${getButtonStatusStyles()}`}>
      <span className={`w-2 h-2 rounded-full mr-2 ${getIndicatorStatusStyles()}`}></span>
      {status}
    </span>
  );
};

export default InvoiceStatusBadge;
