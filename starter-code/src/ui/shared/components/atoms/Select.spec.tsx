import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Select, { SelectVariant } from './Select';

describe('Select', () => {
  const mockOptions = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' }
  ];

  it('should render with default variant', () => {
    const { container } = render(
      <Select
        value=""
        options={mockOptions}
        onSelectMenuItem={vi.fn()}
      />
    );
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-surface-light dark:bg-surface-dark');
  });

  it('should render with outline variant', () => {
    const { container } = render(
      <Select
        variant={SelectVariant.Outline}
        value=""
        options={mockOptions}
        onSelectMenuItem={vi.fn()}
      />
    );
    const button = container.querySelector('button');
    expect(button?.className).not.toContain('bg-surface-light');
  });

  it('should display placeholder when no value selected', () => {
    const placeholder = 'Select an option';
    const { getByText } = render(
      <Select
        value=""
        options={mockOptions}
        placeholder={placeholder}
        onSelectMenuItem={vi.fn()}
      />
    );
    expect(getByText(placeholder)).toBeInTheDocument();
  });

  it('should display selected option label', () => {
    const { getByText } = render(
      <Select
        value="opt1"
        options={mockOptions}
        onSelectMenuItem={vi.fn()}
      />
    );
    expect(getByText('Option 1')).toBeInTheDocument();
  });

  it('should render with full width when fullWidth prop is true', () => {
    const { container } = render(
      <Select
        value=""
        options={mockOptions}
        onSelectMenuItem={vi.fn()}
        fullWidth
      />
    );
    const button = container.querySelector('button');
    expect(button?.className).toContain('w-full h-[50px]');
  });
});
