import { DirectoryRecord, LayoutDocument, NavigationItemRecord } from '@/graphql/generated';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { FC } from 'react';
import { Navigation } from './navigation';

export const Header: FC = async () => {
  const { layout } = await queryDatoCMS({ document: LayoutDocument });
  const { menu } = layout ?? {};

  return <>{menu && menu?.length > 0 && <Navigation items={menu as NavigationItemRecord[] | DirectoryRecord[]} />}</>;
};
