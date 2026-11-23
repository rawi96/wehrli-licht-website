import NextImage from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import { cn } from '../../fundamentals/cn';

export type CategoryNavLink = {
  id: string;
  label: string;
  href: string;
  /** The current page. */
  active?: boolean;
  /** Square thumbnail in the sidebar (a plain image URL). */
  thumbnailSrc?: string | null;
};

type Props = {
  links: CategoryNavLink[];
  /**
   * `sidebar`: grey links with thumbnails and an active bar, in the shop's sidebar.
   * `mobile`: white links on the brand color, in the mobile menu.
   */
  variant: 'sidebar' | 'mobile';
  /** Accessible name of the navigation (sidebar). */
  label?: string;
  /** Small heading above the links. */
  heading?: string;
  /** Called when a link is followed, e.g. to close the mobile menu. */
  onLinkClick?: () => void;
};

const LINK_CLASSES = {
  sidebar: {
    base: 'group relative flex items-center gap-3 py-2 pr-2 pl-3 text-sm transition-colors hover:bg-wehrli-50 hover:text-wehrli',
    inactive: 'text-gray-600',
    active: 'bg-wehrli-50 text-wehrli',
  },
  mobile: {
    base: 'group -mx-3 flex gap-x-3 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10',
    inactive: '',
    active: 'bg-wehrli',
  },
} as const;

const ActiveBar: FC<{ active: boolean }> = ({ active }) => (
  <span
    aria-hidden="true"
    className={cn(
      'bg-wehrli absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full transition-opacity',
      active ? 'opacity-100' : 'opacity-0 group-hover:opacity-40',
    )}
  />
);

const Thumbnail: FC<{ src: string }> = ({ src }) => (
  <span className="relative size-9 shrink-0 overflow-hidden rounded-md bg-gray-100 ring-1 ring-gray-200/80">
    <NextImage src={src} alt="" width={36} height={36} sizes="36px" loading="lazy" className="size-full object-cover" />
  </span>
);

const LinkList: FC<Omit<Props, 'label' | 'heading'>> = ({ links, variant, onLinkClick }) => {
  const isSidebar = variant === 'sidebar';
  const classes = LINK_CLASSES[variant];

  return (
    <ul className={isSidebar ? 'space-y-0.5' : 'space-y-1'}>
      {links.map((link) => (
        <li key={link.id}>
          <Link
            href={link.href}
            prefetch={false}
            className={cn(classes.base, link.active ? classes.active : classes.inactive)}
            aria-current={link.active ? 'page' : undefined}
            onClick={onLinkClick}
          >
            {isSidebar && <ActiveBar active={!!link.active} />}
            {isSidebar && link.thumbnailSrc && <Thumbnail src={link.thumbnailSrc} />}
            <span className="truncate">{link.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

/** Links to the product categories: in the shop's sidebar or in the mobile menu. Renders nothing without links. */
export const CategoryNav: FC<Props> = ({
  links,
  variant,
  label = 'Shop-Kategorien',
  heading = variant === 'sidebar' ? 'Kategorien' : 'Shop-Kategorien',
  onLinkClick,
}) => {
  if (links.length === 0) {
    return null;
  }

  if (variant === 'mobile') {
    return (
      <div className="pt-4">
        <p className="mb-2 px-3 text-xs font-bold text-white/80">{heading}</p>
        <LinkList links={links} variant={variant} onLinkClick={onLinkClick} />
      </div>
    );
  }

  return (
    <nav aria-label={label} className="flex flex-col gap-y-5">
      <div>
        <p className="text-xs font-bold text-gray-400">{heading}</p>
        <div className="mt-2">
          <LinkList links={links} variant={variant} onLinkClick={onLinkClick} />
        </div>
      </div>
    </nav>
  );
};
