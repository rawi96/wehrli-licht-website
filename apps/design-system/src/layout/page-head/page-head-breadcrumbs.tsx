import { FC, PropsWithChildren } from 'react';
import { cn } from '../../fundamentals/cn';
import { BREADCRUMBS_GAP, PAGE_HEAD_TOP } from './page-head';

/**
 * Breadcrumbs of pages with their own head (FAQ, shop, project), placed exactly where the content pages' heads put
 * them.
 */
export const PageHeadBreadcrumbs: FC<PropsWithChildren> = ({ children }) => (
  <div className={cn(PAGE_HEAD_TOP, BREADCRUMBS_GAP)}>{children}</div>
);
