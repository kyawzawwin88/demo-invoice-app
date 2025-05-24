import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { InvoiceItem } from '../domains/invoice-item';
import { InvoiceEntity } from './invoice.dao';

/**
 * Database specific invoice item entity class.
 * This layer should be changed if the database infrastructure changes.
 */
@Entity('invoice_items')
export class InvoiceItemEntity extends InvoiceItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'invoice_id' })
  invoiceId: string;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @ManyToOne(() => InvoiceEntity, (invoice) => invoice.items)
  @JoinColumn({ name: 'invoice_id' })
  invoice?: InvoiceEntity;
}
