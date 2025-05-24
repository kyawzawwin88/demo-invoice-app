import { Component } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import IconArrowDown from '../../../../../assets/icon-arrow-down.svg';

type Option = {
  label: string;
  value: string;
};

export enum SelectVariant {
  Outline = 'outline',
  Default = 'default'
}

interface SelectProps {
  variant?: SelectVariant;
  options?: Option[];
  value: string;
  onSelectMenuItem: (value: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
}

class Select extends Component<SelectProps> {
  render() {
    const { variant = SelectVariant.Default, value, onSelectMenuItem, placeholder, options, ...props } = this.props;
    const selectedOption = options?.find((opt) => opt.value === value);

    return (
      <Menu>
        <MenuButton
          className={`text-text-light dark:text-text-dark inline-flex justify-between items-center gap-2 rounded-md px-7 py-1.5 text-sm/6 font-semibold focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white cursor-pointer ${variant === SelectVariant.Outline ? '' : 'bg-surface-light dark:bg-surface-dark shadow-inner shadow-white/10 data-hover:bg-surface-light data-hover:dark:bg-surface-darker data-open:bg-surface-light data-open:dark:bg-surface-darker'} ${props.fullWidth ? 'w-full h-[50px]' : ''}`}
          {...props}
        >
          <span>{selectedOption?.label || placeholder}</span>
          <img src={IconArrowDown} alt="Arrow down" className="group pointer-events-none w-3 h-2 fill-white/60" aria-hidden="true" />
        </MenuButton>
        
        <MenuItems
          transition
          anchor="bottom end"
          className="z-3 w-52 origin-top-right rounded-xl border border-surface-dark/75 bg-surface-dark/75 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0 cursor-pointer"
        >
          {options?.map((opt) => (
            <MenuItem>
              <button onClick={() => onSelectMenuItem(opt.value)} className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                {opt.label}
              </button>
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
    );
  }
}

export default Select;
