import { Test, TestingModule } from '@nestjs/testing';
import { DeleteInvoiceUseCase } from '@app/api/invoice/usecases/delete-invoice.usecase';
import { IInvoiceDAO, InvoiceEntity } from '@app/api/invoice/infrastructures/invoice.dao';
import { Invoice, InvoiceStatus } from '@app/api/invoice/domains/invoice';
import { HttpStatus } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { CreateAuditLog } from '@app/api/audit-log/usecases/create-audit-log.usecase';

describe('DeleteInvoiceUseCase', () => {
  let useCase: DeleteInvoiceUseCase;
  let invoiceDao: jest.Mocked<IInvoiceDAO>;

  beforeEach(async () => {
    const mockInvoiceDao = {
      findById: jest.fn(),
      deleteById: jest.fn(),
    };

    const mockCreateAuditLog = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteInvoiceUseCase,
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

    useCase = module.get<DeleteInvoiceUseCase>(DeleteInvoiceUseCase);
    invoiceDao = module.get(IInvoiceDAO);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should delete an invoice successfully', async () => {
      // Arrange
      const mockInvoice = {
        id: Invoice.generateInvoiceId(),
        status: InvoiceStatus.DRAFT,
      };

      invoiceDao.findById.mockResolvedValue(mockInvoice as InvoiceEntity);
      invoiceDao.deleteById.mockResolvedValue(mockInvoice as InvoiceEntity);

      // Act
      const result = await useCase.execute({
        id: mockInvoice.id,
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent()
      });

      // Assert
      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.status).toBe('Invoice deleted successfully');
      expect(result.data).toBeDefined();
      expect(invoiceDao.findById).toHaveBeenCalledWith(mockInvoice.id);
      expect(invoiceDao.deleteById).toHaveBeenCalledWith(mockInvoice.id);
    });

    it('should return error when invoice is not found', async () => {
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
      expect(invoiceDao.deleteById).not.toHaveBeenCalled();
    });

    it('should not delete a paid invoice', async () => {
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
      expect(result.status).toBe('Paid invoices cannot be deleted');
      expect(result.data).toBeNull();
      expect(invoiceDao.deleteById).not.toHaveBeenCalled();
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
    });
  });
});
