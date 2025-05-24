import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import InvoiceListing from './InvoiceListing';
import { useAllFeatureLayoutContext } from '../../../shared/hooks/AllFeatureLayoutContext';
import { useInvoiceListing } from '../hooks/useInvoiceListing';

// Mock dependencies
vi.mock('../../../shared/hooks/AllFeatureLayoutContext', () => ({
  useAllFeatureLayoutContext: vi.fn()
}));

vi.mock('../hooks/useInvoiceListing', () => ({
  useInvoiceListing: vi.fn()
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

describe('InvoiceListing', () => {
  const mockSetShouldInvoiceListingRefresh = vi.fn();
  const mockHandleLoadMore = vi.fn();
  const mockHandleFilterChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useAllFeatureLayoutContext as jest.Mock).mockReturnValue({
      shouldInvoiceListingRefresh: false,
      setShouldInvoiceListingRefresh: mockSetShouldInvoiceListingRefresh
    });

    (useInvoiceListing as jest.Mock).mockReturnValue({
      invoices: [],
      hasMore: false,
      loading: false,
      total: 0,
      handleLoadMore: mockHandleLoadMore,
      handleFilterChange: mockHandleFilterChange
    });
  });

  it('should render NotFound when there are no invoices and not loading', () => {
    render(<InvoiceListing />);
    expect(screen.getByTestId('not-found')).toBeInTheDocument();
  });

  it('should render InvoiceListingTable when there are invoices and not loading', () => {
    (useInvoiceListing as jest.Mock).mockReturnValue({
      invoices: [{ id: '1' }],
      hasMore: false,
      loading: false,
      total: 1,
      handleLoadMore: mockHandleLoadMore,
      handleFilterChange: mockHandleFilterChange
    });

    render(<InvoiceListing />);
    expect(screen.getByTestId('invoice-listing-table')).toBeInTheDocument();
  });

  it('should call useInvoiceListing with correct parameters', () => {
    const shouldRefresh = true;
    (useAllFeatureLayoutContext as jest.Mock).mockReturnValue({
      shouldInvoiceListingRefresh: shouldRefresh,
      setShouldInvoiceListingRefresh: mockSetShouldInvoiceListingRefresh
    });

    render(<InvoiceListing />);
    
    expect(useInvoiceListing).toHaveBeenCalledWith(
      shouldRefresh,
      expect.any(Function)
    );
  });
});
