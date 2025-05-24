import { Test, TestingModule } from '@nestjs/testing';
import { GetInvoiceDetailUseCase } from '@app/api/invoice/usecases/get-invoice-detail.usecase';
import { IInvoiceDAO, InvoiceEntity } from '@app/api/invoice/infrastructures/invoice.dao';
import { HttpStatus } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { Invoice } from '@app/api/invoice/domains/invoice';
import { CreateAuditLog } from '@app/api/audit-log/usecases/create-audit-log.usecase';

describe('GetInvoiceDetailUseCase', () => {
  let useCase: GetInvoiceDetailUseCase;
  let invoiceDao: jest.Mocked<IInvoiceDAO>;

  beforeEach(async () => {
    const mockInvoiceDao = {
      findById: jest.fn(),
    };

    const mockCreateAuditLog = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetInvoiceDetailUseCase,
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

    useCase = module.get<GetInvoiceDetailUseCase>(GetInvoiceDetailUseCase);
    invoiceDao = module.get(IInvoiceDAO);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should get invoice details successfully', async () => {
      // Arrange
      const mockInvoice = {
        id: Invoice.generateInvoiceId(),
        description: faker.lorem.sentence(),
      };

      invoiceDao.findById.mockResolvedValue(mockInvoice as InvoiceEntity);

      // Act
      const result = await useCase.execute({ id: mockInvoice.id });

      // Assert
      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.status).toBe('Invoice details retrieved successfully');
      expect(result.data).toBeDefined();
      expect(invoiceDao.findById).toHaveBeenCalledWith(mockInvoice.id);
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      const invoiceId = faker.string.uuid();
      invoiceDao.findById.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await useCase.execute({ id: invoiceId });

      // Assert
      expect(result.status_code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.status).toBe('Database error');
      expect(result.data).toBeNull();
    });
  });
});
