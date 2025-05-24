import { Address, IAddress } from '../domains/address';
import { IInvoiceItem, InvoiceItem } from '../domains/invoice-item';
import { IInvoice, Invoice, InvoiceStatus, PaymentTerms } from '../domains/invoice';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString, MaxLength, IsEnum, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { IsEmailIfNotEmpty } from '../../../app.validation-error';

class InvoiceItemDto implements IInvoiceItem {
  @ApiProperty({ type: String })
  name: string;
  @ApiProperty({ type: Number })
  quantity: number;
  @ApiProperty({ type: Number })
  price: number;
}

class InvoiceDto implements IInvoice {
  @ApiProperty({ type: String })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  clientName?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  @IsEmailIfNotEmpty()
  clientEmail?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  createdAt?: Date;

  @ApiProperty({ type: String }) 
  @MaxLength(1024)
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsEnum(PaymentTerms)
  paymentTerms?: PaymentTerms;
}

export class CreateNewInvoiceRequest {
  @ApiProperty({ type: InvoiceDto })
  @ValidateNested()
  @Type(() => InvoiceDto)
  invoice: InvoiceDto;

  @ApiProperty({ type: Address })
  @ValidateNested()
  @IsOptional()
  senderAddress?: IAddress;

  @ApiProperty({ type: Address })
  @ValidateNested()
  @IsOptional()
  clientAddress?: IAddress;

  @ApiProperty({ type: [InvoiceItemDto] })
  @ValidateNested()
  @IsOptional()
  invoiceItems?: IInvoiceItem[];

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  is_save_and_send: boolean;
}

export class UpdateInvoiceRequest {
  @ApiProperty({ type: Invoice })
  invoice: Invoice;
  @ApiProperty({ type: Address })
  senderAddress?: IAddress;
  @ApiProperty({ type: Address })
  clientAddress?: IAddress;
  @ApiProperty({ type: [InvoiceItem] })
  invoiceItems: IInvoiceItem[];
}

export class GetInvoiceListRequest {
  @ApiProperty({ type: Number })
  page?: number;
  @ApiProperty({ type: Number, required: false })
  limit?: number;
  @ApiProperty({ type: String, required: false })
  status?: InvoiceStatus;
}
