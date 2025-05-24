import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuditLogUsecases } from "./usecases";
import { AuditLogDAO, AuditLogEntity, IAuditLogDAO } from "./infrastructures/audit-log.dao";
import { AuditLogController } from "./adapters/audit-log.controller";
import { CreateAuditLog } from "./usecases/create-audit-log.usecase";
import { GetAuditLogList } from "./usecases/get-audit-log-list.usecase";

@Module({
  imports: [
    ...(process.env.NODE_ENV === 'test' ? [] : [
      TypeOrmModule.forFeature([AuditLogEntity]),
    ]),
  ],
  controllers: [AuditLogController],
  providers: [
    {
      provide: IAuditLogDAO,
      useClass: AuditLogDAO
    },
    
    CreateAuditLog,
    GetAuditLogList,
    
    {
      provide: AuditLogUsecases,
      useFactory: (
        createAuditLog,
        getAuditLogList,
      ) => {
        return {
          createAuditLog,
          getAuditLogList,
        };
      },
      inject: [
        CreateAuditLog,
        GetAuditLogList,
      ],
    },
  ],
  exports: [CreateAuditLog]
})
export class AuditLogModule {}
