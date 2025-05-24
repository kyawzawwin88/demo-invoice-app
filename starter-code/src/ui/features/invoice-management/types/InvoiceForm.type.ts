import { Invoice } from './Invoice.type';
import { InvoiceItem } from './InvoiceItem.type';
export interface InvoiceFormProps {
  invoice?: Invoice;
}
export interface InvoiceFormItemProps {
  itemIndex: number;
  itemName: string;
  quantity: number;
  price: number;
  onItemNameChange: (value: string) => void;
  onQuantityChange: (value: number) => void;
  onPriceChange: (value: number) => void;
  onDelete: (itemIndex: number) => void;
}

export interface InvoiceFormAddressProps {
  streetAddress: string;
  city: string;
  postCode: string;
  country: string;
  onStreetAddressChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onPostCodeChange: (value: string) => void;
  onCountryChange: (value: string) => void;
}

export interface InvoiceFormActionsProps {
  isUpdate?: boolean;
  onDiscard?: () => void;
  onSaveAsDraft?: () => void;
  onSaveAndSend?: () => void;
  onUpdate?: () => void;
}

export interface InvoiceFormItemListProps {
  invoiceItems?: InvoiceItem[];
  onItemsChange: (items: InvoiceItem[]) => void;
}