import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useAuditLogListing } from './useAuditLogListing';
import { AuditLogListingService } from '../services/AuditLogListing.service';

// Mock the service
vi.mock('../services/AuditLogListing.service', () => ({
  AuditLogListingService: {
    getAuditLogs: vi.fn()
  }
}));

describe('useAuditLogListing', () => {
  const mockInvoiceId = 'test-invoice-id';
  const mockAuditLogs = [
    { id: '1', action: 'created' },
    { id: '2', action: 'updated' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch audit logs on initial render', async () => {
    (AuditLogListingService.getAuditLogs as jest.Mock).mockResolvedValueOnce({
      data: {
        auditLogs: mockAuditLogs,
        currentPage: 1,
        totalPages: 2,
        total: 20
      }
    });

    const { result } = renderHook(() => useAuditLogListing(mockInvoiceId));

    expect(result.current.loading).toBe(true);

    // Wait for the async operation to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(AuditLogListingService.getAuditLogs).toHaveBeenCalledWith(mockInvoiceId, 1, 10);
    expect(result.current.logs).toEqual(mockAuditLogs);
    expect(result.current.loading).toBe(false);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.total).toBe(20);
    expect(result.current.error).toBeNull();
  });

  it('should handle load more', async () => {
    (AuditLogListingService.getAuditLogs as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          auditLogs: mockAuditLogs,
          currentPage: 1,
          totalPages: 2,
          total: 20
        }
      })
      .mockResolvedValueOnce({
        data: {
          auditLogs: [{ id: '3', action: 'deleted' }],
          currentPage: 2,
          totalPages: 2,
          total: 20
        }
      });

    const { result } = renderHook(() => useAuditLogListing(mockInvoiceId));

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Trigger load more
    act(() => {
      result.current.handleLoadMore();
    });

    // Wait for second load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(AuditLogListingService.getAuditLogs).toHaveBeenCalledTimes(2);
    expect(result.current.logs).toHaveLength(3);
    expect(result.current.hasMore).toBe(false);
  });

  it('should handle error when fetching logs', async () => {
    const error = new Error('API Error');
    (AuditLogListingService.getAuditLogs as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuditLogListing(mockInvoiceId));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe('Failed to load audit logs');
    expect(result.current.loading).toBe(false);
  });

  it('should not load more when loading or no more data', async () => {
    (AuditLogListingService.getAuditLogs as jest.Mock).mockResolvedValueOnce({
      data: {
        auditLogs: mockAuditLogs,
        currentPage: 2,
        totalPages: 2,
        total: 20
      }
    });

    const { result } = renderHook(() => useAuditLogListing(mockInvoiceId));

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Try to load more when hasMore is false
    act(() => {
      result.current.handleLoadMore();
    });

    expect(AuditLogListingService.getAuditLogs).toHaveBeenCalledTimes(1);
  });
});
