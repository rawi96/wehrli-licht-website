import { Breadcrumbs } from '@/components/breadcrumbs';
import { SitePage } from '@/components/layout/site-page';
import { ProjectCards } from '@/components/projects/project-cards';
import { projectBreadcrumbs, relatedProjects } from '@/domain/content/project';
import { content } from '@/integrations';
import { Container, Heading, ProjectFacts, RichText, Section } from '@wehrli/design-system';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return content.getProjectPageMetadata((await params).slug);
}

export async function generateStaticParams() {
  const [projects, areas] = await Promise.all([content.listProjects(), content.listProjectAreas()]);

  return [...projects, ...areas].map(({ slug }) => ({ slug }));
}

export const dynamicParams = true;

/** A reference project, or the overview of a project area. */
export default async function ProjectPage({ params }: Params) {
  const page = await content.getProjectPage((await params).slug);

  if (!page) {
    notFound();
  }

  if (page.kind === 'area') {
    const { area, projects } = page;

    return (
      <SitePage>
        <Container>
          <Breadcrumbs customBreadcrumbs={projectBreadcrumbs(area)} />
          <Section marginTop={false}>
            <Heading level="1">{`Projekte: ${area.name}`}</Heading>
            {area.intro && (
              <RichText>
                <p>{area.intro}</p>
              </RichText>
            )}
            <ProjectCards projects={projects} />
          </Section>
        </Container>
      </SitePage>
    );
  }

  const { project, projects } = page;
  const facts = [
    { label: 'Kunde', value: project.client },
    { label: 'Ort', value: project.location },
    { label: 'Jahr', value: project.year },
    { label: 'Bereich', value: project.area?.name ?? null },
  ].flatMap(({ label, value }) => (value ? [{ label, value }] : []));
  const related = relatedProjects(projects, project);

  return (
    <SitePage>
      <Container>
        <Breadcrumbs customBreadcrumbs={projectBreadcrumbs(project.area, project)} />
        {page.intro}
        <ProjectFacts facts={facts} services={project.services.map(({ title, href }) => ({ label: title, href }))} />
        {page.content}
        {related.length > 0 && (
          <Section>
            <Heading level="2">Weitere Projekte</Heading>
            <ProjectCards projects={related} />
          </Section>
        )}
      </Container>
    </SitePage>
  );
}
