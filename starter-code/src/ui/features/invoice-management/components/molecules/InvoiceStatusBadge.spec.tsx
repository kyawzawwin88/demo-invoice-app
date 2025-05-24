import { render, screen } from '@testing-library/react';
import InvoiceStatusBadge from './InvoiceStatusBadge';
import { InvoiceStatus } from '../../types/Invoice.type';

describe('InvoiceStatusBadge', () => {
  it('renders draft status with correct styles', () => {
    render(<InvoiceStatusBadge status={InvoiceStatus.DRAFT} />);
    const badge = screen.getByText('draft');
    expect(badge).toHaveClass('bg-status-draft-bg', 'text-text-dark', 'dark:text-status-draft');
    expect(badge.childNodes[0]).toHaveClass('bg-status-draft-indicator');
  });

  it('renders pending status with correct styles', () => {
    render(<InvoiceStatusBadge status={InvoiceStatus.PENDING} />);
    const badge = screen.getByText('pending');
    expect(badge).toHaveClass('bg-status-pending-bg', 'text-text-dark', 'dark:text-status-pending');
    expect(badge.childNodes[0]).toHaveClass('bg-status-pending-indicator');
  });

  it('renders paid status with correct styles', () => {
    render(<InvoiceStatusBadge status={InvoiceStatus.PAID} />);
    const badge = screen.getByText('paid');
    expect(badge).toHaveClass('bg-status-paid-bg', 'text-status-paid');
    expect(badge.childNodes[0]).toHaveClass('bg-status-paid-indicator');
  });

  it('renders status text in capitalized format', () => {
    render(<InvoiceStatusBadge status={InvoiceStatus.DRAFT} />);
    const badge = screen.getByText('draft');
    expect(badge).toHaveClass('capitalize');
  });
});
