import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { AuditLogController } from '@app/api/audit-log/adapters/audit-log.controller';
import { AuditLogUsecases } from '@app/api/audit-log/usecases';
import { AuditLog } from '@app/api/audit-log/domains/audit-log';

describe('AuditLogController', () => {
  let controller: AuditLogController;
  const mockAuditLogUsecases = {
    getAuditLogList: {
      execute: jest.fn()
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditLogController],
      providers: [
        {
          provide: AuditLogUsecases,
          useValue: mockAuditLogUsecases
        }
      ]
    }).compile();

    controller = module.get<AuditLogController>(AuditLogController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAuditLogsByInvoiceId', () => {
    it('should get audit logs for an invoice', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        status: 'Audit logs retrieved successfully',
        time_taken_in_ms: 100,
        data: {
          auditLogs: [] as AuditLog[],
          total: 0,
          page: 1,
          limit: 10
        }
      };

      (mockAuditLogUsecases.getAuditLogList.execute as jest.Mock).mockResolvedValue(mockResponse);

      const result = await controller.getAuditLogsByInvoiceId('123', { page: 1, limit: 10 });

      expect(result).toEqual(mockResponse);
      expect(mockAuditLogUsecases.getAuditLogList.execute).toHaveBeenCalledWith({
        invoiceId: '123',
        page: 1,
        limit: 10
      });
    });

    it('should handle missing query parameters', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        status: 'Audit logs retrieved successfully',
        time_taken_in_ms: 100,
        data: {
          auditLogs: [] as AuditLog[],
          total: 0,
          page: 1,
          limit: 10
        }
      };

      (mockAuditLogUsecases.getAuditLogList.execute as jest.Mock).mockResolvedValue(mockResponse);

      const result = await controller.getAuditLogsByInvoiceId('123');

      expect(result).toEqual(mockResponse);
      expect(mockAuditLogUsecases.getAuditLogList.execute).toHaveBeenCalledWith({
        invoiceId: '123',
        page: undefined,
        limit: undefined
      });
    });
  });
});
