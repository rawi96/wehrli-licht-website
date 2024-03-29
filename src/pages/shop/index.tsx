import { GetStaticProps, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import Image from 'next/image'
import Link from 'next/link'
import swell, { Category, Product } from 'swell-js'
import { AnalyticsListener } from '../../components/AnalyticsListener'
import { Bestsellers } from '../../components/Bestsellers'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Button } from '../../components/Button'
import { CallToAction } from '../../components/CallToAction'
import { Feedback } from '../../components/Feedback'
import { Footer } from '../../components/Footer'
import { PageContainer } from '../../components/PageContainer'
import { TitleSection } from '../../components/TitleSection'
import { Navigation } from '../../components/Navigation'

type ShopPageProps = {
  categories: Category[]
  bestsellers: Product[]
}

const ShopPage: NextPage<ShopPageProps> = ({ categories, bestsellers }) => {
  return (
    <>
      <NextSeo
        title={'Wehrli Licht Shop'}
        description={
          'Diese und viele weitere Leuchten sind auch in unserem Showroom in Goldach ausgestellt. Wir beraten Sie gerne persönlich und freuen uns auf Ihren Besuch!'
        }
      />

       <div className="mb-20 bg-wehrli">
      <div className="px-6 lg:px-8">
        <Navigation />
      </div>
      <div className="px-6 pt-12 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white" dangerouslySetInnerHTML={{ __html: 'Wehrli Licht Shop' }}></h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white">
            Diese und viele weitere Leuchten sind auch in unserem Showroom in Goldach ausgestellt. Wir beraten Sie gerne persönlich und freuen uns auf Ihren Besuch!
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
             <Button text="Zurück zur Website" type={'secondary'} />
        <Button text="Kontakt" type={'tertiary'} />
          </div>
        </div>
      </div>
    </div>

      

      <PageContainer>
        <Breadcrumbs pages={[{ name: 'Shop', href: '/shop' }]} />
        <TitleSection title="Entdecken Sie unsere Leuchten-Kategorien" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl pb-20 lg:max-w-none">
            <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
              {categories.map((category) => (
                <AnalyticsListener
                  key={category.name}
                  buttonName={category.name}
                >
                  <Link
                    href={`/shop/kategorien/${category.slug}`}
                    className="group block"
                  >
                    <div
                      key={category.name}
                      className="group relative cursor-pointer"
                    >
                      <div className="relative mt-12 h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                        {category.images?.length &&
                          category.images[0].file?.url && (
                            <Image
                              src={category.images[0].file.url}
                              alt={category.name}
                              className="h-full w-full object-cover object-center"
                              height={100}
                              width={1000}
                            />
                          )}
                      </div>
                      <h3 className="mt-4 text-base font-semibold text-gray-900">
                        {category.name}
                      </h3>
                      <p
                        className="mt-2 text-sm text-gray-500"
                        dangerouslySetInnerHTML={{
                          __html: category.description,
                        }}
                      ></p>
                    </div>
                  </Link>
                </AnalyticsListener>
              ))}
            </div>
          </div>
        </div>

        {bestsellers?.length > 0 && <Bestsellers bestsellers={bestsellers} />}

        <Feedback />
      </PageContainer>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps<ShopPageProps> = async () => {
  swell.init(
    process.env.NEXT_PUBLIC_SWELL_STORE_ID || '',
    process.env.NEXT_PUBLIC_SWELL_API_KEY || ''
  )

  const categories = await swell.categories.list()

  const bestsellers = (
    await swell.products.list({ limit: 100 })
  ).results.filter((product) => product.tags?.includes('bestseller'))

  return {
    props: { categories: categories.results, bestsellers },
    revalidate: 60,
  }
}

export default ShopPage
