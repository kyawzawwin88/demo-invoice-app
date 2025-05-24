import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useInvoiceListing } from './useInvoiceListing';
import { InvoiceListingService } from '../services/InvoiceListing.service';
import { InvoiceStatus } from '../types/Invoice.type';

vi.mock('../services/InvoiceListing.service', () => ({
  InvoiceListingService: {
    getInvoices: vi.fn()
  }
}));

describe('useInvoiceListing', () => {
  const mockResponse = {
    data: {
      invoices: [
        {
          id: '1',
          amount: 100,
          status: InvoiceStatus.PENDING,
          items: [],
          total: 100
        },
        {
          id: '2',
          amount: 200,
          status: InvoiceStatus.PENDING,
          items: [],
          total: 200
        }
      ],
      total: 2,
      currentPage: 1,
      totalPages: 2
    },
    status_code: 200,
    status: 'success',
    time_taken_in_ms: 100
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch invoices on mount', async () => {
    vi.mocked(InvoiceListingService.getInvoices).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useInvoiceListing(false, vi.fn()));

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.invoices).toEqual(mockResponse.data.invoices);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.total).toBe(mockResponse.data.total);
  });

  it('should handle load more', async () => {
    vi.mocked(InvoiceListingService.getInvoices)
      .mockResolvedValueOnce(mockResponse)
      .mockResolvedValueOnce({
        ...mockResponse,
        data: {
          ...mockResponse.data,
          currentPage: 2,
          invoices: [
            {
              id: '3',
              status: InvoiceStatus.PENDING,
              items: [],
              total: 300
            },
            {
              id: '4',
              status: InvoiceStatus.PENDING,
              items: [],
              total: 400
            }
          ]
        }
      });

    const { result } = renderHook(() => useInvoiceListing(false, vi.fn()));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.invoices).toEqual(mockResponse.data.invoices);

    await act(async () => {
      result.current.handleLoadMore();
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.invoices).toEqual([
      ...mockResponse.data.invoices,
      {
        id: '3',
        status: InvoiceStatus.PENDING,
        items: [],
        total: 300
      },
      {
        id: '4',
        status: InvoiceStatus.PENDING,
        items: [],
        total: 400
      }
    ]);
  });

  it('should handle filter change', async () => {
    const filteredResponse = {
      ...mockResponse,
      data: {
        ...mockResponse.data,
        invoices: [
          {
            id: '1',
            status: InvoiceStatus.PENDING,
            items: [],
            total: 100
          }
        ],
        total: 1
      }
    };

    vi.mocked(InvoiceListingService.getInvoices)
      .mockResolvedValueOnce(mockResponse)
      .mockResolvedValueOnce(filteredResponse);

    const { result } = renderHook(() => useInvoiceListing(false, vi.fn()));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      result.current.handleFilterChange('paid');
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.invoices).toEqual(filteredResponse.data.invoices);
    expect(result.current.total).toBe(filteredResponse.data.total);
  });

  it('should handle fetch error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(InvoiceListingService.getInvoices).mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => useInvoiceListing(false, vi.fn()));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.invoices).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching invoices:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});
