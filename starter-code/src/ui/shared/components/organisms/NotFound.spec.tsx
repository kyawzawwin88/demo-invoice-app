import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';
import { vi } from 'vitest';

describe('NotFound', () => {
  const renderNotFound = () => {
    return render(<NotFound />);
  };

  it('should render empty illustration image', () => {
    renderNotFound();
    const image = screen.getByAltText('No invoices found');
    expect(image).toBeInTheDocument();
  });

  it('should render heading text', () => {
    renderNotFound();
    expect(screen.getByText('There is nothing here')).toBeInTheDocument();
  });

  it('should render instruction text', () => {
    renderNotFound();
    expect(screen.getByText(/Create an invoice by clicking the/)).toBeInTheDocument();
    expect(screen.getByText('New Invoice')).toBeInTheDocument();
    expect(screen.getByText(/button and get started/)).toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    const { container } = renderNotFound();
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'gap-15', 'mt-30');
  });
});
