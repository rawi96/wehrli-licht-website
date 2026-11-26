export type RadioCardOption<T extends string = string> = {
  value: T;
  title: string;
  description: string;
};

type Props<T extends string> = {
  /** Name of the radio group. */
  name: string;
  /** Accessible name of the group (visually hidden legend). */
  legend: string;
  options: RadioCardOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** A choice between a few options as bordered cards with a radio, title and description (shipping, payment). */
export const RadioCards = <T extends string>({ name, legend, options, value, onChange }: Props<T>) => (
  <fieldset className="space-y-3">
    <legend className="sr-only">{legend}</legend>
    {options.map((option) => (
      <label
        key={option.value}
        className="has-checked:border-wehrli has-checked:ring-wehrli flex cursor-pointer items-start gap-3 rounded-md border border-gray-200 p-4 has-checked:ring-1"
      >
        <input
          type="radio"
          name={name}
          value={option.value}
          checked={value === option.value}
          onChange={() => onChange(option.value)}
          className="text-wehrli mt-1"
        />
        <span className="text-left">
          <span className="block font-bold">{option.title}</span>
          <span className="text-sm text-gray-600">{option.description}</span>
        </span>
      </label>
    ))}
  </fieldset>
);
