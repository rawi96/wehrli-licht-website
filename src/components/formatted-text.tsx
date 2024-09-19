export type Props = {
  size?: 's' | 'l';
  text?: string | null;
};

export const FormattedText = ({ size = 's', text }: Props) => {
  const formattedText = text ? text.split('\n') : [];

  return (
    <span className={`${size === 's' ? 'text-sm' : 'text-lg'} text-center leading-6`}>
      <div className="mb-4">
        {formattedText.map((line, index) => (
          <div key={index}>{line || <br />}</div>
        ))}
      </div>
    </span>
  );
};
