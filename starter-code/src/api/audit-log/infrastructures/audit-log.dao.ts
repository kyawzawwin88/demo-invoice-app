import { Entity, Column, PrimaryGeneratedColumn, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog, AuditLogActionType, IAuditLog, PaginatedAuditLog } from '../domains/audit-log';

/**
 * Database specific audit log entity class.
 * This layer should be changed if the database infrastructure changes.
 */
@Entity('audit_logs')
export class AuditLogEntity extends AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'invoice_id' })
  invoiceId: string;

  @Column()
  message: string;

  @Column({
    type: 'enum',
    enum: AuditLogActionType,
    name: 'action_type'
  })
  actionType: AuditLogActionType;

  @Column({ name: 'ip_address' })
  ipAddress: string;

  @Column({ name: 'user_agent' })
  userAgent: string;

  @Column({ name: 'action_at' })
  actionAt: Date;
}

export interface IAuditLogDAO {
  findByInvoiceId(invoiceId: string, page, limit): Promise<PaginatedAuditLog<AuditLog>>;
  create(data: IAuditLog): Promise<AuditLog>;
}

export const IAuditLogDAO = Symbol('IAuditLogDAO');

@Injectable()
export class AuditLogDAO implements IAuditLogDAO {
  constructor(
    @InjectRepository(AuditLogEntity)
    private auditLogRepository: Repository<AuditLogEntity>,
  ) {}

  async findByInvoiceId(invoiceId: string, page: number = 1, limit: number = 10): Promise<PaginatedAuditLog<AuditLog>> {
    const skip = (page - 1) * limit;

    const [auditLogs, total] = await this.auditLogRepository.findAndCount({
      where: { invoiceId },
      skip,
      take: limit,
      order: {
        actionAt: 'DESC'
      }
    });

    return {
      auditLogs,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async create(data: IAuditLog): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create(data);
    return this.auditLogRepository.save(auditLog);
  }
}
