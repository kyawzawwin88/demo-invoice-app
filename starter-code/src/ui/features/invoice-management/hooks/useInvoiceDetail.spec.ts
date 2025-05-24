import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useInvoiceDetail } from './useInvoiceDetail';
import { InvoiceDetailService } from '../services/InvoiceDetail.service';
import { InvoiceStatus } from '../types/Invoice.type';
vi.mock('../services/InvoiceDetail.service', () => ({
  InvoiceDetailService: {
    getInvoiceDetail: vi.fn(),
    updatePendingInvoiceAsPaid: vi.fn(),
    deleteInvoice: vi.fn()
  }
}));

describe('useInvoiceDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch invoice details on mount', async () => {
    const mockInvoice = {
      data: {
        id: '1',
        status: InvoiceStatus.DRAFT,
        items: [],
        total: 100
      },
      status_code: 200,
      status: 'success',
      time_taken_in_ms: 100
    };
    vi.mocked(InvoiceDetailService.getInvoiceDetail).mockResolvedValueOnce(mockInvoice);

    const { result } = renderHook(() => useInvoiceDetail('1'));

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.invoice).toEqual(mockInvoice.data);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    vi.mocked(InvoiceDetailService.getInvoiceDetail).mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => useInvoiceDetail('1'));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Failed to load invoice');
    expect(result.current.invoice).toBeNull();
  });

  it('should handle marking invoice as paid', async () => {
    const mockResponse = {
      data: null,
      status_code: 200,
      status: 'success',
      time_taken_in_ms: 100
    };
    vi.mocked(InvoiceDetailService.updatePendingInvoiceAsPaid).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useInvoiceDetail('1'));

    await act(async () => {
      await result.current.handleMarkAsPaid();
    });

    expect(result.current.actionMessage).toBe("You've marked pending invoice #1, as paid");
  });

  it('should handle mark as paid error', async () => {
    vi.mocked(InvoiceDetailService.updatePendingInvoiceAsPaid).mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => useInvoiceDetail('1'));

    await act(async () => {
      await result.current.handleMarkAsPaid();
    });

    expect(result.current.error).toBe('Failed to mark pending invoice as paid');
    expect(result.current.actionMessage).toBeNull();
  });

  it('should handle deleting invoice', async () => {
    const mockResponse = {
      data: {
        id: '1',
        status: InvoiceStatus.DRAFT,
        items: [],
        total: 100
      },
      status_code: 200,
      status: 'success',
      time_taken_in_ms: 100
    };
    vi.mocked(InvoiceDetailService.deleteInvoice).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useInvoiceDetail('1'));

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(result.current.actionMessage).toBe("You've deleted the invoice #1");
  });

  it('should handle delete error', async () => {
    vi.mocked(InvoiceDetailService.deleteInvoice).mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => useInvoiceDetail('1'));

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(result.current.error).toBe('Failed to delete invoice #1');
    expect(result.current.actionMessage).toBeNull();
  });

  it('should refresh invoice details', async () => {
    const mockInvoice = {
      data: {
        id: '1',
        status: InvoiceStatus.DRAFT,
        items: [],
        total: 100
      },
      status_code: 200,
      status: 'success',
      time_taken_in_ms: 100
    };
    vi.mocked(InvoiceDetailService.getInvoiceDetail).mockResolvedValueOnce(mockInvoice);

    const { result } = renderHook(() => useInvoiceDetail('1'));

    await act(async () => {
      await result.current.refreshInvoice();
    });

    expect(result.current.invoice).toEqual(mockInvoice.data);
    expect(InvoiceDetailService.getInvoiceDetail).toHaveBeenCalledTimes(2); // Initial + refresh
  });
});
