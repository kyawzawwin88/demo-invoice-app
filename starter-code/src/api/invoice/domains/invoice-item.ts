import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

/**
 * Single invoice item domain entity which contains all the entity fields excluding relations
 */
export interface IInvoiceItem {
  id?: number;
  invoiceId?: string;
  name?: string;
  quantity?: number;
  price?: number;
  total?: number;
}

/**
 * Invoice item domain plain object class which contains all the entity fields including relations.
 * Additionally, it has domain logic for invoice item-specific operations.
 */
export class InvoiceItem implements IInvoiceItem {
  @Exclude()
  id: number;
  invoiceId: string;
  @ApiProperty({ type: String })
  name: string;
  @ApiProperty({ type: Number })
  quantity: number;
  @ApiProperty({ type: Number })
  price: number;
  @ApiProperty({ type: Number })
  total: number;

  calculateItemTotal(): number {
    return this.quantity * this.price;
  }

  toEntityInput(): IInvoiceItem {
    return {
      id: this.id,
      invoiceId: this.invoiceId,
      name: this.name,
      quantity: this.quantity,
      price: this.price,
      total: this.total
    };
  }
}
