import { Test, TestingModule } from '@nestjs/testing';
import { CreateAuditLog } from '@app/api/audit-log/usecases/create-audit-log.usecase';
import { AuditLogEntity, IAuditLogDAO } from '@app/api/audit-log/infrastructures/audit-log.dao';
import { AuditLogActionType } from '@app/api/audit-log/domains/audit-log';
import { HttpStatus } from '@nestjs/common';
import { faker } from '@faker-js/faker';

describe('CreateAuditLog', () => {
  let useCase: CreateAuditLog;
  let auditLogDao: jest.Mocked<IAuditLogDAO>;

  beforeEach(async () => {
    const mockAuditLogDao = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAuditLog,
        {
          provide: IAuditLogDAO,
          useValue: mockAuditLogDao,
        },
      ],
    }).compile();

    useCase = module.get<CreateAuditLog>(CreateAuditLog);
    auditLogDao = module.get(IAuditLogDAO);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create an audit log successfully', async () => {
      // Arrange
      const params = {
        invoiceId: faker.string.uuid(),
        actionType: AuditLogActionType.CREATED_DRAFT,
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent()
      };

      const mockCreatedAuditLog = {
        id: faker.number.int(),
        ...params,
        message: 'You\'ve created new invoice as draft',
        actionAt: new Date()
      };

      auditLogDao.create.mockResolvedValue(mockCreatedAuditLog as AuditLogEntity);

      // Act
      const result = await useCase.execute(params);

      // Assert
      expect(auditLogDao.create).toHaveBeenCalledWith({
        ...params,
        message: 'You\'ve created new invoice as draft',
        actionAt: expect.any(Date)
      });
      expect(result).toEqual({
        status_code: HttpStatus.CREATED,
        status: 'Audit log created successfully',
        time_taken_in_ms: expect.any(Number),
        data: expect.objectContaining(mockCreatedAuditLog)
      });
    });

    it('should handle errors when creating audit log fails', async () => {
      // Arrange
      const params = {
        invoiceId: faker.string.uuid(),
        actionType: AuditLogActionType.CREATED_DRAFT,
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent()
      };

      const error = new Error('Database error');
      auditLogDao.create.mockRejectedValue(error);

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

    it('should generate correct message for different action types', async () => {
      const testCases = [
        {
          actionType: AuditLogActionType.CREATED_PENDING,
          expectedMessage: 'You\'ve created new invoice as pending'
        },
        {
          actionType: AuditLogActionType.UPDATED,
          expectedMessage: 'You\'ve updated invoice, test-id'
        },
        {
          actionType: AuditLogActionType.MARK_AS_PAID,
          expectedMessage: 'You\'ve marked pending invoice, test-id, as paid'
        },
        {
          actionType: AuditLogActionType.DELETED,
          expectedMessage: 'You\'ve deleted invoice, test-id'
        }
      ];

      for (const testCase of testCases) {
        const params = {
          invoiceId: 'test-id',
          actionType: testCase.actionType,
          ipAddress: faker.internet.ip(),
          userAgent: faker.internet.userAgent()
        };

        auditLogDao.create.mockResolvedValue({
          id: faker.number.int(),
          ...params,
          message: testCase.expectedMessage,
          actionAt: new Date()
        } as AuditLogEntity);

        const result = await useCase.execute(params);

        expect(auditLogDao.create).toHaveBeenCalledWith(
          expect.objectContaining({
            message: testCase.expectedMessage
          })
        );
        expect(result.status_code).toBe(HttpStatus.CREATED);
      }
    });
  });
});
