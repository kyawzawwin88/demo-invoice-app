import { useState, useEffect } from 'react';
import { InvoiceListingLoaderState } from '../types/InvoiceListing.type';
import { InvoiceListingService } from '../services/InvoiceListing.service';

export const useInvoiceListing = (shouldRefresh: boolean, onRefreshComplete: () => void) => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  
  const limit = 10;
  const [loaderState, setLoaderState] = useState<InvoiceListingLoaderState>({
    page: 1,
    limit: limit,
    filter: {},
    shouldRefresh: false
  });

  const fetchInvoices = async (invoiceListingLoaderState: InvoiceListingLoaderState) => {
    try {
      setLoading(true);
      const data = await InvoiceListingService.getInvoices(invoiceListingLoaderState);
      
      if (invoiceListingLoaderState.shouldRefresh) {
        setInvoices(data.data.invoices);
      } else {
        setInvoices(prev => [...prev, ...data.data.invoices]);
      }
      setHasMore(Number(data.data.currentPage) < Number(data.data.totalPages));
      setTotal(data.data.total);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(loaderState);
  }, [loaderState]);

  useEffect(() => {
    if (!shouldRefresh) return;
    
    setLoaderState({
      page: 1,
      limit: limit,
      filter: { status: '' },
      shouldRefresh: shouldRefresh
    });
    onRefreshComplete();
  }, [shouldRefresh, onRefreshComplete]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setLoaderState(prev => ({
        ...prev,
        page: prev.page + 1,
        shouldRefresh: false
      }));
    }
  };

  const handleFilterChange = (status: string) => {
    setLoaderState({
      page: 1,
      limit: limit,
      filter: { status },
      shouldRefresh: true
    });
    onRefreshComplete();
  };

  return {
    invoices,
    hasMore,
    loading,
    total,
    handleLoadMore,
    handleFilterChange
  };
};