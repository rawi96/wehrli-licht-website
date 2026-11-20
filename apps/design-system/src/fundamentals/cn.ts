/**
 * Joins class names and drops empty values: `cn('px-4', isActive && 'font-bold')`.
 * It does not merge conflicting classes; components set their classes themselves and take no `className` prop.
 */
export const cn = (...classNames: (string | undefined | null | false)[]): string => classNames.filter(Boolean).join(' ');
