import { Invoice } from '../types/Invoice.type';
import { CommonApiResponse } from '../../../shared/types/CommonApiResponse.type';

export const InvoiceDetailService = {
  async getInvoiceDetail(id: string): Promise<CommonApiResponse<Invoice>> {
    const response = await fetch(`/api/invoices/${id}`);
    return response.json();
  },

  async updatePendingInvoiceAsPaid(id: string): Promise<CommonApiResponse<Invoice>> {
    const response = await fetch(`/api/invoices/${id}/mark-pending-invoice-as-paid`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.json();
  },

  async deleteInvoice(id: string): Promise<CommonApiResponse<Invoice>> {
    const response = await fetch(`/api/invoices/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.json();
  }
};