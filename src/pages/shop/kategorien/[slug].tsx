import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import swell, { Category, Product } from 'swell-js'
import { Feedback } from '../../../components/Feedback'
import { Footer } from '../../../components/Footer'
import { Hero } from '../../../components/Hero'
import { PageContainer } from '../../../components/PageContainer'
import { TitleSection } from '../../../components/TitleSection'

type CategorySlugPage = {
  products: Product[]
  category: Category
}

const ProjectPage: NextPage<CategorySlugPage> = ({ category, products }) => {
  console.log(products)
  return (
    <>
      <Hero
        image={{
          src: '/images/essbereich.jpg',
          altText: 'Essbereich Beleuchtung',
        }}
        title={category.name}
        intro="Diese und viele weitere Leuchten sind auch in unserem Showroom in Goldach ausgestellt. Wir beraten Sie gerne persönlich und freuen uns auf Ihren Besuch!"
        primaryButton={{
          text: 'Warenkorb',
          link: '/shop',
        }}
        secondaryButton={{
          text: 'Kasse',
          link: '/shop',
        }}
      />
      <PageContainer>
        <TitleSection title="Bestseller" />
        <div className="mx-auto max-w-2xl px-4 pb-20 pt-10 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Produkte</h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <a
                key={product.id}
                href={`/shop/produkte/${product.slug}`}
                className="group"
              >
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  {product.images?.length && product.images[0].file?.url && (
                    <img
                      src={product.images[0].file.url}
                      alt={product.name}
                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                    />
                  )}
                </div>
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {product.price}
                </p>
              </a>
            ))}
          </div>
        </div>

        <Feedback />
      </PageContainer>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps<CategorySlugPage> = async ({
  params,
}) => {
  const { slug } = params || {}

  swell.init(process.env.SWELL_STORE_ID || '', process.env.SWELL_API_KEY || '')

  const products = await swell.products.list({
    category: typeof slug === 'string' ? slug : '',
  })

  console.log('-----------')
  console.log(products)

  const category = await swell.categories.get(
    typeof slug === 'string' ? slug : ''
  )

  return {
    props: { category: category, products: products.results },
    revalidate: 60,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  swell.init('wehrli-licht', 'pk_G2OVaJ200p3pymiEpJWcnbsbo0WDLxiy')

  const { results } = await swell.categories.list()

  return {
    paths: results.map(({ slug }) => ({ params: { slug } })),
    fallback: 'blocking',
  }
}

export default ProjectPage
