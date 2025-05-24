import { Invoice } from '../types/Invoice.type';
import { CommonApiResponse } from '../../../shared/types/CommonApiResponse.type';
import { InvoiceStatus } from '../types/Invoice.type';

export type AllowedCreateInvoiceStatus = InvoiceStatus.DRAFT | InvoiceStatus.PENDING;

export const InvoiceFormService = {
  async createInvoice(data: any, status: AllowedCreateInvoiceStatus): Promise<CommonApiResponse<Invoice>> {
    if (data?.invoice?.paymentTerms) {
      data.invoice.paymentTerms = Number(data.invoice.paymentTerms);
    }
    const response = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        is_save_and_send: status === 'pending'
      })
    });
    return response.json();
  },

  async updateInvoice(id: string, data: any): Promise<CommonApiResponse<Invoice>> {
    const response = await fetch(`/api/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};