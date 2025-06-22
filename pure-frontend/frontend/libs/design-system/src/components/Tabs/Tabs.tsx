import React, { useState } from 'react';
import { cn } from '../../utils/cn';

export interface Tab {
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultIndex?: number;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultIndex = 0 }) => {
  const [active, setActive] = useState(defaultIndex);
  return (
    <div>
      <div className="flex border-b">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            className={cn('px-3 py-2', i === active && 'border-b-2 border-blue-500')}
            onClick={() => setActive(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="p-2">{tabs[active]?.content}</div>
    </div>
  );
};

Tabs.displayName = 'Tabs';
