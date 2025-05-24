import React from 'react';

import { useAllFeatureLayoutContext } from '../../../shared/hooks/AllFeatureLayoutContext';
import NotFound from '../../../shared/components/organisms/NotFound';

import InvoiceListingToolbar from '../components/molecules/InvoiceListingToolbar';
import InvoiceListingTable from '../components/organisms/InvoiceListingTable';

import { useInvoiceListing } from '../hooks/useInvoiceListing';

const InvoiceListing: React.FC = () => {
  const { shouldInvoiceListingRefresh, setShouldInvoiceListingRefresh } = useAllFeatureLayoutContext();
  const {
    invoices,
    hasMore,
    loading,
    total,
    handleLoadMore,
    handleFilterChange
  } = useInvoiceListing(
    shouldInvoiceListingRefresh,
    () => setShouldInvoiceListingRefresh(false)
  );

  return (
    <div className="flex flex-col gap-8 p-8 w-[1024px] max-w-[1024px] mx-auto">
      <InvoiceListingToolbar
        totalInvoices={total}
        shouldInvoiceListingRefresh={shouldInvoiceListingRefresh}
        onSelectedMenuItemChange={handleFilterChange}
      />

      {total === 0 && !loading && <NotFound />}
      {total > 0 && !loading && (
        <InvoiceListingTable
          invoices={invoices}
          hasMore={hasMore}
          loading={loading}
          onLoadMore={handleLoadMore}
        />
      )}
    </div>
  );
};

export default InvoiceListing;
