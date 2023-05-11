import { GetStaticProps, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import swell, { Category } from 'swell-js'
import { Feedback } from '../../components/Feedback'
import { Footer } from '../../components/Footer'
import { Hero } from '../../components/Hero'
import { PageContainer } from '../../components/PageContainer'
import { TitleSection } from '../../components/TitleSection'
import { home } from '../../data/home'

const products = [
  {
    id: 1,
    name: 'Earthen Bottle',
    href: '#',
    price: '$48',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
    imageAlt:
      'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },
  {
    id: 2,
    name: 'Nomad Tumbler',
    href: '#',
    price: '$35',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
    imageAlt:
      'Olive drab green insulated bottle with flared screw lid and flat top.',
  },
  {
    id: 3,
    name: 'Focus Paper Refill',
    href: '#',
    price: '$89',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg',
    imageAlt:
      'Person using a pen to cross a task off a productivity paper card.',
  },
  {
    id: 4,
    name: 'Machined Mechanical Pencil',
    href: '#',
    price: '$35',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
    imageAlt:
      'Hand holding black machined steel mechanical pencil with brass tip and top.',
  },
  // More products...
]

type ShopPageProps = {
  categories: Category[]
}

const ShopPage: NextPage<ShopPageProps> = ({ categories }) => {
  return (
    <>
      <NextSeo title="Wehrli Licht GmbH" description={home.intro} />
      <Hero
        image={{
          src: '/images/essbereich.jpg',
          altText: 'Essbereich Beleuchtung',
        }}
        title={'Wehrli Licht Shop'}
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
        <TitleSection title="Kategorien" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl pb-20 lg:max-w-none">
            <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
              {categories.map((category) => (
                <div key={category.name} className="group relative ">
                  <div className="relative mt-12 h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                    {category.images?.length &&
                      category.images[0].file?.url && (
                        <img
                          src={category.images[0].file.url}
                          alt={category.name}
                          className="h-full w-full object-cover object-center"
                        />
                      )}
                  </div>
                  <h3 className="mt-6 text-sm text-gray-500">
                    <a href={`/shop/kategorien/${category.slug}`}>
                      <span className="absolute inset-0" />
                      {category.name}
                    </a>
                  </h3>
                  <p className="text-base font-semibold text-gray-900">
                    {category.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <TitleSection title="Bestseller" />
        <div className="mx-auto max-w-2xl px-4 pb-20 pt-10 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <a key={product.id} href={product.href} className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
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

export const getStaticProps: GetStaticProps<ShopPageProps> = async () => {
  swell.init(process.env.SWELL_STORE_ID || '', process.env.SWELL_API_KEY || '')

  const { results } = await swell.categories.list()

  return { props: { categories: results }, revalidate: 60 }
}

export default ShopPage
