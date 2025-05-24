import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { AuditLog, PaginatedAuditLog } from '../domains/audit-log';
import { AuditLogResponse, AuditLogUsecases } from '../usecases';

class GetAuditLogListRequest {
  @ApiProperty({ type: Number })
  page?: number;
  @ApiProperty({ type: Number }) 
  limit?: number;
}

@Controller('api/audit-logs')
export class AuditLogController {
  constructor(
    @Inject(AuditLogUsecases)
    private readonly auditLogUsecases: AuditLogUsecases
  ) {}

  @Get('invoice/:id')
  @ApiOperation({ summary: 'Get audit log history for an invoice' })
  @ApiResponse({ status: 200, description: 'Audit log retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAuditLogsByInvoiceId(
    @Param('id') invoiceId: string,
    @Query() query?: GetAuditLogListRequest
  ): Promise<AuditLogResponse<PaginatedAuditLog<AuditLog>>> {
    return await this.auditLogUsecases.getAuditLogList.execute({
      invoiceId,
      page: query?.page,
      limit: query?.limit
    });
  }
}
