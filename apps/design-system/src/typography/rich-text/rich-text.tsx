import { FC, PropsWithChildren } from 'react';

// The parts of rich text (DatoCMS structured text). The website maps each node type onto one of them.

/** Wrapper of a rich text field: sets the text size. */
export const RichText: FC<PropsWithChildren> = ({ children }) => <div className="text-sm lg:text-base">{children}</div>;

export const Paragraph: FC<PropsWithChildren> = ({ children }) => (
  <p className="peer my-4 text-sm md:max-w-prose lg:my-8 lg:text-base">{children}</p>
);

/** Emphasis (italic) is set in the serif font. */
export const Emphasis: FC<PropsWithChildren> = ({ children }) => (
  <em className="font-serif font-normal italic">{children}</em>
);

export const Strong: FC<PropsWithChildren> = ({ children }) => <strong className="font-bold">{children}</strong>;

export const InlineCode: FC<PropsWithChildren> = ({ children }) => (
  <code className="text-code rounded-sm p-1">{children}</code>
);

export const UnorderedList: FC<PropsWithChildren> = ({ children }) => (
  <ul className="my-4 ml-5 list-outside list-disc space-y-2 lg:my-8">{children}</ul>
);

export const OrderedList: FC<PropsWithChildren> = ({ children }) => (
  <ol className="my-4 ml-7 list-outside list-decimal space-y-2 marker:font-bold lg:my-8">{children}</ol>
);

export const ListItem: FC<PropsWithChildren> = ({ children }) => <li className="md:max-w-prose">{children}</li>;

type BlockquoteProps = PropsWithChildren<{ attribution?: string | null }>;

export const Blockquote: FC<BlockquoteProps> = ({ children, attribution }) => (
  <div className="bg-white-100 my-4 rounded-lg px-8 py-1 md:max-w-prose lg:my-8">
    {children}
    {attribution && <p className="my-4 text-sm italic opacity-50 lg:my-8">{attribution}</p>}
  </div>
);

export const ThematicBreak: FC = () => <hr className="mx-auto my-8 max-w-[75%] border-black lg:my-16" />;

/** An embedded block inside rich text, e.g. an image: spaced like a paragraph. */
export const RichTextEmbed: FC<PropsWithChildren> = ({ children }) => <div className="my-4 lg:my-8">{children}</div>;
