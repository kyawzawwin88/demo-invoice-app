import { CommonApiResponse } from '../../../shared/types/CommonApiResponse.type';
import { AuditLogListingResponse } from '../types/AuditLogListing.type';

export const AuditLogListingService = {
  async getAuditLogs(invoiceId: string, page: number, limit: number): Promise<CommonApiResponse<AuditLogListingResponse>> {
    const response = await fetch(`/api/audit-logs/invoice/${invoiceId}?page=${page}&limit=${limit}`);
    return await response.json();
  }
};