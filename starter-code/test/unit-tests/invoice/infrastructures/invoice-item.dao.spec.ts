import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InvoiceItemEntity } from '@app/api/invoice/infrastructures/invoice-item.dao';
import { InvoiceEntity } from '@app/api/invoice/infrastructures/invoice.dao';
import { faker } from '@faker-js/faker';

describe('InvoiceItemEntity', () => {
  let invoiceItemEntity: InvoiceItemEntity;

  beforeEach(() => {
    invoiceItemEntity = new InvoiceItemEntity();
    invoiceItemEntity.id = faker.number.int();
    invoiceItemEntity.invoiceId = faker.string.uuid();
    invoiceItemEntity.name = faker.commerce.productName();
    invoiceItemEntity.quantity = faker.number.int();
    invoiceItemEntity.price = Number(faker.commerce.price());
    invoiceItemEntity.total = Number(faker.commerce.price());
    invoiceItemEntity.invoice = new InvoiceEntity();
  });

  it('should be defined', () => {
    expect(invoiceItemEntity).toBeDefined();
  });

  it('should have correct properties', () => {
    expect(invoiceItemEntity).toHaveProperty('id');
    expect(invoiceItemEntity).toHaveProperty('invoiceId');
    expect(invoiceItemEntity).toHaveProperty('name');
    expect(invoiceItemEntity).toHaveProperty('quantity');
    expect(invoiceItemEntity).toHaveProperty('price');
    expect(invoiceItemEntity).toHaveProperty('total');
    expect(invoiceItemEntity).toHaveProperty('invoice');
  });

  it('should correctly set and get properties', () => {
    const testData = {
      id: 1,
      invoiceId: 'INV-001',
      name: 'Test Item',
      quantity: 2,
      price: 100.00,
      total: 200.00,
      invoice: new InvoiceEntity()
    };

    Object.assign(invoiceItemEntity, testData);

    expect(invoiceItemEntity.id).toBe(testData.id);
    expect(invoiceItemEntity.invoiceId).toBe(testData.invoiceId);
    expect(invoiceItemEntity.name).toBe(testData.name);
    expect(invoiceItemEntity.quantity).toBe(testData.quantity);
    expect(invoiceItemEntity.price).toBe(testData.price);
    expect(invoiceItemEntity.total).toBe(testData.total);
    expect(invoiceItemEntity.invoice).toBe(testData.invoice);
  });
});
