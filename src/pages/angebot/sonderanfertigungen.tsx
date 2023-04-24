import { GetStaticProps, NextPage } from 'next'
import { Button } from '../../components/Button'
import { CallToAction } from '../../components/CallToAction'
import { Footer } from '../../components/Footer'
import { PageContainer } from '../../components/PageContainer'
import { ProjectsTeaserRow } from '../../components/ProjectsTeaserRow'
import { TitleSection } from '../../components/TitleSection'
import { customProducts } from '../../data/customProducts'
import { offerItems } from '../../data/offerItems'
import { getAllProjectsWithHeaderImages } from '../../helpers/getAllProjectsWithHeaderImages'
import { ProjectWithHeaderImage } from '../../types/ProjectWithHeaderImage'

type CustomProductsPageProps = {
  projectsWithHeaderImages: ProjectWithHeaderImage[]
}

const CustomProductsPage: NextPage<CustomProductsPageProps> = ({
  projectsWithHeaderImages,
}) => {
  return (
    <>
      <CallToAction
        title={customProducts.title}
        intro={offerItems[4].description}
      >
        <Button
          type="secondary"
          text={customProducts.primaryButton.text}
          href={customProducts.primaryButton.link}
        />
        <Button
          type="tertiary"
          text={customProducts.secondaryButton.text}
          href={customProducts.secondaryButton.text}
        />
      </CallToAction>
      <PageContainer>
        <TitleSection title="Unser Service" />
        <div className="mb-16">
          <div className="mb-5">{customProducts.text1}</div>
          <div>{customProducts.text2}</div>
        </div>
        <TitleSection title="Lichtprojekte" />
        <ProjectsTeaserRow
          projectsWithHeaderImages={projectsWithHeaderImages.slice(0, 5)}
        />
      </PageContainer>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps<CustomProductsPageProps> = () => ({
  props: {
    projectsWithHeaderImages: getAllProjectsWithHeaderImages(),
  },
})

export default CustomProductsPage
