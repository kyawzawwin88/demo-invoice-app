import { Invoice } from './invoice.type';
import { InvoiceStatus } from './invoice.type';

export interface InvoiceListingFilter {
  status?: string;
}

export interface InvoiceListingLoaderState {
  page: number;
  limit: number;
  filter?: InvoiceListingFilter;
  shouldRefresh?: boolean;
}

export interface InvoiceListingResponse {
  invoices: Invoice[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface InvoiceListingTableProps {
  onLoadMore: () => void;
  invoices: Invoice[];
  hasMore: boolean;
  loading: boolean;
}

export interface InvoiceListingToolbarProps {
  totalInvoices?: number;
  shouldInvoiceListingRefresh?: boolean;
  onSelectedMenuItemChange: (status: string) => void;
}

export interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}