export enum AuditActionType {
  CREATED_DRAFT = 'created_draft',
  CREATED_PENDING = 'created_pending',
  UPDATED = 'updated',
  MARK_AS_PAID = 'mark_as_paid',
  DELETED = 'deleted'
}

export interface CommonAuditLog {
  id: string;
  message: string;
  actionAt: string;
  actionType: AuditActionType;
  invoiceId: string;
}

export interface AuditLog extends CommonAuditLog {
  
}