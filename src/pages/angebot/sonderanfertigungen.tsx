import { GetStaticProps, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { Button } from '../../components/Button'
import { CallToAction } from '../../components/CallToAction'
import { Footer } from '../../components/Footer'
import { PageContainer } from '../../components/PageContainer'
import { ProjectsTeaserRow } from '../../components/ProjectsTeaserRow'
import { ServiceTeaser } from '../../components/ServiceTeaser'
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
      <NextSeo
        title={customProducts.title}
        description={offerItems[4].description}
      />
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
        <div className="mb-20 grid gap-4 md:grid-cols-2">
          <div>
            <h2 className="mb-2 font-bold">Vielfalt in Stil und Auswahl</h2>
            <p>
              Jeder Mensch ist verschieden, ebenso wie Geschmäcker und
              Einrichtungsstile. Unsere grosse Auswahl an Leuchten in
              verschiedenen Grössen, Formen und Farben ermöglicht es, für jeden
              individuellen Geschmack und Raum das passende Beleuchtungselement
              zu finden. Egal ob minimalistisch, modern, verspielt oder
              klassisch - bei uns findet jeder seinen persönlichen Stil.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-bold">
              Massgeschneiderte Lösungen und Anpassungen
            </h2>
            <p>
              Durch unsere direkte Zusammenarbeit mit den Herstellern bieten wir
              die Möglichkeit für Sonderanfertigungen und individuelle
              Anpassungen. So können Sie Ihre Beleuchtung ganz nach Ihren
              Vorstellungen gestalten und Ihren persönlichen Stempel auf Ihre
              Einrichtung setzen. Wir helfen Ihnen dabei, Ihre individuellen
              Bedürfnisse zu erfüllen und Ihre Leuchte zu einem einzigartigen
              Highlight in Ihrem Raum zu machen.
            </p>
            <div className="my-4">
              <Button
                type="primary"
                text="Jetzt einen Termin vereinbaren"
                href="/kontakt"
              />
            </div>
          </div>
        </div>
        <ServiceTeaser
          title={'Leuchten Sonderanfertigungen'}
          imageUrl="/images/teasers/sonderanfertigungen.jpg"
          items={[
            'Verlängerung oder Kürzung von Pendelleuchten',
            'Leuchten nach RAL-Farben lackieren',
            'Steuerung der Leuchte auf das vorhandene Smart Home System anpassen',
            'Lichtfarbe ändern',
            'Komplett neue Leuchte anfertigen',
            'Bedrucken von Stoffschirmen',
          ]}
        />
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
