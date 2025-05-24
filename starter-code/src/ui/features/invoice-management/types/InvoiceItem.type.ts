// common fields in both api and ui
export interface CommonInvoiceItem {
  id?: string;
  invoiceId?: string;
  name: string;
  quantity: number;
  price: number;
}

// dto to be used in api, get
export interface InvoiceItemDto extends CommonInvoiceItem {
  
}

// type to be used in ui and getting data from api
export interface InvoiceItem extends CommonInvoiceItem {
  total?: number;
}