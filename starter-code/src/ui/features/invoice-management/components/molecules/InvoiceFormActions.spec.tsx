import { render, screen, fireEvent } from '@testing-library/react';
import InvoiceFormActions from './InvoiceFormActions';
import { vi } from 'vitest';

describe('InvoiceFormActions', () => {
  const mockOnDiscard = vi.fn();
  const mockOnSaveAsDraft = vi.fn();
  const mockOnSaveAndSend = vi.fn();
  const mockOnUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when isUpdate is false', () => {
    it('renders Discard, Save as Draft and Save & Send buttons', () => {
      render(
        <InvoiceFormActions
          isUpdate={false}
          onDiscard={mockOnDiscard}
          onSaveAsDraft={mockOnSaveAsDraft}
          onSaveAndSend={mockOnSaveAndSend}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('Discard')).toBeInTheDocument();
      expect(screen.getByText('Save as Draft')).toBeInTheDocument();
      expect(screen.getByText('Save & Send')).toBeInTheDocument();
      expect(screen.queryByText('Update')).not.toBeInTheDocument();
    });

    it('calls correct handlers when buttons are clicked', () => {
      render(
        <InvoiceFormActions
          isUpdate={false}
          onDiscard={mockOnDiscard}
          onSaveAsDraft={mockOnSaveAsDraft}
          onSaveAndSend={mockOnSaveAndSend}
          onUpdate={mockOnUpdate}
        />
      );

      fireEvent.click(screen.getByText('Discard'));
      expect(mockOnDiscard).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByText('Save as Draft'));
      expect(mockOnSaveAsDraft).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByText('Save & Send'));
      expect(mockOnSaveAndSend).toHaveBeenCalledTimes(1);

      expect(mockOnUpdate).not.toHaveBeenCalled();
    });
  });

  describe('when isUpdate is true', () => {
    it('renders Discard and Update buttons', () => {
      render(
        <InvoiceFormActions
          isUpdate={true}
          onDiscard={mockOnDiscard}
          onSaveAsDraft={mockOnSaveAsDraft}
          onSaveAndSend={mockOnSaveAndSend}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('Discard')).toBeInTheDocument();
      expect(screen.getByText('Update')).toBeInTheDocument();
      expect(screen.queryByText('Save as Draft')).not.toBeInTheDocument();
      expect(screen.queryByText('Save & Send')).not.toBeInTheDocument();
    });

    it('calls correct handlers when buttons are clicked', () => {
      render(
        <InvoiceFormActions
          isUpdate={true}
          onDiscard={mockOnDiscard}
          onSaveAsDraft={mockOnSaveAsDraft}
          onSaveAndSend={mockOnSaveAndSend}
          onUpdate={mockOnUpdate}
        />
      );

      fireEvent.click(screen.getByText('Discard'));
      expect(mockOnDiscard).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByText('Update'));
      expect(mockOnUpdate).toHaveBeenCalledTimes(1);

      expect(mockOnSaveAsDraft).not.toHaveBeenCalled();
      expect(mockOnSaveAndSend).not.toHaveBeenCalled();
    });
  });
});
