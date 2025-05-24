import { InvoiceItem } from './InvoiceItem.type';
import { Invoice } from './Invoice.type';

export interface InvoiceDetailProps {
  invoice: Invoice;
  onShowAuditLogClick?: () => void;
}

export interface InvoiceCardItemsProps {
  total: number;
  items: InvoiceItem[];
}
