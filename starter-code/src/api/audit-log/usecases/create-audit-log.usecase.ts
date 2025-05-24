import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { AuditLog, AuditLogActionType } from '../domains/audit-log';
import { IAuditLogDAO } from '../infrastructures/audit-log.dao';
import { AuditLogResponse, AuditLogUsecase } from '.';
import * as moment from 'moment';

@Injectable()
export class CreateAuditLog implements AuditLogUsecase<CreateAuditLogParams, AuditLog> {
  private readonly logger = new Logger(CreateAuditLog.name);
  
  constructor(
    @Inject(IAuditLogDAO)
    private readonly auditLogDAO: IAuditLogDAO
  ) {}

  private generateMessage(actionType: AuditLogActionType, invoiceId: string): string {
    switch (actionType) {
      case AuditLogActionType.CREATED_DRAFT:
        return 'You\'ve created new invoice as draft';
      case AuditLogActionType.CREATED_PENDING:
        return 'You\'ve created new invoice as pending';
      case AuditLogActionType.UPDATED:
        return `You've updated invoice, ${invoiceId}`;
      case AuditLogActionType.MARK_AS_PAID:
        return `You've marked pending invoice, ${invoiceId}, as paid`;
      case AuditLogActionType.DELETED:
        return `You've deleted invoice, ${invoiceId}`;
      default:
        return 'Unknown action performed on invoice';
    }
  }

  async execute(params: CreateAuditLogParams): Promise<AuditLogResponse<AuditLog>> {
    this.logger.log(`Creating audit log for invoice ${params.invoiceId} with action type ${params.actionType}`);
    const startTime = moment();
    try {
      const { invoiceId, actionType, ipAddress, userAgent } = params;
      
      const auditLogData = {
        invoiceId,
        actionType,
        message: this.generateMessage(actionType, invoiceId),
        ipAddress,
        userAgent,
        actionAt: new Date()
      };

      const auditLogCreated = await this.auditLogDAO.create(auditLogData);

      const endTime = moment();
      return {
        status_code: HttpStatus.CREATED,
        status: 'Audit log created successfully',
        time_taken_in_ms: endTime.diff(startTime, 'milliseconds'),
        data: auditLogCreated
      };

    } catch (error) {
      this.logger.error(`Error creating audit log for invoice ${params.invoiceId} with action type ${params.actionType}: ${error.message}`);
      const endTime = moment();
      return {
        status_code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        status: error.message,
        time_taken_in_ms: endTime.diff(startTime, 'milliseconds'),
        data: null
      };
    }
  }
}

export interface CreateAuditLogParams {
  invoiceId: string;
  actionType: AuditLogActionType;
  ipAddress: string;
  userAgent: string;
}
