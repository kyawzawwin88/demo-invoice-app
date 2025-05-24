import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import MessageDialog from './MessageDialog';
import { AllFeatureLayoutContext } from '../../hooks/AllFeatureLayoutContext';

describe('MessageDialog', () => {
  const mockProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Title',
    message: 'Test Message',
    buttonText: 'OK'
  };

  const renderDialog = (props = mockProps) => {
    return render(
      <AllFeatureLayoutContext.Provider value={{ theme: 'light', setTheme: vi.fn(), showInvoiceForm: null, setShowInvoiceForm: vi.fn(), shouldInvoiceListingRefresh: false, setShouldInvoiceListingRefresh: vi.fn(), messageDialog: null, setMessageDialog: vi.fn() }}>
        <MessageDialog {...props} />
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
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('should use default button text when not provided', () => {
    const props = {
      ...mockProps,
      buttonText: undefined
    };
    renderDialog(props);
    expect(screen.getByText('Ok')).toBeInTheDocument();
  });

  it('should call onClose when button is clicked', () => {
    renderDialog();
    fireEvent.click(screen.getByText('OK'));
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('should apply theme class from context', () => {
    renderDialog();
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('light');
  });
});
