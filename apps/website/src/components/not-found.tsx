import { content } from '@/integrations';
import { NotFound as NotFoundView } from '@wehrli/design-system';

const NotFound = async () => {
  const [contactHref, texts] = await Promise.all([content.getContactPath(), content.getSiteTexts()]);

  return (
    <NotFoundView
      title={texts.notFoundTitle}
      text={texts.notFoundText}
      homeHref="/"
      homeLabel={texts.notFoundHomeLink}
      contactHref={contactHref}
    />
  );
};

export default NotFound;
