import { Footer } from '@/components/layout/footer';
import { content } from '@/integrations';
import { Container } from '@wehrli/design-system';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  return content.getPageMetadata('/');
}

export default async function HomePage() {
  const [page, layout] = await Promise.all([content.getHomePage(), content.getSiteLayout()]);

  if (!page) {
    notFound();
  }

  return (
    <>
      <main>
        {page.stage}
        <Container>{page.content}</Container>
      </main>
      <Footer layout={layout} rightsReserved={(await content.getSiteTexts()).footerRights} />
    </>
  );
}
