import { Invoice, PaginatedInvoice } from "../domains/invoice";
import { CreateNewInvoiceParams } from "./create-new-invoice.usecase";
import { DeleteInvoiceParams } from "./delete-invoice.usecase";
import { GetInvoiceDetailParams } from "./get-invoice-detail.usecase";
import { GetInvoiceListParams } from "./get-invoice-list.usecase";
import { MarkPendingInvoiceAsPaidParams } from "./mark-pending-invoice-as-paid.usecase";
import { UpdateInvoiceParams } from "./update-invoice.usecase";

export type InvoiceResponse<R> = {
  status_code: number;
  status: string;
  time_taken_in_ms: number;
  data: R;
};

export interface InvoiceUsecase<P, R> {
  execute(
    params?: P,
  ): Promise<InvoiceResponse<R>>;
}

export interface InvoiceUsecases {
  createNewInvoice: InvoiceUsecase<CreateNewInvoiceParams, Invoice>;
  updateInvoice: InvoiceUsecase<UpdateInvoiceParams, Invoice>;
  markPendingInvoiceAsPaid: InvoiceUsecase<MarkPendingInvoiceAsPaidParams, Invoice>;
  getInvoiceDetail: InvoiceUsecase<GetInvoiceDetailParams, Invoice>;
  getInvoiceList: InvoiceUsecase<GetInvoiceListParams, PaginatedInvoice<Invoice>>;
  deleteInvoice: InvoiceUsecase<DeleteInvoiceParams, Invoice>;
}

export const InvoiceUsecases = Symbol('InvoiceUsecases');