import { Test, TestingModule } from '@nestjs/testing';
import { GetInvoiceListUseCase } from '@app/api/invoice/usecases/get-invoice-list.usecase';
import { IInvoiceDAO, InvoiceEntity } from '@app/api/invoice/infrastructures/invoice.dao';
import { Invoice, InvoiceStatus, PaginatedInvoice } from '@app/api/invoice/domains/invoice';
import { HttpStatus } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { CreateAuditLog } from '@app/api/audit-log/usecases/create-audit-log.usecase';

describe('GetInvoiceListUseCase', () => {
  let useCase: GetInvoiceListUseCase;
  let invoiceDao: jest.Mocked<IInvoiceDAO>;

  beforeEach(async () => {
    const mockInvoiceDao = {
      findAll: jest.fn(),
    };

    const mockCreateAuditLog = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetInvoiceListUseCase,
        {
          provide: IInvoiceDAO,
          useValue: mockInvoiceDao,
        },
        {
          provide: CreateAuditLog,
          useValue: mockCreateAuditLog
        }
      ],
    }).compile();

    useCase = module.get<GetInvoiceListUseCase>(GetInvoiceListUseCase);
    invoiceDao = module.get(IInvoiceDAO);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should get invoice list successfully with default pagination', async () => {
      // Arrange
      const mockInvoices = [
        {
          id: Invoice.generateInvoiceId(),
          status: InvoiceStatus.PENDING,
        },
        {
          id: Invoice.generateInvoiceId(),
          status: InvoiceStatus.DRAFT,
        },
      ];

      const mockPaginatedResponse = {
        invoices: mockInvoices,
        total: 2,
        currentPage: 1,
        totalPages: 1,
      };

      invoiceDao.findAll.mockResolvedValue(mockPaginatedResponse as PaginatedInvoice<InvoiceEntity>);

      // Act
      const result = await useCase.execute({});

      // Assert
      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.status).toBe('Invoices retrieved successfully');
      expect(result.data).toBeDefined();
      expect(result.data.invoices).toHaveLength(2);
      expect(result.data.total).toBe(2);
      expect(result.data.currentPage).toBe(1);
      expect(result.data.totalPages).toBe(1);
      expect(invoiceDao.findAll).toHaveBeenCalledWith(1, 10, undefined);
    });

    it('should get invoice list with custom pagination and status filter', async () => {
      // Arrange
      const mockInvoices = [
        {
          id: Invoice.generateInvoiceId(),
          status: InvoiceStatus.PAID,
        },
      ];

      const mockPaginatedResponse = {
        invoices: mockInvoices,
        total: 1,
        currentPage: 2,
        totalPages: 50,
      };

      invoiceDao.findAll.mockResolvedValue(mockPaginatedResponse as PaginatedInvoice<InvoiceEntity>);

      // Act
      const result = await useCase.execute({
        page: 2,
        limit: 5,
        status: InvoiceStatus.PAID,
      });

      // Assert
      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.data.invoices).toHaveLength(1);
      expect(result.data.currentPage).toBe(2);
      expect(result.data.totalPages).toBe(50);
      expect(invoiceDao.findAll).toHaveBeenCalledWith(2, 5, InvoiceStatus.PAID);
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      invoiceDao.findAll.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await useCase.execute({});

      // Assert
      expect(result.status_code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.status).toBe('Database error');
      expect(result.data).toBeNull();
    });
  });
});
