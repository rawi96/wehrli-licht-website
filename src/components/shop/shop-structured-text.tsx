import { StructuredTextRenderer } from '@/components/dato-structured-text';
import { classNames } from '@/utils/css';
import { StructuredText as StructuredTextType } from 'datocms-structured-text-utils';
import { FC } from 'react';

type Props = {
  data: StructuredTextType | null | undefined;
  inverted?: boolean;
  className?: string;
};

export const ShopStructuredText: FC<Props> = ({ data, inverted, className }) => {
  if (!data) {
    return null;
  }

  return (
    <div
      className={classNames(
        className,
        inverted && '[&_a]:text-white [&_a:hover]:text-white/80 [&_p]:text-white/90 [&_strong]:text-white',
      )}
    >
      <StructuredTextRenderer data={data} />
    </div>
  );
};
