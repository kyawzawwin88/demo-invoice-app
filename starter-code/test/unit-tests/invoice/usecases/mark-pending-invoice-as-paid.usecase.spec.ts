import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { IInvoiceDAO } from '@app/api/invoice/infrastructures/invoice.dao';
import { MarkPendingInvoiceAsPaidUseCase } from '@app/api/invoice/usecases/mark-pending-invoice-as-paid.usecase';
import { Invoice, InvoiceStatus } from '@app/api/invoice/domains/invoice';
import { InvoiceEntity } from '@app/api/invoice/infrastructures/invoice.dao';
import { faker } from '@faker-js/faker';
import { CreateAuditLog } from '@app/api/audit-log/usecases/create-audit-log.usecase';

describe('MarkPendingInvoiceAsPaidUseCase', () => {
  let useCase: MarkPendingInvoiceAsPaidUseCase;
  let invoiceDao: jest.Mocked<IInvoiceDAO>;

  beforeEach(async () => {
    const mockInvoiceDao = {
      findById: jest.fn(),
      markPendingInvoiceAsPaid: jest.fn(),
    };

    const mockCreateAuditLog = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarkPendingInvoiceAsPaidUseCase,
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

    useCase = module.get<MarkPendingInvoiceAsPaidUseCase>(MarkPendingInvoiceAsPaidUseCase);
    invoiceDao = module.get(IInvoiceDAO);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should mark pending invoice as paid successfully', async () => {
      // Arrange
      const mockInvoice = {
        id: Invoice.generateInvoiceId(),
        status: InvoiceStatus.PENDING,
      };

      const mockUpdatedInvoice = {
        ...mockInvoice,
        status: InvoiceStatus.PAID,
      };

      invoiceDao.findById.mockResolvedValue(mockInvoice as InvoiceEntity);
      invoiceDao.markPendingInvoiceAsPaid.mockResolvedValue(mockUpdatedInvoice as InvoiceEntity);

      // Act
      const result = await useCase.execute({
        id: mockInvoice.id,
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent()
      });

      // Assert
      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.status).toBe('Invoice marked as paid successfully');
      expect(result.data).toBeDefined();
      expect(result.data.status).toBe(InvoiceStatus.PAID);
      expect(invoiceDao.findById).toHaveBeenCalledWith(mockInvoice.id);
      expect(invoiceDao.markPendingInvoiceAsPaid).toHaveBeenCalledWith(mockInvoice.id);
    });

    it('should throw error when invoice is not found', async () => {
      // Arrange
      const invoiceId = faker.string.uuid();
      invoiceDao.findById.mockResolvedValue(null);

      // Act
      const result = await useCase.execute({
        id: invoiceId,
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent()
      });

      // Assert
      expect(result.status_code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.status).toBe('Invoice not found');
      expect(result.data).toBeNull();
      expect(invoiceDao.markPendingInvoiceAsPaid).not.toHaveBeenCalled();
    });

    it('should throw error when invoice is not in pending status', async () => {
      // Arrange
      const mockInvoice = {
        id: Invoice.generateInvoiceId(),
        status: InvoiceStatus.PAID,
      };

      invoiceDao.findById.mockResolvedValue(mockInvoice as InvoiceEntity);

      // Act
      const result = await useCase.execute({
        id: mockInvoice.id,
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent()
      });

      // Assert
      expect(result.status_code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.status).toBe('Only pending invoices can be marked as paid');
      expect(result.data).toBeNull();
      expect(invoiceDao.markPendingInvoiceAsPaid).not.toHaveBeenCalled();
    });

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      const invoiceId = faker.string.uuid();
      invoiceDao.findById.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await useCase.execute({
        id: invoiceId,
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent()
      });

      // Assert
      expect(result.status_code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.status).toBe('Database error');
      expect(result.data).toBeNull();
      expect(invoiceDao.markPendingInvoiceAsPaid).not.toHaveBeenCalled();
    });
  });
});

