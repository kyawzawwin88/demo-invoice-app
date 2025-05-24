import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { IInvoiceDAO } from '../infrastructures/invoice.dao';
import { Invoice, InvoiceStatus } from '../domains/invoice';
import { InvoiceResponse, InvoiceUsecase } from '.';
import * as moment from 'moment';
import { CreateAuditLog } from '@app/api/audit-log/usecases/create-audit-log.usecase';
import { AuditLogActionType } from '@app/api/audit-log/domains/audit-log';

@Injectable()
export class MarkPendingInvoiceAsPaidUseCase implements InvoiceUsecase<MarkPendingInvoiceAsPaidParams, Invoice> {
  private readonly logger = new Logger(MarkPendingInvoiceAsPaidUseCase.name);
  constructor(
    @Inject(IInvoiceDAO)
    private invoiceDao: IInvoiceDAO,
    private createAuditLog: CreateAuditLog,
  ) {}

  async execute(params: MarkPendingInvoiceAsPaidParams): Promise<InvoiceResponse<Invoice>> {
    this.logger.log(`Marking pending invoice as paid with params: ${JSON.stringify(params)}`);
    const startTime = moment();
    try {
      const invoice = await this.invoiceDao.findById(params.id);

      if (!invoice) {
        throw new Error('Invoice not found');
      }

      if (invoice.status !== InvoiceStatus.PENDING) {
        throw new Error('Only pending invoices can be marked as paid');
      }

      const invoiceUpdated = await this.invoiceDao.markPendingInvoiceAsPaid(params.id);

      await this.createAuditLog.execute({
        invoiceId: invoiceUpdated.id,
        actionType: AuditLogActionType.MARK_AS_PAID,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      });

      const endTime = moment();
      return {
        status_code: HttpStatus.OK,
        status: 'Invoice marked as paid successfully',
        time_taken_in_ms: endTime.diff(startTime, 'milliseconds'),
        data: invoiceUpdated,
      };

    } catch (error) {
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

export interface MarkPendingInvoiceAsPaidParams {
  id: string;
  ipAddress: string;
  userAgent: string;
}
