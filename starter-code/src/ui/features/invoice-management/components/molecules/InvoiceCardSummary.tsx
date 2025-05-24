import React from 'react';
import moment from 'moment';
import { InvoiceDetailProps } from '../../types/InvoiceDetail.type';

const InvoiceCardSummary: React.FC<InvoiceDetailProps> = ({
  invoice
}) => {

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount).replace(/^(£)/, '£ ');
  };

  const formatDate = (date: string): string => {
    return moment(date).format('DD MMM YYYY');
  };

  return (
    <div className="flex flex-col gap-8 p-6 rounded-lg">
      {/* First Section */}
      <div className="flex justify-between">
        <div className="space-y-2">
          <h2 className="text-text-light dark:text-text-dark text-lg"><span className="opacity-50">#</span><span className="font-bold">{invoice?.id}</span></h2>
          <p className="text-text-light dark:text-text-dark">{invoice?.description}</p>
          </div>
        <div className="text-right text-text-light dark:text-secondary">
          <p>{invoice?.senderAddress?.street}</p>
          <p>{invoice?.senderAddress?.city}</p>
          <p>{invoice?.senderAddress?.postCode}</p>
          <p>{invoice?.senderAddress?.country}</p>
        </div>
      </div>

      {/* Second Section */}
      <div className="grid grid-rows-1 grid-cols-3 gap-6">
        <div className="grid grid-rows-2 grid-cols-1 gap-6">
          <div>
            <p className="text-gray-500 mb-2 text-text-dark dark:text-muted">Invoice Date</p>
            <p className="font-bold text-text-light dark:text-text-dark">{formatDate(invoice?.createdAt)}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-2 text-text-dark dark:text-muted">Payment Due</p>
            <p className="font-bold text-text-light dark:text-text-dark">{formatDate(invoice?.paymentDue)}</p>
          </div>
        </div>
        <div>
          <p className="text-gray-500 mb-2 text-text-dark dark:text-muted">Bill To</p>
          <div className="text-text-light dark:text-secondary">
            <p className="font-bold text-text-light dark:text-text-dark">{invoice?.clientAddress?.street}</p>
            <p className="font-bold">{invoice?.clientAddress?.city}</p>
            <p className="font-bold">{invoice?.clientAddress?.postCode}</p>
            <p className="font-bold">{invoice?.clientAddress?.country}</p>
          </div>
        </div>
        <div>
          <p className="text-gray-500 mb-2 text-text-dark dark:text-muted">Sent to</p>
          <p className="font-bold text-text-light dark:text-text-dark">{invoice?.clientEmail}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCardSummary;
