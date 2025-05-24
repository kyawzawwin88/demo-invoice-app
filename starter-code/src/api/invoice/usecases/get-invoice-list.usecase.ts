import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IInvoiceDAO } from '../infrastructures/invoice.dao';
import { Invoice, InvoiceStatus, PaginatedInvoice } from '../domains/invoice';
import { InvoiceResponse, InvoiceUsecase } from '.';
import * as moment from 'moment';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GetInvoiceListUseCase implements InvoiceUsecase<GetInvoiceListParams, PaginatedInvoice<Invoice>> {
  constructor(
    @Inject(IInvoiceDAO)
    private invoiceDao: IInvoiceDAO,
  ) {}

  async execute(params: GetInvoiceListParams): Promise<InvoiceResponse<PaginatedInvoice<Invoice>>> {
    const startTime = moment();
    try {
      const { page = 1, limit = 10, status } = params;
      const paginatedInvoiceEntitiesFound = await this.invoiceDao.findAll(page, limit, status);
      const invoiceList = plainToInstance(Invoice, paginatedInvoiceEntitiesFound.invoices);

      const endTime = moment();
      return {
        status_code: HttpStatus.OK,
        status: 'Invoices retrieved successfully',
        time_taken_in_ms: endTime.diff(startTime, 'milliseconds'),
        data: {
          invoices: invoiceList,
          total: paginatedInvoiceEntitiesFound.total,
          currentPage: paginatedInvoiceEntitiesFound.currentPage,
          totalPages: paginatedInvoiceEntitiesFound.totalPages,
        },
      };

    } catch (error) {
      const endTime = moment();
      return {
        status_code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        status: error.message,
        time_taken_in_ms: endTime.diff(startTime, 'milliseconds'),
        data: null,
      };
    }
  }
}

export interface GetInvoiceListParams {
  page?: number;
  limit?: number;
  status?: InvoiceStatus;
}
