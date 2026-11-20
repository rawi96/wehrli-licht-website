import { FC, ReactNode } from 'react';
import { cn } from '../../fundamentals/cn';

// Form controls shared by the contact form, the FAQ search and the checkout. Values come out as strings (not events).

const INPUT_CLASS =
  'block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-wehrli focus:ring-1 focus:ring-wehrli focus:outline-none';

type LabelProps = { htmlFor: string; children: ReactNode };

export const Label: FC<LabelProps> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="mb-1 block text-sm">
    {children}
  </label>
);

/** Props every control shares. `invalid` and `describedBy` connect the control with its FieldError. */
type ControlProps = {
  id: string;
  name?: string;
  value: string;
  onChange?: (value: string) => void;
  required?: boolean;
  invalid?: boolean;
  /** id of the element that describes the control, usually its FieldError. */
  describedBy?: string;
};

type TextInputProps = ControlProps & {
  type?: 'text' | 'email' | 'tel' | 'search';
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'email' | 'tel' | 'search';
  maxLength?: number;
  placeholder?: string;
  /** Shown, not editable (e.g. the only delivery country), in a darker gray. */
  readOnly?: boolean;
  /** Room for an icon at the start, e.g. the magnifier of a search field. */
  withIcon?: boolean;
};

export const TextInput: FC<TextInputProps> = ({
  id,
  name,
  value,
  onChange,
  required,
  invalid,
  describedBy,
  type = 'text',
  autoComplete,
  inputMode,
  maxLength,
  placeholder,
  readOnly,
  withIcon,
}) => (
  <input
    id={id}
    name={name}
    type={type}
    value={value}
    onChange={onChange ? (event) => onChange(event.target.value) : undefined}
    required={required}
    aria-invalid={invalid ? true : undefined}
    aria-describedby={describedBy}
    aria-readonly={readOnly ? true : undefined}
    readOnly={readOnly}
    autoComplete={autoComplete}
    inputMode={inputMode}
    maxLength={maxLength}
    placeholder={placeholder}
    className={cn(INPUT_CLASS, withIcon && 'pl-10', readOnly && 'cursor-default text-gray-700')}
  />
);

type TextareaProps = ControlProps & { rows?: number };

export const Textarea: FC<TextareaProps> = ({ id, name, value, onChange, required, invalid, describedBy, rows }) => (
  <textarea
    id={id}
    name={name}
    value={value}
    rows={rows}
    onChange={onChange ? (event) => onChange(event.target.value) : undefined}
    required={required}
    aria-invalid={invalid ? true : undefined}
    aria-describedby={describedBy}
    className={cn(INPUT_CLASS, 'min-h-[5rem] resize-y')}
  />
);

type SelectProps = ControlProps & { options: { value: string; label: string }[] };

export const Select: FC<SelectProps> = ({ id, name, value, onChange, required, invalid, describedBy, options }) => (
  <select
    id={id}
    name={name}
    value={value}
    onChange={onChange ? (event) => onChange(event.target.value) : undefined}
    required={required}
    aria-invalid={invalid ? true : undefined}
    aria-describedby={describedBy}
    className={INPUT_CLASS}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

type FieldErrorProps = { id: string; message?: string | null };

/** Validation message below a control. Renders nothing without a message. */
export const FieldError: FC<FieldErrorProps> = ({ id, message }) =>
  message ? (
    <p id={id} className="text-error-700 mt-1 text-sm">
      {message}
    </p>
  ) : null;

/** An error for the whole form, e.g. when sending failed. */
export const FormError: FC<{ children: ReactNode }> = ({ children }) => (
  <p role="alert" className="border-error bg-error-50 text-error-700 rounded-lg border-2 px-3 py-2 text-sm">
    {children}
  </p>
);
