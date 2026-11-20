import { getContactPath } from '@/utils/cms-page-path';
import { getHeaderFooter } from '@/utils/get-header-footer';
import { NotFound as NotFoundView } from '@wehrli/design-system';

const NotFound = async () => {
  // The 404 page still renders when DatoCMS is unreachable, with the fallback contact path.
  const headerFooter = await getHeaderFooter().catch(() => null);

  return <NotFoundView homeHref="/" contactHref={getContactPath(headerFooter)} />;
};

export default NotFound;
