import { render, screen, fireEvent } from '@testing-library/react';
import LeftNavigationBar from './LeftNavigationBar';
import { AllFeatureLayoutContext } from '../../hooks/AllFeatureLayoutContext';
import { vi } from 'vitest';

describe('LeftNavigationBar', () => {
  const mockContextValue = {
    theme: 'light',
    setTheme: vi.fn(),
    showInvoiceForm: null,
    setShowInvoiceForm: vi.fn(),
    shouldInvoiceListingRefresh: false,
    setShouldInvoiceListingRefresh: vi.fn(),
    messageDialog: null,
    setMessageDialog: vi.fn()
  };

  const renderNavBar = (contextValue = mockContextValue) => {
    return render(
      <AllFeatureLayoutContext.Provider value={contextValue}>
        <LeftNavigationBar />
      </AllFeatureLayoutContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render logo', () => {
    renderNavBar();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  it('should render user avatar', () => {
    renderNavBar();
    expect(screen.getByAltText('User Avatar')).toBeInTheDocument();
  });

  it('should render moon icon in light theme', () => {
    renderNavBar();
    expect(screen.getByAltText('Dark mode')).toBeInTheDocument();
  });

  it('should render sun icon in dark theme', () => {
    renderNavBar({ ...mockContextValue, theme: 'dark' });
    expect(screen.getByAltText('Light mode')).toBeInTheDocument();
  });

  it('should toggle theme when theme icon is clicked', () => {
    renderNavBar();
    const themeToggle = screen.getByAltText('Dark mode');
    fireEvent.click(themeToggle.parentElement!);

    expect(mockContextValue.setTheme).toHaveBeenCalledWith('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should have correct styling classes', () => {
    const { container } = renderNavBar();
    const nav = container.firstChild as HTMLElement;
    expect(nav).toHaveClass(
      'fixed',
      'left-0', 
      'top-0',
      'h-screen',
      'w-[80px]',
      'flex',
      'flex-col',
      'justify-between',
      'bg-primary-default',
      'dark:bg-surface-dark'
    );
  });
});
