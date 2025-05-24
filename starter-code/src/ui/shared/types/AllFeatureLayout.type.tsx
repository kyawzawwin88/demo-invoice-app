import { Invoice } from '../../features/invoice-management/types/Invoice.type';

export interface InvoiceFormParams {
  visible: boolean;
  invoice?: Invoice;
}

export interface MessageDialogParams {
  visible: boolean;
  title: string;
  message: string;
  onClose?: () => void;
}

export interface AllFeatureLayoutContextType {
  theme: string;
  setTheme: (value: string) => void;

  showInvoiceForm: InvoiceFormParams;
  setShowInvoiceForm: (value: InvoiceFormParams) => void;

  shouldInvoiceListingRefresh: boolean;
  setShouldInvoiceListingRefresh: (value: boolean) => void;

  messageDialog: MessageDialogParams;
  setMessageDialog: (value: MessageDialogParams) => void;
};