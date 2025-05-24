import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IInvoiceDAO, InvoiceDAO, InvoiceEntity } from "./infrastructures/invoice.dao";
import { InvoiceItemEntity } from "./infrastructures/invoice-item.dao";
import { AddressDAO, AddressEntity, IAddressDAO } from "./infrastructures/address.dao";
import { CreateNewInvoiceUseCase } from "./usecases/create-new-invoice.usecase";
import { DeleteInvoiceUseCase } from "./usecases/delete-invoice.usecase";
import { GetInvoiceListUseCase } from "./usecases/get-invoice-list.usecase";
import { GetInvoiceDetailUseCase } from "./usecases/get-invoice-detail.usecase";
import { UpdateInvoiceUseCase } from "./usecases/update-invoice.usecase";
import { InvoiceUsecases } from "./usecases";
import { MarkPendingInvoiceAsPaidUseCase } from "./usecases/mark-pending-invoice-as-paid.usecase";
import { InvoiceController } from "./adapters/invoice.controller";
import { AuditLogModule } from "../audit-log/audit-log.module";

@Module({
  imports: [
    ...(process.env.NODE_ENV === 'test' ? [] : [
      TypeOrmModule.forFeature([InvoiceEntity, InvoiceItemEntity, AddressEntity]),
    ]),
    AuditLogModule,
  ],
  controllers: [InvoiceController],
  providers: [
    {
      provide: IInvoiceDAO,
      useClass: InvoiceDAO
    },
    {
      provide: IAddressDAO,
      useClass: AddressDAO
    },

    CreateNewInvoiceUseCase,
    DeleteInvoiceUseCase,
    GetInvoiceListUseCase,
    GetInvoiceDetailUseCase,
    UpdateInvoiceUseCase,
    MarkPendingInvoiceAsPaidUseCase,
    {
      provide: InvoiceUsecases,
      useFactory: (
        createNewInvoice,
        deleteInvoice,
        getInvoiceList,
        getInvoiceDetail,
        updateInvoice,
        markPendingInvoiceAsPaid,
      ) => {
        return {
          createNewInvoice,
          deleteInvoice,
          getInvoiceList,
          getInvoiceDetail,
          updateInvoice,
          markPendingInvoiceAsPaid
        };
      },
      inject: [
        CreateNewInvoiceUseCase,
        DeleteInvoiceUseCase,
        GetInvoiceListUseCase,
        GetInvoiceDetailUseCase,
        UpdateInvoiceUseCase,
        MarkPendingInvoiceAsPaidUseCase
      ],
    },
  ],
})
export class InvoiceModule {}
