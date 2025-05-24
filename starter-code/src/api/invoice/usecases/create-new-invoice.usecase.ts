import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { IInvoiceDAO } from '../infrastructures/invoice.dao';
import { IInvoice, Invoice, InvoiceStatus } from '../domains/invoice';
import { InvoiceResponse, InvoiceUsecase } from '.';
import * as moment from 'moment';
import { IAddressDAO } from '../infrastructures/address.dao';
import { Address, IAddress } from '../domains/address';
import { IInvoiceItem, InvoiceItem } from '../domains/invoice-item';
import { AuditLogActionType } from '@app/api/audit-log/domains/audit-log';
import { CreateAuditLog } from '@app/api/audit-log/usecases/create-audit-log.usecase';

@Injectable()
export class CreateNewInvoiceUseCase implements InvoiceUsecase<CreateNewInvoiceParams, Invoice> {
  private readonly logger = new Logger(CreateNewInvoiceUseCase.name);

  constructor(
    @Inject(IInvoiceDAO)
    private invoiceDao: IInvoiceDAO,
    @Inject(IAddressDAO)
    private addressDao: IAddressDAO,
    private createAuditLog: CreateAuditLog,
  ) {}

  async execute(params: CreateNewInvoiceParams): Promise<InvoiceResponse<Invoice>> {
    this.logger.log(`Creating invoice with params: ${JSON.stringify(params)}`);
    const startTime = moment();
    try {
      if (params.is_save_and_send) {
        this.validateSaveAndSendInvoice(params);
      }

      let invoice;
      let attempts = 0;
      const maxAttempts = 3;

      do {
        invoice = Invoice.build();
        const existingInvoice = await this.invoiceDao.findById(invoice.id);
        if (!existingInvoice) {
          break;
        }
        attempts++;
      } while (attempts < maxAttempts);

      if (attempts >= maxAttempts || !invoice) {
        throw new Error('Failed to generate unique invoice ID after 3 attempts');
      }
      Object.assign(invoice, params.invoice);
      
      // Save addresses first to get IDs
      if (params.senderAddress) {
        const senderAddress = new Address();
        Object.assign(senderAddress, params.senderAddress);
        const senderAddressCreated = await this.addressDao.findOrCreate(senderAddress.toEntityInput());
        invoice.senderAddressId = senderAddressCreated.id;
      }
      
      if (params.clientAddress) {
        const clientAddress = new Address();
        Object.assign(clientAddress, params.clientAddress);
        const clientAddressCreated = await this.addressDao.findOrCreate(clientAddress.toEntityInput());
        invoice.clientAddressId = clientAddressCreated.id;
      }

      invoice.paymentDue = invoice.calculatePaymentDue();

      const invoiceItems = params.invoiceItems?.map((item: IInvoiceItem) => {
        const invoiceItem = new InvoiceItem();
        Object.assign(invoiceItem, item);
        invoiceItem.invoiceId = invoice.id;
        invoiceItem.total = invoiceItem.calculateItemTotal();
        return invoiceItem;
      });

      invoice.items = invoiceItems;
      invoice.total = invoice.calculateTotal();


      const invoiceCreated = await this.invoiceDao.create(
        {
          ...invoice.toEntityInput(),
          status: params.is_save_and_send ? InvoiceStatus.PENDING : InvoiceStatus.DRAFT,
        },
        invoiceItems
      );

      await this.createAuditLog.execute({
        invoiceId: invoiceCreated.id,
        actionType: invoiceCreated.status === InvoiceStatus.PENDING ? AuditLogActionType.CREATED_PENDING : AuditLogActionType.CREATED_DRAFT,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      });

      const endTime = moment();
      return {
        status_code: HttpStatus.CREATED,
        status: 'Invoice created successfully',
        time_taken_in_ms: endTime.diff(startTime, 'milliseconds'),
        data: invoiceCreated,
      };;
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

  validateSaveAndSendInvoice(params: CreateNewInvoiceParams) {
    if (!params.invoice.clientName) {
      throw new Error('Client name is required when saving and sending invoice');
    }
    if (!params.invoice.clientEmail) {
      throw new Error('Client email is required when saving and sending invoice'); 
    }
    if (!params.invoice.createdAt) {
      throw new Error('Created date is required when saving and sending invoice');
    }
    if (!params.invoice.paymentTerms) {
      throw new Error('Payment terms are required when saving and sending invoice');
    }
    if (!params.invoice.description) {
      throw new Error('Description is required when saving and sending invoice');
    }
    if (!params.senderAddress) {
      throw new Error('Sender address is required when saving and sending invoice');
    }
    if (!params.senderAddress.street) {
      throw new Error('Sender street address is required when saving and sending invoice');
    }
    if (!params.senderAddress.city) {
      throw new Error('Sender city is required when saving and sending invoice');
    }
    if (!params.senderAddress.postCode) {
      throw new Error('Sender post code is required when saving and sending invoice');
    }
    if (!params.senderAddress.country) {
      throw new Error('Sender country is required when saving and sending invoice');
    }
    if (!params.clientAddress) {
      throw new Error('Client address is required when saving and sending invoice');
    }
    if (!params.clientAddress.street) {
      throw new Error('Client street address is required when saving and sending invoice');
    }
    if (!params.clientAddress.city) {
      throw new Error('Client city is required when saving and sending invoice');
    }
    if (!params.clientAddress.postCode) {
      throw new Error('Client post code is required when saving and sending invoice');
    }
    if (!params.clientAddress.country) {
      throw new Error('Client country is required when saving and sending invoice');
    }
    if (!params.invoiceItems?.length) {
      throw new Error('At least one invoice item is required when saving and sending invoice');
    }
    for (const item of params.invoiceItems) {
      if (!item.name) {
        throw new Error('Item name is required for all invoice items when saving and sending invoice');
      }
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        throw new Error('Valid quantity is required for all invoice items when saving and sending invoice');
      }
      if (typeof item.price !== 'number' || item.price <= 0) {
        throw new Error('Valid price is required for all invoice items when saving and sending invoice'); 
      }
    }
  }
}

export interface CreateNewInvoiceParams {
  invoice: IInvoice;
  senderAddress?: IAddress;
  clientAddress?: IAddress;
  invoiceItems?: IInvoiceItem[];
  is_save_and_send?: boolean;
  ipAddress: string;
  userAgent: string;
}