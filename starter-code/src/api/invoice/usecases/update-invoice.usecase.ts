import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IInvoiceDAO } from '../infrastructures/invoice.dao';
import { IInvoice, Invoice, InvoiceStatus } from '../domains/invoice';
import { InvoiceResponse, InvoiceUsecase } from '.';
import * as moment from 'moment';
import { IAddress } from '../domains/address';
import { IInvoiceItem, InvoiceItem } from '../domains/invoice-item';
import { IAddressDAO } from '../infrastructures/address.dao';
import { CreateAuditLog } from '@app/api/audit-log/usecases/create-audit-log.usecase';
import { AuditLogActionType } from '@app/api/audit-log/domains/audit-log';
@Injectable()
export class UpdateInvoiceUseCase implements InvoiceUsecase<UpdateInvoiceParams, Invoice> {
  constructor(
    @Inject(IInvoiceDAO)
    private invoiceDao: IInvoiceDAO,
    @Inject(IAddressDAO)
    private addressDao: IAddressDAO,
    private createAuditLog: CreateAuditLog,
  ) {}

  async execute(params: UpdateInvoiceParams): Promise<InvoiceResponse<Invoice>> {
    const startTime = moment();
    try {
      const invoice = await this.invoiceDao.findById(params.id);

      if (!invoice) {
        throw new Error('Invoice not found');
      }

      if (invoice?.status === InvoiceStatus.PAID) {
        throw new Error('Paid invoices cannot be updated');
      }

      Object.assign(invoice, params.invoice);

      invoice.paymentDue = invoice.calculatePaymentDue();

      if (invoice.status === InvoiceStatus.DRAFT) {
        invoice.status = InvoiceStatus.PENDING;
      }

      if (params.senderAddress) {
        const senderAddress = await this.addressDao.findOrCreate(params.senderAddress);
        invoice.senderAddressId = senderAddress.id;
      }
      
      if (params.clientAddress) {
        const clientAddress = await this.addressDao.findOrCreate(params.clientAddress);
        invoice.clientAddressId = clientAddress.id;
      }

      const invoiceItems = params.invoiceItems?.map((item: IInvoiceItem): InvoiceItem => {
        const invoiceItem = new InvoiceItem();
        Object.assign(invoiceItem, item);
        invoiceItem.invoiceId = invoice.id;
        invoiceItem.total = invoiceItem.calculateItemTotal();
        return invoiceItem;
      });

      invoice.items = invoiceItems;
      invoice.total = invoice.calculateTotal();

      const invoiceUpdated = await this.invoiceDao.update(params.id, invoice.toEntityInput(), invoiceItems?.map((item) => item.toEntityInput()));

      await this.createAuditLog.execute({
        invoiceId: invoiceUpdated.id,
        actionType: AuditLogActionType.UPDATED,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      });
      
      const endTime = moment();
      return {
        status_code: HttpStatus.OK,
        status: 'Invoice updated successfully',
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

export interface UpdateInvoiceParams {
  id: string;
  invoice: IInvoice;
  senderAddress?: IAddress;
  clientAddress?: IAddress;
  invoiceItems: IInvoiceItem[];
  ipAddress: string;
  userAgent: string;
}
