import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { IInvoiceDAO } from '@app/api/invoice/infrastructures/invoice.dao';
import { AddressEntity, IAddressDAO } from '@app/api/invoice/infrastructures/address.dao';
import { UpdateInvoiceUseCase } from '@app/api/invoice/usecases/update-invoice.usecase';
import { IInvoice, Invoice, InvoiceStatus } from '@app/api/invoice/domains/invoice';
import { InvoiceEntity } from '@app/api/invoice/infrastructures/invoice.dao';
import { faker } from '@faker-js/faker';
import { CreateAuditLog } from '@app/api/audit-log/usecases/create-audit-log.usecase';

describe('UpdateInvoiceUseCase', () => {
  let useCase: UpdateInvoiceUseCase;
  let invoiceDao: jest.Mocked<IInvoiceDAO>;
  let addressDao: jest.Mocked<IAddressDAO>;

  beforeEach(async () => {
    const mockInvoiceDao = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    const mockAddressDao = {
      findOrCreate: jest.fn(),
    };

    const mockCreateAuditLog = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateInvoiceUseCase,
        {
          provide: IInvoiceDAO,
          useValue: mockInvoiceDao,
        },
        {
          provide: IAddressDAO,
          useValue: mockAddressDao,
        },
        {
          provide: CreateAuditLog,
          useValue: mockCreateAuditLog
        }
      ],
    }).compile();

    useCase = module.get<UpdateInvoiceUseCase>(UpdateInvoiceUseCase);
    invoiceDao = module.get(IInvoiceDAO);
    addressDao = module.get(IAddressDAO);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update invoice successfully', async () => {
      // Arrange
      const mockInvoice = {
        id: Invoice.generateInvoiceId(),
        status: InvoiceStatus.DRAFT,
        calculatePaymentDue: jest.fn(),
        calculateTotal: jest.fn(),
        toEntityInput: jest.fn(),
      };

      const mockUpdatedInvoice = {
        ...mockInvoice,
        status: InvoiceStatus.PENDING,
      };

      const mockAddress = {
        id: faker.number.int(),
      };

      const mockInvoiceItems = [
        {
          id: faker.number.int(),
          invoiceId: mockInvoice.id,
          quantity: 1,
          price: 100,
          calculateItemTotal: jest.fn().mockReturnValue(100),
          toEntityInput: jest.fn(),
        },
      ];

      invoiceDao.findById.mockResolvedValue(mockInvoice as unknown as InvoiceEntity);
      invoiceDao.update.mockResolvedValue(mockUpdatedInvoice as unknown as InvoiceEntity);
      addressDao.findOrCreate.mockResolvedValue(mockAddress as unknown as AddressEntity);

      // Act
      const result = await useCase.execute({
        id: mockInvoice.id,
        invoice: mockInvoice,
        senderAddress: { street: '123 St', city: 'New York', postCode: '10001', country: 'USA' },
        clientAddress: { street: '456 St', city: 'Los Angeles', postCode: '90001', country: 'USA' },
        invoiceItems: mockInvoiceItems,
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent()
      });

      // Assert
      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.status).toBe('Invoice updated successfully');
      expect(result.data).toBeDefined();
      expect(invoiceDao.update).toHaveBeenCalled();
    });

    it('should throw error when invoice not found', async () => {
      // Arrange
      const invoiceId = faker.string.uuid();
      invoiceDao.findById.mockResolvedValue(null);

      // Act
      const result = await useCase.execute({
        id: invoiceId,
        invoice: {} as IInvoice,
        invoiceItems: [],
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent()
      });

      // Assert
      expect(result.status_code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.status).toBe('Invoice not found');
      expect(result.data).toBeNull();
      expect(invoiceDao.update).not.toHaveBeenCalled();
    });

    it('should throw error when trying to update paid invoice', async () => {
      // Arrange
      const mockInvoice = {
        id: Invoice.generateInvoiceId(),
        status: InvoiceStatus.PAID,
      };

      invoiceDao.findById.mockResolvedValue(mockInvoice as InvoiceEntity);

      // Act
      const result = await useCase.execute({
        id: mockInvoice.id,
        invoice: mockInvoice,
        invoiceItems: [],
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent()
      });

      // Assert
      expect(result.status_code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.status).toBe('Paid invoices cannot be updated');
      expect(result.data).toBeNull();
      expect(invoiceDao.update).not.toHaveBeenCalled();
    });

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      const invoiceId = Invoice.generateInvoiceId();
      invoiceDao.findById.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await useCase.execute({
        id: invoiceId,
        invoice: {} as IInvoice,
        invoiceItems: [],
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent()
      });

      // Assert
      expect(result.status_code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.status).toBe('Database error');
      expect(result.data).toBeNull();
      expect(invoiceDao.update).not.toHaveBeenCalled();
    });
  });
});
