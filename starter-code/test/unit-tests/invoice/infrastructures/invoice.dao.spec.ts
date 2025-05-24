import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository, Not, In, EntityManager } from 'typeorm';
import { InvoiceDAO, InvoiceEntity } from '@app/api/invoice/infrastructures/invoice.dao';
import { InvoiceItemEntity } from '@app/api/invoice/infrastructures/invoice-item.dao';
import { InvoiceStatus } from '@app/api/invoice/domains/invoice';

describe('InvoiceDAO', () => {
  let invoiceDAO: InvoiceDAO;
  let mockInvoiceRepository: Partial<Record<keyof Repository<InvoiceEntity>, jest.Mock>>;
  let mockDataSource: Partial<DataSource>;

  const mockManager = {
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  } as unknown as EntityManager;

  beforeEach(async () => {
    mockInvoiceRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      findAndCount: jest.fn(),
      delete: jest.fn()
    };

    mockDataSource = {
      transaction: jest.fn().mockImplementation(async (cb: (manager: EntityManager) => any) => {
        return cb(mockManager);
      }),
    } as unknown as DataSource;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceDAO,
        {
          provide: getRepositoryToken(InvoiceEntity),
          useValue: mockInvoiceRepository
        },
        {
          provide: DataSource,
          useValue: mockDataSource
        }
      ],
    }).compile();

    invoiceDAO = module.get<InvoiceDAO>(InvoiceDAO);
  });

  describe('findById', () => {
    it('should find invoice by id', async () => {
      const mockInvoice = {
        id: '123',
        status: InvoiceStatus.PENDING
      };

      mockInvoiceRepository.findOne.mockResolvedValue(mockInvoice);

      const result = await invoiceDAO.findById('123');

      expect(mockInvoiceRepository.findOne).toHaveBeenCalledWith({
        where: { 
          id: '123',
          status: Not(InvoiceStatus.DELETED)
        },
        relations: ['senderAddress', 'clientAddress', 'items']
      });
      expect(result).toEqual(mockInvoice);
    });
  });

  describe('create', () => {
    it('should create new invoice with items', async () => {
      const mockInvoice = {
        id: '123',
        status: InvoiceStatus.DRAFT
      };
      const mockItems = [
        { name: 'Item 1', price: 100, invoiceId: mockInvoice.id },
        { name: 'Item 2', price: 200, invoiceId: mockInvoice.id }
      ];

      const mockTransactionManager = {
        create: jest.fn().mockReturnValue(mockInvoice),
        save: jest.fn().mockResolvedValue(mockInvoice),
        findOne: jest.fn().mockResolvedValue({...mockInvoice, items: mockItems})
      } as unknown as EntityManager;

      mockDataSource.transaction = jest.fn().mockImplementation(async (cb: (manager: EntityManager) => any) => {
        return cb(mockTransactionManager);
      });

      const result = await invoiceDAO.create(mockInvoice, mockItems);

      expect(mockTransactionManager.create).toHaveBeenCalledWith(InvoiceEntity, mockInvoice);
      expect(mockTransactionManager.save).toHaveBeenCalled();
      expect(result).toEqual({...mockInvoice, items: mockItems});
    });
  });

  describe('findAll', () => {
    it('should return paginated invoices', async () => {
      const mockInvoices = [
        { id: '1', status: InvoiceStatus.PENDING },
        { id: '2', status: InvoiceStatus.PAID }
      ];
      const mockTotal = 2;

      mockInvoiceRepository.findAndCount.mockResolvedValue([mockInvoices, mockTotal]);

      const result = await invoiceDAO.findAll(1, 10, InvoiceStatus.PENDING);

      expect(mockInvoiceRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['senderAddress', 'clientAddress', 'items'],
        where: { status: InvoiceStatus.PENDING },
        skip: 0,
        take: 10,
        order: {
          paymentDue: 'ASC',
          updatedAt: 'DESC'
        }
      });
      expect(result).toEqual({
        invoices: mockInvoices,
        total: mockTotal,
        currentPage: 1,
        totalPages: 1
      });
    });
  });

  describe('markPendingInvoiceAsPaid', () => {
    it('should mark invoice as paid', async () => {
      const mockInvoice = {
        id: '123',
        status: InvoiceStatus.PAID
      };

      mockInvoiceRepository.update.mockResolvedValue(undefined);
      mockInvoiceRepository.findOne.mockResolvedValue(mockInvoice);

      const result = await invoiceDAO.markPendingInvoiceAsPaid('123');

      expect(mockInvoiceRepository.update).toHaveBeenCalledWith('123', {
        status: InvoiceStatus.PAID
      });
      expect(mockInvoiceRepository.findOne).toHaveBeenCalledWith({
        where: { id: '123' },
        relations: ['items', 'senderAddress', 'clientAddress']
      });
      expect(result).toEqual(mockInvoice);
    });
  });

  describe('update', () => {
    it('should update invoice and handle items correctly', async () => {
      const mockInvoice = {
        id: '123',
        status: InvoiceStatus.PENDING
      };
      const mockItems = [
        { id: 1, invoiceId: '123', quantity: 1, price: 100 },
        { quantity: 2, price: 200 } // New item without ID
      ];

      const mockTransactionManager = {
        create: jest.fn().mockReturnValue(mockInvoice),
        save: jest.fn().mockResolvedValue(mockInvoice),
        update: jest.fn().mockResolvedValue(null),
        delete: jest.fn().mockResolvedValue(null),
        findOne: jest.fn().mockImplementation(() => {
          mockItems[1].id = 2;
          return Promise.resolve({...mockInvoice, items: mockItems})
        })
      } as unknown as EntityManager;

      mockDataSource.transaction = jest.fn().mockImplementation(async (cb: (manager: EntityManager) => any) => {
        return cb(mockTransactionManager);
      });

      const result = await invoiceDAO.update('123', mockInvoice, mockItems);

      expect(mockTransactionManager.update).toHaveBeenCalledWith(InvoiceEntity, { id: '123' }, mockInvoice);
      expect(mockTransactionManager.delete).toHaveBeenCalledWith(InvoiceItemEntity, {
        invoiceId: '123',
        id: Not(In([1]))
      });
      expect(mockTransactionManager.update).toHaveBeenCalledWith(InvoiceItemEntity, { id: 1 }, mockItems[0]);
      expect(mockTransactionManager.create).toHaveBeenCalledWith(InvoiceItemEntity, mockItems[1]);
      expect(mockTransactionManager.save).toHaveBeenCalled();
      expect(mockTransactionManager.findOne).toHaveBeenCalledWith(InvoiceEntity, {
        where: { id: '123' },
        relations: ['senderAddress', 'clientAddress', 'items']
      });
      expect(result).toEqual({...mockInvoice, items: mockItems});
    });
  });

  describe('deleteById', () => {
    it('should soft delete invoice and update status', async () => {
      const mockInvoice = {
        id: '123',
        status: InvoiceStatus.DELETED
      };

      mockInvoiceRepository.update.mockResolvedValue(undefined);
      mockInvoiceRepository.findOne.mockResolvedValue(mockInvoice);

      const result = await invoiceDAO.deleteById('123');

      expect(mockInvoiceRepository.update).toHaveBeenCalledWith('123', {
        deletedAt: expect.any(Date),
        status: InvoiceStatus.DELETED
      });
      expect(mockInvoiceRepository.findOne).toHaveBeenCalledWith({
        where: { id: '123' },
        relations: ['senderAddress', 'clientAddress', 'items'],
        withDeleted: true
      });
      expect(result).toEqual(mockInvoice);
    });

    it('should handle errors during delete', async () => {
      const error = new Error('Database error');
      mockInvoiceRepository.update.mockRejectedValue(error);

      await expect(invoiceDAO.deleteById('123')).rejects.toThrow(error);
    });
  });
});
