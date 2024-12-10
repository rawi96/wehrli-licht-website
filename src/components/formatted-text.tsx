export type Props = {
  text?: string | null;
};

export const FormattedText = ({ text }: Props) => {
  if (!text) {
    return null;
  }

  return (
    <div className="prose-invert mx-auto text-center text-sm leading-6">
      <style>
        {`
          .custom-prose a {
            color: white;
          }
          .custom-prose a {
            text-decoration: underline;
          }
        `}
      </style>
      <div className="custom-prose" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
};
