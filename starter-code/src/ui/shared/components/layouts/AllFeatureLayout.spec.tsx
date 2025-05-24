import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Layout from './AllFeatureLayout';

// Mock the components used in Layout
vi.mock('../organisms/LeftNavigationBar', () => ({
  default: () => <div data-testid="left-nav">Left Nav</div>
}));

vi.mock('../molecules/MessageDialog', () => ({
  default: ({ isOpen, title, message, onClose }) => (
    <div data-testid="message-dialog" style={{ display: isOpen ? 'block' : 'none' }}>
      <div>{title}</div>
      <div>{message}</div>
      <button onClick={onClose}>Close</button>
    </div>
  )
}));

vi.mock('../../../features/invoice-management/pages/InvoiceForm', () => ({
  default: ({ invoice }) => <div data-testid="invoice-form">Invoice Form</div>
}));

describe('AllFeatureLayout', () => {
  const renderLayout = () => {
    return render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should render the layout with default light theme', () => {
    renderLayout();
    const layoutContainer = screen.getByTestId('left-nav').parentElement?.parentElement;
    expect(layoutContainer?.className).toContain('light');
    expect(layoutContainer?.className).toContain('bg-background-light');
  });

  it('should render with dark theme when set in localStorage', () => {
    localStorage.setItem('theme', 'dark');
    renderLayout();
    const layoutContainer = screen.getByTestId('left-nav').parentElement?.parentElement;
    expect(layoutContainer?.className).toContain('dark');
    expect(layoutContainer?.className).toContain('bg-background-dark');
  });

  it('should render LeftNavigationBar', () => {
    renderLayout();
    expect(screen.getByTestId('left-nav')).toBeInTheDocument();
  });

  it('should not show invoice form by default', () => {
    renderLayout();
    expect(screen.queryByTestId('invoice-form')).not.toBeInTheDocument();
  });

  it('should not show message dialog by default', () => {
    renderLayout();
    const messageDialog = screen.getByTestId('message-dialog');
    expect(messageDialog.style.display).toBe('none');
  });
});
