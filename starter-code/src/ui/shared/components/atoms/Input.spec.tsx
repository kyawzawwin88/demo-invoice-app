import { render } from '@testing-library/react';
import { vi } from 'vitest';
import Input from './Input';

describe('Input', () => {
  it('should render successfully', () => {
    const { container } = render(<Input />);
    expect(container).toBeTruthy();
  });

  it('should apply full width styles when fullWidth prop is true', () => {
    const { container } = render(<Input fullWidth />);
    const input = container.querySelector('input');
    expect(input?.className).toContain('w-full');
  });

  it('should apply auto width styles when fullWidth prop is false', () => {
    const { container } = render(<Input fullWidth={false} />);
    const input = container.querySelector('input');
    expect(input?.className).toContain('w-auto');
  });

  it('should pass through HTML input props', () => {
    const placeholder = 'Test placeholder';
    const onChange = vi.fn();
    
    const { container } = render(
      <Input 
        placeholder={placeholder}
        onChange={onChange}
        type="text"
        disabled
      />
    );

    const input = container.querySelector('input');
    expect(input?.placeholder).toBe(placeholder);
    expect(input?.type).toBe('text');
    expect(input?.disabled).toBe(true);
  });

  it('should apply base styles', () => {
    const { container } = render(<Input />);
    const input = container.querySelector('input');
    expect(input?.className).toContain('rounded-md');
    expect(input?.className).toContain('border');
    expect(input?.className).toContain('px-4');
    expect(input?.className).toContain('py-2');
    expect(input?.className).toContain('outline-none');
    expect(input?.className).toContain('transition-colors');
    expect(input?.className).toContain('h-[50px]');
  });

  it('should apply theme styles', () => {
    const { container } = render(<Input />);
    const input = container.querySelector('input');
    expect(input?.className).toContain('bg-surface-light');
    expect(input?.className).toContain('dark:bg-surface-dark');
    expect(input?.className).toContain('border-surface-light');
    expect(input?.className).toContain('dark:border-surface-darker');
    expect(input?.className).toContain('text-text-light');
    expect(input?.className).toContain('dark:text-text-dark');
  });

  it('should apply focus and hover styles', () => {
    const { container } = render(<Input />);
    const input = container.querySelector('input');
    expect(input?.className).toContain('focus:border-primary-light');
    expect(input?.className).toContain('hover:border-primary-light');
    expect(input?.className).toContain('border-1');
  });
});
