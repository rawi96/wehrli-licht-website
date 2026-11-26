import { Breadcrumbs } from '@/components/breadcrumbs';
import { ArticleJsonLd } from '@/components/seo/article-json-ld';
import { SitePage } from '@/components/layout/site-page';
import { ProjectCards } from '@/components/projects/project-cards';
import { getProjectPath, projectBreadcrumbs, relatedProjects } from '@/domain/content/project';
import { content } from '@/integrations';
import { Container, Heading, ProjectFacts, Section, PageHeadBreadcrumbs } from '@wehrli/design-system';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return content.getProjectPageMetadata((await params).slug);
}

export async function generateStaticParams() {
  const [projects, areas] = await Promise.all([content.listProjects(), content.listProjectAreas()]);

  // A project and an area with the same slug share a URL: the project wins (see getProjectPage).
  return [...new Set([...projects, ...areas].map(({ slug }) => slug))].map((slug) => ({ slug }));
}

export const dynamicParams = true;

/** A reference project, or the overview of a project area. */
export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const page = await content.getProjectPage(slug);

  if (!page) {
    notFound();
  }

  if (page.kind === 'page') {
    return (
      <SitePage>
        {page.page.article && <ArticleJsonLd article={page.page.article} path={getProjectPath(slug)} />}
        <Container>{page.page.render(<Breadcrumbs customBreadcrumbs={page.page.breadcrumbs} spacing="tight" />)}</Container>
      </SitePage>
    );
  }

  if (page.kind === 'area') {
    return (
      <SitePage>
        <Container>
          {page.render(<Breadcrumbs customBreadcrumbs={projectBreadcrumbs(page.area)} spacing="tight" />)}
        </Container>
      </SitePage>
    );
  }

  const { project, projects } = page;
  const texts = await content.getSiteTexts();
  const facts = [
    { label: texts.projectFactClient, value: project.client },
    { label: texts.projectFactLocation, value: project.location },
    { label: texts.projectFactYear, value: project.year },
    { label: texts.projectFactArea, value: project.area?.name ?? null },
  ].flatMap(({ label, value }) => (value ? [{ label, value }] : []));
  const related = relatedProjects(projects, project);

  return (
    <SitePage>
      <Container>
        <PageHeadBreadcrumbs>
          <Breadcrumbs customBreadcrumbs={projectBreadcrumbs(project.area, project)} spacing="tight" />
        </PageHeadBreadcrumbs>
        {page.intro}
        <ProjectFacts
          facts={facts}
          services={project.services.map(({ title, href }) => ({ label: title, href }))}
          labels={{ services: texts.projectFactServices }}
        />
        {page.content}
        {related.length > 0 && (
          <Section>
            <Heading level="2">{texts.projectsRelatedTitle}</Heading>
            <ProjectCards projects={related} linkLabel={texts.projectsCardLink} />
          </Section>
        )}
      </Container>
    </SitePage>
  );
}
