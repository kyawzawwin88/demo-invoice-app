import { InvoiceItem } from './invoiceItem.type';
import { Address } from './Address.type';

export enum InvoiceStatus {
  PAID = 'paid',
  PENDING = 'pending',
  DRAFT = 'draft'
}

export enum PaymentTerms {
  ONE_DAY = 1,
  SEVEN_DAYS = 7,
  THIRTY_DAYS = 30
}

// common fields in both api and ui
export interface CommonInvoice {
  id?: string;
  description?: string;
  senderAddress?: Address;
  clientAddress?: Address;
  createdAt?: string;
  clientName?: string;
  clientEmail?: string;
  paymentTerms?: PaymentTerms;
  status?: InvoiceStatus;
  items?: InvoiceItem[];
}

// dto to be used in api, post, put
export interface InvoiceDto extends CommonInvoice {
  
}

// type to be used in ui and getting data from api
export interface Invoice extends CommonInvoice {
  paymentDue?: string;
  total?: number;
}