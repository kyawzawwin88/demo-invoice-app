import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ConfirmDialog from './ConfirmDialog';
import { AllFeatureLayoutContext } from '../../hooks/AllFeatureLayoutContext';

describe('ConfirmDialog', () => {
  const mockProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Test Title',
    message: 'Test Message',
    confirmText: 'Yes',
    cancelText: 'No'
  };

  const renderDialog = (props = mockProps) => {
    return render(
      <AllFeatureLayoutContext.Provider value={{ theme: 'light', setTheme: vi.fn(), showInvoiceForm: null, setShowInvoiceForm: vi.fn(), shouldInvoiceListingRefresh: false, setShouldInvoiceListingRefresh: vi.fn(), messageDialog: null, setMessageDialog: vi.fn() }}>
        <ConfirmDialog {...props} />
      </AllFeatureLayoutContext.Provider>
    );
  };

  it('should render dialog with provided title and message', () => {
    renderDialog();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('should render custom button text', () => {
    renderDialog();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('should use default button text when not provided', () => {
    const props = {
      ...mockProps,
      confirmText: undefined,
      cancelText: undefined
    };
    renderDialog(props);
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', () => {
    renderDialog();
    fireEvent.click(screen.getByText('No'));
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('should call both onConfirm and onClose when confirm button is clicked', () => {
    renderDialog();
    fireEvent.click(screen.getByText('Yes'));
    expect(mockProps.onConfirm).toHaveBeenCalled();
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('should apply theme class from context', () => {
    renderDialog();
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('light');
  });
});
