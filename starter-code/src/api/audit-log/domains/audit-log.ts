import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

export enum AuditLogActionType {
  CREATED_DRAFT = 'created_draft',
  CREATED_PENDING = 'created_pending',
  UPDATED = 'updated',
  MARK_AS_PAID = 'mark_as_paid',
  DELETED = 'deleted'
}

export interface PaginatedAuditLog<T> {
  auditLogs: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}

/**
 * AuditLog domain entity interface.
 */
export interface IAuditLog {
  id?: number;
  invoiceId: string;
  message: string;
  actionType: AuditLogActionType;
  ipAddress: string;
  userAgent: string;
  actionAt: Date;
}

/**
 * AuditLog domain plain object class.
 */
export class AuditLog implements IAuditLog {
  @Exclude()
  id: number;

  @ApiProperty({ type: String })
  invoiceId: string;
  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ enum: [Object.values(AuditLogActionType)] })
  actionType: AuditLogActionType;

  @ApiProperty({ type: String })
  ipAddress: string;

  @ApiProperty({ type: String })
  userAgent: string;

  @ApiProperty({ type: Date })
  actionAt: Date;

  toEntityInput(): IAuditLog {
    return {
      id: this.id,
      invoiceId: this.invoiceId,
      message: this.message,
      actionType: this.actionType,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      actionAt: this.actionAt
    };
  }
}
