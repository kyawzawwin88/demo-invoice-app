import { AuditLog } from "./AuditLog.type";

export interface AuditLogTableProps {
  invoiceId: string;
}

export interface AuditLogListingResponse {
  auditLogs: AuditLog[];
  total: number;
  currentPage: number;
  totalPages: number;
}