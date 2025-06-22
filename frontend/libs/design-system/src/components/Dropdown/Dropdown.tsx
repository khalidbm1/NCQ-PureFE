import React from 'react';
import { cn } from '../../utils/cn';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: DropdownOption[];
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  className,
  ...props
}) => (
  <select className={cn('rounded border p-2', className)} {...props}>
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);

Dropdown.displayName = 'Dropdown';
