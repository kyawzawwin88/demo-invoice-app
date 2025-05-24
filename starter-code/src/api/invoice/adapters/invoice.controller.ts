import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { Invoice, PaginatedInvoice } from '../domains/invoice';
import { InvoiceResponse, InvoiceUsecases } from '../usecases';
import { CreateNewInvoiceParams } from '../usecases/create-new-invoice.usecase';
import { UpdateInvoiceParams } from '../usecases/update-invoice.usecase';

import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DeleteInvoiceParams } from '../usecases/delete-invoice.usecase';
import { MarkPendingInvoiceAsPaidParams } from '../usecases/mark-pending-invoice-as-paid.usecase';
import { CreateNewInvoiceRequest, UpdateInvoiceRequest, GetInvoiceListRequest } from './invoice.dto';
import { ValidationExceptionFactory } from '../../../app.validation-error';

@Controller('api/invoices')
export class InvoiceController {
  constructor(
    @Inject(InvoiceUsecases)
    private readonly invoiceUsecases: InvoiceUsecases
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiBody({ type: CreateNewInvoiceRequest })
  @ApiResponse({ status: 201, description: 'Invoice created successfully', type: Invoice })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UsePipes(new ValidationPipe({
    transform: true,
    exceptionFactory: ValidationExceptionFactory.create
  }))
  async createInvoice(
    @Body() payload: CreateNewInvoiceRequest,
    @Req() request: Request,
  ): Promise<InvoiceResponse<Invoice>> {
    const params: CreateNewInvoiceParams = {
      ...payload,
      ipAddress: request.headers['x-forwarded-for']?.toString().split(',')[0],
      userAgent: request.headers['user-agent'],
    };
    return await this.invoiceUsecases.createNewInvoice.execute(params);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an invoice' })
  @ApiBody({ type: UpdateInvoiceRequest })
  @ApiResponse({ status: 200, description: 'Invoice updated successfully', type: Invoice })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UsePipes(new ValidationPipe({
    transform: true,
    exceptionFactory: ValidationExceptionFactory.create
  }))
  async updateInvoice(
    @Param('id') id: string,
    @Body() payload: UpdateInvoiceRequest,
    @Req() request: Request,
  ): Promise<InvoiceResponse<Invoice>> {
    const params: UpdateInvoiceParams = {
      id: id,
      ...payload,
      ipAddress: request.headers['x-forwarded-for']?.toString().split(',')[0],
      userAgent: request.headers['user-agent'],
    };
    return await this.invoiceUsecases.updateInvoice.execute(params);
  }

  @Delete(':id') 
  async deleteInvoice(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<InvoiceResponse<Invoice>> {
    const params: DeleteInvoiceParams = {
      id: id,
      ipAddress: request.headers['x-forwarded-for']?.toString().split(',')[0],
      userAgent: request.headers['user-agent'],
    };
    return await this.invoiceUsecases.deleteInvoice.execute(params);
  }

  @Get()
  async getInvoices(
    @Query() query?: GetInvoiceListRequest
  ): Promise<InvoiceResponse<PaginatedInvoice<Invoice>>> {
    return await this.invoiceUsecases.getInvoiceList.execute(query);
  }

  @Get(':id')
  async getInvoiceById(@Param('id') id: string): Promise<InvoiceResponse<Invoice>> {
    return await this.invoiceUsecases.getInvoiceDetail.execute({ id });
  }

  @Put(':id/mark-pending-invoice-as-paid')
  async markPendingInvoiceAsPaid(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<InvoiceResponse<Invoice>> {
    const params: MarkPendingInvoiceAsPaidParams = {
      id: id,
      ipAddress: request.headers['x-forwarded-for']?.toString().split(',')[0],
      userAgent: request.headers['user-agent'],
    };
    return await this.invoiceUsecases.markPendingInvoiceAsPaid.execute(params);
  }
}
