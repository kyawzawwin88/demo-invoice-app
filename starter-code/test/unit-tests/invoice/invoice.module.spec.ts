import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InvoiceModule } from '@app/api/invoice/invoice.module';
import { IInvoiceDAO, InvoiceEntity } from '@app/api/invoice/infrastructures/invoice.dao';
import { InvoiceItemEntity } from '@app/api/invoice/infrastructures/invoice-item.dao';
import { AddressEntity, IAddressDAO } from '@app/api/invoice/infrastructures/address.dao';
import { CreateNewInvoiceUseCase } from '@app/api/invoice/usecases/create-new-invoice.usecase';
import { DeleteInvoiceUseCase } from '@app/api/invoice/usecases/delete-invoice.usecase';
import { GetInvoiceListUseCase } from '@app/api/invoice/usecases/get-invoice-list.usecase';
import { GetInvoiceDetailUseCase } from '@app/api/invoice/usecases/get-invoice-detail.usecase';
import { UpdateInvoiceUseCase } from '@app/api/invoice/usecases/update-invoice.usecase';
import { MarkPendingInvoiceAsPaidUseCase } from '@app/api/invoice/usecases/mark-pending-invoice-as-paid.usecase';
import { DataSource, Repository } from 'typeorm';
import { AuditLogEntity, IAuditLogDAO } from '@app/api/audit-log/infrastructures/audit-log.dao';

describe('InvoiceModule', () => {
  let module: TestingModule;
  let mockInvoiceRepository: Partial<Record<keyof Repository<InvoiceEntity>, jest.Mock>>;
  let mockInvoiceItemRepository: Partial<Record<keyof Repository<InvoiceItemEntity>, jest.Mock>>;
  let mockAddressRepository: Partial<Record<keyof Repository<AddressEntity>, jest.Mock>>;
  let mockAuditLogRepository: Partial<Record<keyof Repository<AuditLogEntity>, jest.Mock>>;

  const mockDataSource = {
    transaction: jest.fn(),
    getRepository: jest.fn(),
  } as unknown as DataSource;

  const mockInvoiceDAO = {};

  const mockAddressDAO = {};

  const mockAuditLogDAO = {};

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        InvoiceModule,
      ],
      providers: [
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: getRepositoryToken(InvoiceEntity),
          useValue: mockInvoiceRepository,
        },
        {
          provide: getRepositoryToken(InvoiceItemEntity),
          useValue: mockInvoiceItemRepository,
        },
        {
          provide: getRepositoryToken(AddressEntity),
          useValue: mockAddressRepository,
        },
        {
          provide: getRepositoryToken(AuditLogEntity),
          useValue: mockAuditLogRepository,
        },
      ],
    })    
    .overrideProvider(IInvoiceDAO)
    .useValue(mockInvoiceDAO)
    .overrideProvider(IAddressDAO)
    .useValue(mockAddressDAO)
    .overrideProvider(IAuditLogDAO)
    .useValue(mockAuditLogDAO)
    .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide CreateNewInvoiceUseCase', () => {
    const useCase = module.get<CreateNewInvoiceUseCase>(CreateNewInvoiceUseCase);
    expect(useCase).toBeDefined();
  });

  it('should provide DeleteInvoiceUseCase', () => {
    const useCase = module.get<DeleteInvoiceUseCase>(DeleteInvoiceUseCase);
    expect(useCase).toBeDefined();
  });

  it('should provide GetInvoiceListUseCase', () => {
    const useCase = module.get<GetInvoiceListUseCase>(GetInvoiceListUseCase);
    expect(useCase).toBeDefined();
  });

  it('should provide GetInvoiceDetailUseCase', () => {
    const useCase = module.get<GetInvoiceDetailUseCase>(GetInvoiceDetailUseCase);
    expect(useCase).toBeDefined();
  });

  it('should provide UpdateInvoiceUseCase', () => {
    const useCase = module.get<UpdateInvoiceUseCase>(UpdateInvoiceUseCase);
    expect(useCase).toBeDefined();
  });

  it('should provide MarkPendingInvoiceAsPaidUseCase', () => {
    const useCase = module.get<MarkPendingInvoiceAsPaidUseCase>(MarkPendingInvoiceAsPaidUseCase);
    expect(useCase).toBeDefined();
  });
});

