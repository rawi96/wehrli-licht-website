type Props = {
  data: Record<string, unknown>;
};

// Escape "<" so CMS text containing "</script>" cannot break out of the tag.
const serialize = (data: Record<string, unknown>): string => JSON.stringify(data).replace(/</g, '\\u003c');

export const JsonLd = ({ data }: Props) => (
  // eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml -- serialized and escaped JSON-LD
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(data) }} />
);
