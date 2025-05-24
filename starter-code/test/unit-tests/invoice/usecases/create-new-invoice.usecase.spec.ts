import { Test, TestingModule } from '@nestjs/testing';
import { CreateNewInvoiceUseCase } from '@app/api/invoice/usecases/create-new-invoice.usecase';
import { IInvoiceDAO, InvoiceEntity } from '@app/api/invoice/infrastructures/invoice.dao';
import { AddressEntity, IAddressDAO } from '@app/api/invoice/infrastructures/address.dao';
import { IInvoice, InvoiceStatus, PaymentTerms } from '@app/api/invoice/domains/invoice';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { CreateAuditLog } from '@app/api/audit-log/usecases/create-audit-log.usecase';

describe('CreateNewInvoiceUseCase', () => {
  let useCase: CreateNewInvoiceUseCase;
  let invoiceDao: jest.Mocked<IInvoiceDAO>;
  let addressDao: jest.Mocked<IAddressDAO>;

  beforeEach(async () => {
    const mockInvoiceDao = {
      findById: jest.fn(),
      create: jest.fn(),
    };

    const mockAddressDao = {
      findOrCreate: jest.fn(),
    };

    const mockCreateAuditLog = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateNewInvoiceUseCase,
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

    useCase = module.get<CreateNewInvoiceUseCase>(CreateNewInvoiceUseCase);
    invoiceDao = module.get(IInvoiceDAO);
    addressDao = module.get(IAddressDAO);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a new invoice successfully', async () => {
      // Arrange
      const mockInvoice = {
        description: faker.lorem.sentence(),
        clientName: faker.person.fullName(),
        clientEmail: faker.internet.email(),
        status: InvoiceStatus.DRAFT,
        paymentTerms: PaymentTerms.THIRTY_DAYS,
        createdAt: new Date(),
      };

      const mockSenderAddress = {
        street: faker.location.street(),
        city: faker.location.city(),
        postCode: faker.location.zipCode(),
        country: faker.location.country(),
      };

      const mockClientAddress = {
        street: faker.location.street(),
        city: faker.location.city(),
        postCode: faker.location.zipCode(),
        country: faker.location.country(),
      };

      const mockInvoiceItem = {
        name: faker.commerce.productName(),
        quantity: faker.number.int({ min: 1, max: 10 }),
        price: Number(faker.commerce.price()),
      };

      invoiceDao.findById.mockResolvedValue(null);
      addressDao.findOrCreate.mockResolvedValueOnce({ id: 1, ...mockSenderAddress } as AddressEntity);
      addressDao.findOrCreate.mockResolvedValueOnce({ id: 2, ...mockClientAddress } as AddressEntity);
      invoiceDao.create.mockImplementation((invoice) => Promise.resolve(invoice as InvoiceEntity));

      // Act
      const result = await useCase.execute({
        invoice: mockInvoice,
        senderAddress: mockSenderAddress,
        clientAddress: mockClientAddress,
        invoiceItems: [mockInvoiceItem],
        is_save_and_send: false,
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent()
      });

      // Assert
      expect(result.status_code).toBe(HttpStatus.CREATED);
      expect(result.status).toBe('Invoice created successfully');
      expect(result.data).toBeDefined();
      expect(invoiceDao.create).toHaveBeenCalled();
      expect(addressDao.findOrCreate).toHaveBeenCalledTimes(2);
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      invoiceDao.findById.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await useCase.execute({
        invoice: {} as IInvoice,
        invoiceItems: [],
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent()
      });

      // Assert
      expect(result.status_code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.data).toBeNull();
    });

    it('should set status to PENDING when is_save_and_send is true', async () => {
      // Arrange
      const mockInvoice = {
        clientName: faker.person.fullName(),
        clientEmail: faker.internet.email(),
        createdAt: faker.date.recent(),
        paymentTerms: faker.number.int({ min: 1, max: 30 }),
        description: faker.lorem.sentence(),
      };

      const mockSenderAddress = {
        street: faker.location.street(),
        city: faker.location.city(),
        postCode: faker.location.zipCode(),
        country: faker.location.country()
      };

      const mockClientAddress = {
        street: faker.location.street(), 
        city: faker.location.city(),
        postCode: faker.location.zipCode(),
        country: faker.location.country()
      };

      const mockInvoiceItem = {
        name: faker.commerce.productName(),
        quantity: faker.number.int({ min: 1, max: 10 }),
        price: Number(faker.commerce.price())
      };

      invoiceDao.findById.mockResolvedValue(null);
      addressDao.findOrCreate.mockResolvedValueOnce({ id: 1, ...mockSenderAddress } as AddressEntity);
      addressDao.findOrCreate.mockResolvedValueOnce({ id: 2, ...mockClientAddress } as AddressEntity);
      invoiceDao.create.mockImplementation((invoice) => Promise.resolve(invoice as InvoiceEntity));

      // Act
      const result = await useCase.execute({
        invoice: mockInvoice,
        senderAddress: mockSenderAddress,
        clientAddress: mockClientAddress,
        invoiceItems: [mockInvoiceItem],
        is_save_and_send: true,
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent()
      });

      // Assert
      expect(result.status_code).toBe(HttpStatus.CREATED);
      expect(result.data.status).toBe(InvoiceStatus.PENDING);
      expect(invoiceDao.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: InvoiceStatus.PENDING
        }),
        expect.any(Array)
      );
    });
  });
});
