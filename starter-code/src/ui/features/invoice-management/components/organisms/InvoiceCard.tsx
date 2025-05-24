import React from 'react';
import InvoiceCardSummary from '../molecules/InvoiceCardSummary';
import InvoiceCardItems from '../molecules/InvoiceCardItems';

import { InvoiceDetailProps } from '../../types/InvoiceDetail.type';

const InvoiceCard: React.FC<InvoiceDetailProps> = ({ invoice }) => {
  return (
    <div className="bg-primary-light dark:bg-surface-dark rounded-lg shadow-md">
      <section className="p-6">
        <InvoiceCardSummary
          invoice={invoice}
        />
      </section>

      <section className="p-12">
        <InvoiceCardItems items={invoice?.items} total={invoice?.total} />
      </section>
    </div>
  );
};

export default InvoiceCard;
