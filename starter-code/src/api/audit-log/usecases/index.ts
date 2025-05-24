import { AuditLog, PaginatedAuditLog } from "../domains/audit-log";
import { CreateAuditLogParams } from "./create-audit-log.usecase";
import { GetAuditLogListParams } from "./get-audit-log-list.usecase";

export type AuditLogResponse<R> = {
  status_code: number;
  status: string;
  time_taken_in_ms: number;
  data: R;
};

export interface AuditLogUsecase<P, R> {
  execute(
    params?: P,
  ): Promise<AuditLogResponse<R>>;
}

export interface AuditLogUsecases {
  createAuditLog: AuditLogUsecase<CreateAuditLogParams, AuditLog>;
  getAuditLogList: AuditLogUsecase<GetAuditLogListParams, PaginatedAuditLog<AuditLog>>;
}

export const AuditLogUsecases = Symbol('AuditLogUsecases');