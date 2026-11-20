import { content } from '@/integrations';
import { NotFound as NotFoundView } from '@wehrli/design-system';

const NotFound = async () => <NotFoundView homeHref="/" contactHref={await content.getContactPath()} />;

export default NotFound;
