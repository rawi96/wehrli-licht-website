export type Props = {
  text?: string | null;
};

export const FormattedText = ({ text }: Props) => {
  const formattedText = text ? text.split('\n') : [];

  return (
    <span className="text-center text-xxs leading-6">
      <div className="mb-4">
        {formattedText.map((line, index) => (
          <div key={index}>{line || <br />}</div>
        ))}
      </div>
    </span>
  );
};
