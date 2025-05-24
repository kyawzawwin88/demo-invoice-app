import { InvoiceListingLoaderState, InvoiceListingResponse } from '../types/InvoiceListing.type';
import { CommonApiResponse } from '../../../shared/types/CommonApiResponse.type';

export const InvoiceListingService = {
  async getInvoices(invoiceListingLoaderState: InvoiceListingLoaderState): Promise<CommonApiResponse<InvoiceListingResponse>> {
    let url = `/api/invoices?page=${invoiceListingLoaderState.page}&limit=${invoiceListingLoaderState.limit}`;
    if (invoiceListingLoaderState.filter?.status) {
      url += `&status=${invoiceListingLoaderState.filter?.status}`;
    }
    const response = await fetch(url);
    return response.json();
  }
};