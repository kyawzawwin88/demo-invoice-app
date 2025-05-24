import { Component, InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { Input as HeadlessInput } from '@headlessui/react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

class Input extends Component<InputProps> {
  private baseStyles = 'rounded-md border px-4 py-2 outline-none transition-colors h-[50px]';
    
  private themeStyles = 'bg-surface-light dark:bg-surface-dark border-surface-light dark:border-surface-darker text-text-light dark:text-text-dark';

  render() {
    const { fullWidth, ...props } = this.props;
    
    const widthStyles = fullWidth ? 'w-full' : 'w-auto';

    const styles = twMerge(
      this.baseStyles,
      this.themeStyles,
      widthStyles,
    );

    return (
      <HeadlessInput
        className={twMerge(
          styles,
          'border-1',
          'focus:border-primary-light',
          'hover:border-primary-light',
        )}
        {...props}
      />
    );
  }
}

export default Input;
