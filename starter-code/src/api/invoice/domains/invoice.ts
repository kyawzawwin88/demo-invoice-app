import { ApiProperty } from "@nestjs/swagger";
import { IAddress } from "./address";
import { InvoiceItem } from "./invoice-item";
import * as moment from 'moment';

export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PAID = 'paid',
  DELETED = 'deleted'
}

export enum PaymentTerms {
  ONE_DAY = 1,
  SEVEN_DAYS = 7,
  THIRTY_DAYS = 30
}

/**
 * Single invoice domain entity which contains all the entity fields excluding relations
 */
export interface IInvoice {
  id?: string;
  createdAt?: Date;
  paymentDue?: Date;
  description?: string;
  paymentTerms?: PaymentTerms;
  clientName?: string;
  clientEmail?: string;
  senderAddressId?: number;
  clientAddressId?: number;
  total?: number;
  status?: InvoiceStatus;
}

export interface PaginatedInvoice<T> {
  invoices: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Invoice domain plain object class which contains all the entity fields including relations.
 * Additionally, it has domain logic for invoice-specific operations.
 */
export class Invoice implements IInvoice {
  id: string;
  @ApiProperty({ type: Date })
  createdAt: Date;
  paymentDue: Date;
  @ApiProperty({ type: String })
  description: string;
  @ApiProperty({ enum: PaymentTerms })
  paymentTerms: PaymentTerms;
  @ApiProperty({ type: String })
  clientName: string;
  @ApiProperty({ type: String })
  clientEmail: string;
  senderAddressId?: number;
  clientAddressId?: number;
  senderAddress: IAddress;
  clientAddress: IAddress;
  items: Array<InvoiceItem>;
  total: number;
  deletedAt: Date;
  updatedAt: Date;
  status: InvoiceStatus;

  static build(): Invoice {
    const invoice = new Invoice();
    invoice.id = Invoice.generateInvoiceId();
    return invoice;
  }

  static generateInvoiceId(): string {
    const letters = Array(2)
      .fill(0)
      .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
      .join('');
    const numbers = Math.floor(1000 + Math.random() * 9000);
    return `${letters}${numbers}`;
  }

  calculatePaymentDue(): Date {
    if (!this.createdAt || !this.paymentTerms) {
      return null;
    }
    const paymentDueMoment = moment(this.createdAt).clone().add(this.paymentTerms, 'days');
    return paymentDueMoment.toDate();
  }

  calculateTotal(): number {
    if (!Array.isArray(this.items)) {
      return 0;
    }
    return this.items?.reduce((sum, item) => sum + item.total, 0);
  }

  toEntityInput(): IInvoice {
    return {
      id: this.id,
      createdAt: this.createdAt,
      paymentDue: this.paymentDue,
      description: this.description,
      paymentTerms: this.paymentTerms,
      clientName: this.clientName,
      clientEmail: this.clientEmail,
      senderAddressId: this.senderAddressId,
      clientAddressId: this.clientAddressId,
      total: this.total,
      status: this.status
    };
  }
}
