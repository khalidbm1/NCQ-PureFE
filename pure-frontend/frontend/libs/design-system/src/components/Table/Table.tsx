import React from 'react';
import { cn } from '../../utils/cn';

export interface TableProps {
  headers: string[];
  rows: React.ReactNode[][];
  className?: string;
}

export const Table: React.FC<TableProps> = ({ headers, rows, className }) => (
  <table className={cn('min-w-full text-left border', className)}>
    <thead>
      <tr>
        {headers.map((h) => (
          <th key={h} className="border-b px-2 py-1">
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, i) => (
        <tr key={i}>
          {row.map((cell, j) => (
            <td key={j} className="border-b px-2 py-1">
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

Table.displayName = 'Table';
