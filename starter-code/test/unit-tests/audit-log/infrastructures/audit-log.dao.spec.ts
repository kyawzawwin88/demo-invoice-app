import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditLogDAO, AuditLogEntity } from '@app/api/audit-log/infrastructures/audit-log.dao';
import { AuditLogActionType } from '@app/api/audit-log/domains/audit-log';
import { faker } from '@faker-js/faker';

describe('AuditLogDAO', () => {
  let auditLogDAO: AuditLogDAO;
  const mockAuditLogRepository = {
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogDAO,
        {
          provide: getRepositoryToken(AuditLogEntity),
          useValue: mockAuditLogRepository
        }
      ]
    }).compile();

    auditLogDAO = module.get<AuditLogDAO>(AuditLogDAO);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByInvoiceId', () => {
    it('should return paginated audit logs', async () => {
      const mockAuditLogs = [
        {
          id: faker.number.int(),
          invoiceId: faker.string.uuid(),
          message: faker.lorem.sentence(),
          actionType: AuditLogActionType.CREATED_PENDING,
          ipAddress: faker.internet.ip(),
          userAgent: faker.internet.userAgent(),
          actionAt: faker.date.past()
        }
      ];
      const mockTotal = 1;

      mockAuditLogRepository.findAndCount.mockResolvedValue([mockAuditLogs, mockTotal]);

      const result = await auditLogDAO.findByInvoiceId('test-invoice-id', 1, 10);

      expect(mockAuditLogRepository.findAndCount).toHaveBeenCalledWith({
        where: { invoiceId: 'test-invoice-id' },
        skip: 0,
        take: 10,
        order: {
          actionAt: 'DESC'
        }
      });
      expect(result).toEqual({
        auditLogs: mockAuditLogs,
        total: mockTotal,
        currentPage: 1,
        totalPages: 1
      });
    });

    it('should use default pagination values when not provided', async () => {
      mockAuditLogRepository.findAndCount.mockResolvedValue([[], 0]);

      await auditLogDAO.findByInvoiceId('test-invoice-id');

      expect(mockAuditLogRepository.findAndCount).toHaveBeenCalledWith({
        where: { invoiceId: 'test-invoice-id' },
        skip: 0,
        take: 10,
        order: {
          actionAt: 'DESC'
        }
      });
    });
  });

  describe('create', () => {
    it('should create and save a new audit log', async () => {
      const mockAuditLogData = {
        invoiceId: faker.string.uuid(),
        message: faker.lorem.sentence(),
        actionType: AuditLogActionType.CREATED_DRAFT,
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent(),
        actionAt: faker.date.past()
      };

      const mockCreatedAuditLog = {
        id: faker.number.int(),
        ...mockAuditLogData
      };

      mockAuditLogRepository.create.mockReturnValue(mockCreatedAuditLog);
      mockAuditLogRepository.save.mockResolvedValue(mockCreatedAuditLog);

      const result = await auditLogDAO.create(mockAuditLogData);

      expect(mockAuditLogRepository.create).toHaveBeenCalledWith(mockAuditLogData);
      expect(mockAuditLogRepository.save).toHaveBeenCalledWith(mockCreatedAuditLog);
      expect(result).toEqual(mockCreatedAuditLog);
    });
  });
});
