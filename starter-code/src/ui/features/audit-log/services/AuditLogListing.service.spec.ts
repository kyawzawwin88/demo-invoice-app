import { AuditLogListingService } from './AuditLogListing.service';
import { vi } from 'vitest';

describe('AuditLogListingService', () => {
  const mockInvoiceId = 'invoice-123';
  const mockResponse = {
    data: {
      auditLogs: [
        {
          id: '1',
          actionAt: '2023-01-01T00:00:00Z',
          message: 'Invoice created',
          actionType: 'created_draft'
        }
      ],
      currentPage: 1,
      totalPages: 2,
      total: 10
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('should fetch audit logs successfully', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse)
    });

    const result = await AuditLogListingService.getAuditLogs(mockInvoiceId, 1, 10);

    expect(global.fetch).toHaveBeenCalledWith(
      `/api/audit-logs/invoice/${mockInvoiceId}?page=1&limit=10`
    );
    expect(result).toEqual(mockResponse);
  });

  it('should handle API errors', async () => {
    const mockError = new Error('API Error');
    (global.fetch as any).mockRejectedValueOnce(mockError);

    await expect(
      AuditLogListingService.getAuditLogs(mockInvoiceId, 1, 10)
    ).rejects.toThrow('API Error');
  });

  it('should handle invalid JSON response', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: () => Promise.reject(new Error('Invalid JSON'))
    });

    await expect(
      AuditLogListingService.getAuditLogs(mockInvoiceId, 1, 10)
    ).rejects.toThrow('Invalid JSON');
  });
});
