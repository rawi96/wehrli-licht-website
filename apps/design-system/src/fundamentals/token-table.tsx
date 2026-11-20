import { FC, ReactNode } from 'react';

// Story helpers for the Fundamentals pages. Values are read from the CSS variables, so they never drift from tokens.css.

export const cssVar = (name: string) =>
  typeof window === 'undefined' ? '' : getComputedStyle(document.documentElement).getPropertyValue(name).trim();

type Row = { token: string; className: string; preview: ReactNode };

export const TokenTable: FC<{ rows: Row[]; variablePrefix: string }> = ({ rows, variablePrefix }) => (
  <table className="w-full border-collapse text-left text-xs">
    <thead>
      <tr className="border-b border-gray-200">
        <th className="py-2 pr-4 font-bold">Class</th>
        <th className="py-2 pr-4 font-bold">Value</th>
        <th className="py-2 font-bold">Preview</th>
      </tr>
    </thead>
    <tbody>
      {rows.map(({ token, className, preview }) => (
        <tr key={token} className="border-b border-gray-100 align-middle">
          <td className="py-3 pr-4 whitespace-nowrap">
            <code>{className}</code>
          </td>
          <td className="py-3 pr-4 text-gray-600">
            <code>{cssVar(`${variablePrefix}${token}`)}</code>
          </td>
          <td className="w-full py-3">{preview}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
