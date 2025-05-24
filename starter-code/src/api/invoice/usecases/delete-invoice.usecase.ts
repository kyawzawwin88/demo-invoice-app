import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { IInvoiceDAO } from '../infrastructures/invoice.dao';
import { Invoice, InvoiceStatus } from '../domains/invoice';
import { InvoiceResponse, InvoiceUsecase } from '.';
import * as moment from 'moment';
import { CreateAuditLog } from '@app/api/audit-log/usecases/create-audit-log.usecase';
import { AuditLogActionType } from '@app/api/audit-log/domains/audit-log';

@Injectable()
export class DeleteInvoiceUseCase implements InvoiceUsecase<DeleteInvoiceParams, Invoice> {
  private readonly logger = new Logger(DeleteInvoiceUseCase.name);

  constructor(
    @Inject(IInvoiceDAO)
    private invoiceDao: IInvoiceDAO,
    private createAuditLog: CreateAuditLog,
  ) {}

  async execute(params: DeleteInvoiceParams): Promise<InvoiceResponse<Invoice>> {
    this.logger.log(`Deleting invoice with params: ${JSON.stringify(params)}`);
    const startTime = moment();
    try {
      const invoice = await this.invoiceDao.findById(params.id);

      if (!invoice) {
        throw new Error('Invoice not found');
      }

      if (invoice.status === InvoiceStatus.PAID) {
        throw new Error('Paid invoices cannot be deleted');
      }

      const invoiceDeleted = await this.invoiceDao.deleteById(params.id);

      await this.createAuditLog.execute({
        invoiceId: invoiceDeleted.id,
        actionType: AuditLogActionType.DELETED,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      });

      const endTime = moment();
      return {
        status_code: HttpStatus.OK,
        status: 'Invoice deleted successfully',
        time_taken_in_ms: endTime.diff(startTime, 'milliseconds'),
        data: invoiceDeleted,
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

export interface DeleteInvoiceParams {
  id: string;
  ipAddress: string;
  userAgent: string;
}
