import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IInvoiceDAO } from '../infrastructures/invoice.dao';
import { Invoice } from '../domains/invoice';
import { InvoiceResponse, InvoiceUsecase } from '.';
import * as moment from 'moment';

@Injectable()
export class GetInvoiceDetailUseCase implements InvoiceUsecase<GetInvoiceDetailParams, Invoice> {
  constructor(
    @Inject(IInvoiceDAO)
    private invoiceDao: IInvoiceDAO,
  ) {}

  async execute(params: GetInvoiceDetailParams): Promise<InvoiceResponse<Invoice>> {
    const startTime = moment();
    try {
      const invoice = await this.invoiceDao.findById(params.id);

      const endTime = moment();
      return {
        status_code: HttpStatus.OK,
        status: 'Invoice details retrieved successfully',
        time_taken_in_ms: endTime.diff(startTime, 'milliseconds'),
        data: invoice,
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

export interface GetInvoiceDetailParams {
  id: string;
}





