import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from '@app/api/invoice/adapters/invoice.controller';
import { InvoiceUsecases } from '@app/api/invoice/usecases';
import { CreateNewInvoiceUseCase } from '@app/api/invoice/usecases/create-new-invoice.usecase';
import { DeleteInvoiceUseCase } from '@app/api/invoice/usecases/delete-invoice.usecase';
import { GetInvoiceDetailUseCase } from '@app/api/invoice/usecases/get-invoice-detail.usecase';
import { GetInvoiceListUseCase } from '@app/api/invoice/usecases/get-invoice-list.usecase';
import { MarkPendingInvoiceAsPaidUseCase } from '@app/api/invoice/usecases/mark-pending-invoice-as-paid.usecase';
import { UpdateInvoiceUseCase } from '@app/api/invoice/usecases/update-invoice.usecase';
import { Invoice, InvoiceStatus } from '@app/api/invoice/domains/invoice';
import { HttpStatus } from '@nestjs/common';
import { faker } from '@faker-js/faker';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  let mockInvoiceUsecases: Partial<InvoiceUsecases>;

  beforeEach(async () => {
    mockInvoiceUsecases = {
      createNewInvoice: {
        execute: jest.fn()
      } as unknown as CreateNewInvoiceUseCase,
      deleteInvoice: {
        execute: jest.fn()
      } as unknown as DeleteInvoiceUseCase,
      getInvoiceDetail: {
        execute: jest.fn()
      } as unknown as GetInvoiceDetailUseCase,
      getInvoiceList: {
        execute: jest.fn()
      } as unknown as GetInvoiceListUseCase,
      markPendingInvoiceAsPaid: {
        execute: jest.fn()
      } as unknown as MarkPendingInvoiceAsPaidUseCase,
      updateInvoice: {
        execute: jest.fn()
      } as unknown as UpdateInvoiceUseCase
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceUsecases,
          useValue: mockInvoiceUsecases
        }
      ]
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createInvoice', () => {
    it('should create a new invoice', async () => {
      const mockResponse = {
        status_code: HttpStatus.CREATED,
        status: 'Invoice created successfully',
        time_taken_in_ms: 100,
        data: {} as Invoice
      };

      (mockInvoiceUsecases.createNewInvoice.execute as jest.Mock).mockResolvedValue(mockResponse);

      const result = await controller.createInvoice(
        {
          invoice: {} as Invoice,
          invoiceItems: [],
          is_save_and_send: false
        },
        {
          headers: {
            'X-Forwarded-For': faker.internet.ip(),
            'User-Agent': faker.internet.userAgent()
          }
        } as unknown as Request
      );
      expect(result).toEqual(mockResponse);
      expect(mockInvoiceUsecases.createNewInvoice.execute).toHaveBeenCalled();
    });
  });

  describe('updateInvoice', () => {
    it('should update an invoice', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        status: 'Invoice updated successfully',
        time_taken_in_ms: 100,
        data: {} as Invoice
      };

      (mockInvoiceUsecases.updateInvoice.execute as jest.Mock).mockResolvedValue(mockResponse);

      const result = await controller.updateInvoice(
        '123',
        {
          invoice: {} as Invoice,
          invoiceItems: [],
        },
        {
          headers: {
            'X-Forwarded-For': faker.internet.ip(),
            'User-Agent': faker.internet.userAgent()
          }
        } as unknown as Request
      );

      expect(result).toEqual(mockResponse);
      expect(mockInvoiceUsecases.updateInvoice.execute).toHaveBeenCalled();
    });
  });

  describe('deleteInvoice', () => {
    it('should delete an invoice', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        status: 'Invoice deleted successfully',
        time_taken_in_ms: 100,
        data: {} as Invoice
      };

      (mockInvoiceUsecases.deleteInvoice.execute as jest.Mock).mockResolvedValue(mockResponse);

      const result = await controller.deleteInvoice(
        '123',
        {
          headers: {
            'X-Forwarded-For': faker.internet.ip(),
            'User-Agent': faker.internet.userAgent()
          }
        } as unknown as Request
      );

      expect(result).toEqual(mockResponse);
      expect(mockInvoiceUsecases.deleteInvoice.execute).toHaveBeenCalledWith({ id: '123' });
    });
  });

  describe('getInvoices', () => {
    it('should get list of invoices', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        status: 'Invoices retrieved successfully',
        time_taken_in_ms: 100,
        data: {
          data: [],
          total: 0,
          page: 1,
          limit: 10
        }
      };

      (mockInvoiceUsecases.getInvoiceList.execute as jest.Mock).mockResolvedValue(mockResponse);

      const result = await controller.getInvoices({ page: 1, limit: 10, status: InvoiceStatus.PENDING });

      expect(result).toEqual(mockResponse);
      expect(mockInvoiceUsecases.getInvoiceList.execute).toHaveBeenCalled();
    });
  });

  describe('getInvoiceById', () => {
    it('should get an invoice by id', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        status: 'Invoice retrieved successfully',
        time_taken_in_ms: 100,
        data: {} as Invoice
      };

      (mockInvoiceUsecases.getInvoiceDetail.execute as jest.Mock).mockResolvedValue(mockResponse);

      const result = await controller.getInvoiceById('123');

      expect(result).toEqual(mockResponse);
      expect(mockInvoiceUsecases.getInvoiceDetail.execute).toHaveBeenCalledWith({ id: '123' });
    });
  });

  describe('markPendingInvoiceAsPaid', () => {
    it('should mark a pending invoice as paid', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        status: 'Invoice marked as paid successfully',
        time_taken_in_ms: 100,
        data: {} as Invoice
      };

      (mockInvoiceUsecases.markPendingInvoiceAsPaid.execute as jest.Mock).mockResolvedValue(mockResponse);

      const result = await controller.markPendingInvoiceAsPaid(
        '123',
        {
          headers: {
            'X-Forwarded-For': faker.internet.ip(),
            'User-Agent': faker.internet.userAgent()
          }
        } as unknown as Request
      );

      expect(result).toEqual(mockResponse);
      expect(mockInvoiceUsecases.markPendingInvoiceAsPaid.execute).toHaveBeenCalledWith({ id: '123' });
    });
  });
});
