import { Test, TestingModule } from '@nestjs/testing';
import { GetAuditLogList } from '@app/api/audit-log/usecases/get-audit-log-list.usecase';
import { AuditLogEntity, IAuditLogDAO } from '@app/api/audit-log/infrastructures/audit-log.dao';
import { HttpStatus } from '@nestjs/common';
import { faker } from '@faker-js/faker';

describe('GetAuditLogList', () => {
  let useCase: GetAuditLogList;
  let auditLogDao: jest.Mocked<IAuditLogDAO>;

  beforeEach(async () => {
    const mockAuditLogDao = {
      findByInvoiceId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAuditLogList,
        {
          provide: IAuditLogDAO,
          useValue: mockAuditLogDao,
        },
      ],
    }).compile();

    useCase = module.get<GetAuditLogList>(GetAuditLogList);
    auditLogDao = module.get(IAuditLogDAO);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should get audit log list successfully', async () => {
      // Arrange
      const params = {
        invoiceId: faker.string.uuid(),
        page: 1,
        limit: 10
      };

      const mockAuditLogs = Array(3).fill(null).map(() => ({
        id: faker.number.int(),
        invoiceId: params.invoiceId,
        actionType: faker.helpers.arrayElement(['CREATED_DRAFT', 'UPDATED', 'DELETED']),
        message: faker.lorem.sentence(),
        actionAt: new Date(),
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent()
      }));

      const mockPaginatedResponse = {
        auditLogs: mockAuditLogs,
        total: mockAuditLogs.length,
        currentPage: params.page,
        totalPages: Math.ceil(mockAuditLogs.length / params.limit)
      };

      auditLogDao.findByInvoiceId.mockResolvedValue(mockPaginatedResponse as any);

      // Act
      const result = await useCase.execute(params);

      // Assert
      expect(auditLogDao.findByInvoiceId).toHaveBeenCalledWith(
        params.invoiceId,
        params.page,
        params.limit
      );
      expect(result).toEqual({
        status_code: HttpStatus.OK,
        status: 'Audit logs retrieved successfully',
        time_taken_in_ms: expect.any(Number),
        data: expect.objectContaining({
          auditLogs: expect.any(Array),
          total: mockAuditLogs.length,
          currentPage: params.page,
          totalPages: Math.ceil(mockAuditLogs.length / params.limit)
        })
      });
    });

    it('should use default pagination values when not provided', async () => {
      // Arrange
      const params = {
        invoiceId: faker.string.uuid()
      };

      const mockPaginatedResponse = {
        auditLogs: [],
        total: 0,
        currentPage: 1,
        totalPages: 10
      };

      auditLogDao.findByInvoiceId.mockResolvedValue(mockPaginatedResponse as any);

      // Act
      const result = await useCase.execute(params);

      // Assert
      expect(auditLogDao.findByInvoiceId).toHaveBeenCalledWith(
        params.invoiceId,
        1,
        10
      );
      expect(result.data).toEqual(mockPaginatedResponse);
    });

    it('should handle errors when getting audit log list fails', async () => {
      // Arrange
      const params = {
        invoiceId: faker.string.uuid(),
        page: 1,
        limit: 10
      };

      const error = new Error('Database error');
      auditLogDao.findByInvoiceId.mockRejectedValue(error);

      // Act
      const result = await useCase.execute(params);

      // Assert
      expect(result).toEqual({
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        status: error.message,
        time_taken_in_ms: expect.any(Number),
        data: null
      });
    });
  });
});
