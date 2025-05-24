import { Entity, Column, PrimaryColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn, Repository, UpdateDateColumn, DataSource, Not, In, DeleteDateColumn } from 'typeorm';
import { AddressEntity } from './address.dao';
import { InvoiceItemEntity } from './invoice-item.dao';
import { IInvoice, Invoice, InvoiceStatus, PaginatedInvoice } from '../domains/invoice';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IInvoiceItem } from '../domains/invoice-item';

/**
 * Database specific invoice entity class.
 * This layer should be changed if the database infrastructure changes.
 */
@Entity('invoices')
export class InvoiceEntity extends Invoice {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'payment_due' })
  paymentDue: Date;

  @Column()
  description: string;

  @Column({ name: 'payment_terms' })
  paymentTerms: number;

  @Column({ name: 'client_name' })
  clientName: string;

  @Column({ name: 'client_email' })
  clientEmail: string;

  @Column({ name: 'sender_address_id' })
  senderAddressId: number;

  @Column({ name: 'client_address_id' })
  clientAddressId: number;

  @ManyToOne(() => AddressEntity)
  @JoinColumn({ name: 'sender_address_id' })
  senderAddress: AddressEntity;

  @ManyToOne(() => AddressEntity)
  @JoinColumn({ name: 'client_address_id' })
  clientAddress: AddressEntity;

  @OneToMany(() => InvoiceItemEntity, (item) => item.invoice, {
    cascade: true,
  })
  items: InvoiceItemEntity[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'enum',
    enum: [Object.values(InvoiceStatus)],
    default: 'draft'
  })
  status: InvoiceStatus;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export interface IInvoiceDAO {
  findById(id: string): Promise<InvoiceEntity>;
  create(invoice: IInvoice, items: IInvoiceItem[]): Promise<InvoiceEntity>;
  update(id: string, invoice: IInvoice, items: IInvoiceItem[]): Promise<InvoiceEntity>;
  deleteById(id: string): Promise<InvoiceEntity>;
  findAll(page: number, limit: number, status?: InvoiceStatus): Promise<PaginatedInvoice<InvoiceEntity>>;
  markPendingInvoiceAsPaid(id: string): Promise<InvoiceEntity>;
}

export const IInvoiceDAO = Symbol('IInvoiceDAO');

@Injectable()
export class InvoiceDAO implements IInvoiceDAO {
  constructor(
    @InjectRepository(InvoiceEntity)
    private invoiceRepository: Repository<InvoiceEntity>,
    private readonly dataSource: DataSource
  ) {}

  async create(invoice: IInvoice, items: IInvoiceItem[]): Promise<InvoiceEntity> {
    return await this.dataSource.transaction(async (manager) => {
      const invoiceTrxManager = manager.create(InvoiceEntity, invoice);
      const invoiceCreated = await manager.save(invoiceTrxManager);

      const invoiceItemEntities = items?.map((item) =>
        manager.create(InvoiceItemEntity, item)
      );

      if (invoiceItemEntities?.length > 0) {
        await manager.save(InvoiceItemEntity, invoiceItemEntities);
      }

      const invoiceFound = await manager.findOne(InvoiceEntity, {
        where: { id: invoiceCreated.id },
        relations: ['senderAddress', 'clientAddress', 'items']
      });

      return invoiceFound;
    });
  }
  async findById(id: string): Promise<InvoiceEntity> {
    const invoiceFound = await this.invoiceRepository.findOne({
      where: { 
        id: id,
        status: Not(InvoiceStatus.DELETED)
      },
      relations: ['senderAddress', 'clientAddress', 'items']
    });

    return invoiceFound;
  }

  async update(id: string, invoice: IInvoice, items: IInvoiceItem[]): Promise<InvoiceEntity> {
    return await this.dataSource.transaction(async (manager) => {
      await manager.update(InvoiceEntity, { id }, invoice);
      const existingItems = items?.filter(item => item.id);

      const existingItemIds = existingItems?.map(item => item.id);
      await manager.delete(InvoiceItemEntity, {
        invoiceId: id,
        ...(existingItemIds?.length > 0 && { id: Not(In(existingItemIds)) })
      });
    
      if (existingItems?.length > 0) {
        await Promise.all(
          existingItems.map(item =>
            manager.update(InvoiceItemEntity, { id: item.id }, item)
          )
        );
      }

      const newItems = items?.filter(item => !item.id);

      if (newItems?.length > 0) {
        const newItemEntities = newItems.map(item =>
          manager.create(InvoiceItemEntity, item)
        );
        await manager.save(InvoiceItemEntity, newItemEntities);
      }

      const invoiceFound = await manager.findOne(InvoiceEntity, {
        where: { id: id },
        relations: ['senderAddress', 'clientAddress', 'items']
      });

      return invoiceFound;
    });
  }

  async deleteById(id: string): Promise<InvoiceEntity> {
    await this.invoiceRepository.update(id, {
      deletedAt: new Date(),
      status: InvoiceStatus.DELETED
    });

    const invoiceFound = await this.invoiceRepository.findOne({
      where: { id: id },
      relations: ['senderAddress', 'clientAddress', 'items'],
      withDeleted: true
    });

    return invoiceFound;
  }

  async findAll(page: number = 1, limit: number = 10, status?: InvoiceStatus): Promise<PaginatedInvoice<InvoiceEntity>> {
    const skip = (page - 1) * limit;

    const [invoices, total] = await this.invoiceRepository.findAndCount({
      relations: ['senderAddress', 'clientAddress', 'items'],
      where: status ? { status } : { status: Not(InvoiceStatus.DELETED) },
      skip,
      take: limit,
      order: {
        paymentDue: 'ASC',
        updatedAt: 'DESC'
      }
    });

    return {
      invoices,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async markPendingInvoiceAsPaid(id: string): Promise<InvoiceEntity> {
    await this.invoiceRepository.update(id, {
      status: InvoiceStatus.PAID
    });

    const invoiceFound = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['items', 'senderAddress', 'clientAddress'],
    });
  
    return invoiceFound;
  }
}
