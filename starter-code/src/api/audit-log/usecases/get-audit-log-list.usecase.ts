import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { AuditLog, PaginatedAuditLog } from '../domains/audit-log';
import { IAuditLogDAO } from '../infrastructures/audit-log.dao';
import { AuditLogResponse, AuditLogUsecase } from '.';
import * as moment from 'moment';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GetAuditLogList implements AuditLogUsecase<GetAuditLogListParams, PaginatedAuditLog<AuditLog>> {
  private readonly logger = new Logger(GetAuditLogList.name);
  
  constructor(
    @Inject(IAuditLogDAO)
    private readonly auditLogDAO: IAuditLogDAO
  ) {}

  async execute(params: GetAuditLogListParams): Promise<AuditLogResponse<PaginatedAuditLog<AuditLog>>> {
    this.logger.log(`Getting audit log list for invoice ${params.invoiceId}`);
    const startTime = moment();
    try {
      const { page = 1, limit = 10, invoiceId } = params;
      const paginatedAuditLogEntitiesFound = await this.auditLogDAO.findByInvoiceId(invoiceId, page, limit);
      const auditLogList = plainToInstance(AuditLog, paginatedAuditLogEntitiesFound.auditLogs);

      const endTime = moment();
      return {
        status_code: HttpStatus.OK,
        status: 'Audit logs retrieved successfully',
        time_taken_in_ms: endTime.diff(startTime, 'milliseconds'),
        data: {
          auditLogs: auditLogList,
          total: paginatedAuditLogEntitiesFound.total,
          currentPage: paginatedAuditLogEntitiesFound.currentPage,
          totalPages: paginatedAuditLogEntitiesFound.totalPages,
        },
      };

    } catch (error) {
      this.logger.error(`Error getting audit log list for invoice ${params.invoiceId}: ${error.message}`);
      const endTime = moment();
      return {
        status_code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        status: error.message,
        time_taken_in_ms: endTime.diff(startTime, 'milliseconds'),
        data: null,
      };
    }
  }
}

export interface GetAuditLogListParams {
  invoiceId: string;
  page?: number;
  limit?: number;
}
