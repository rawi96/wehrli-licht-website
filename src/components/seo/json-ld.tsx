type Props = {
  data: Record<string, unknown>;
};

export const JsonLd = ({ data }: Props) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
);
