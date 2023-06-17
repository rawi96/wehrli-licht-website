import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Image from 'next/image'
import swell, { Category, Product, Variant } from 'swell-js'
import { Bestsellers } from '../../../components/Bestsellers'
import { Breadcrumbs } from '../../../components/Breadcrumbs'
import { Feedback } from '../../../components/Feedback'
import { Footer } from '../../../components/Footer'
import { Header } from '../../../components/Header'
import { PageContainer } from '../../../components/PageContainer'
import { TitleSection } from '../../../components/TitleSection'
import Link from 'next/link'

type CategorySlugPage = {
  products: Product[]
  category: Category
  bestsellers: Product[]
}

const getLowestPriceFromVariantsOrProductPrice = (product: Product) => {
  const variants = product.variants as unknown as { results: Variant[] }
  if (variants.results.length > 0) {
    const variantsWithPrice = variants.results.filter(
      (variant) => typeof variant.price === 'number'
    )

    const prices = variantsWithPrice.map((variant) => variant.price as number)

    return `Ab CHF ${Math.min(...prices)}.-`
  } else {
    return `CHF ${product.price}.-`
  }
}

const CategorySlugPage: NextPage<CategorySlugPage> = ({
  category,
  products,
  bestsellers,
}) => {
  return (
    <>
      <Header />
      <PageContainer>
        <Breadcrumbs
          pages={[
            { name: 'Shop', href: '/shop' },
            { name: category.name, href: category.slug },
          ]}
        />
        <TitleSection title={category.name} />
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 pb-20 pt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <>
              <Link
                key={product.id}
                href={`/shop/produkte/${product.slug}`}
                className="group"
              >
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  {product.images?.length && product.images[0].file?.url && (
                    <Image
                      src={product.images[0].file.url}
                      alt={product.name}
                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                      width={1000}
                      height={1000}
                    />
                  )}
                </div>
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {getLowestPriceFromVariantsOrProductPrice(product)}
                </p>
              </Link>
            </>
          ))}
        </div>

        {bestsellers?.length > 0 && <Bestsellers bestsellers={bestsellers} />}

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

  swell.init(
    process.env.NEXT_PUBLIC_SWELL_STORE_ID || '',
    process.env.NEXT_PUBLIC_SWELL_API_KEY || ''
  )

  const products = await swell.products.list({
    category: typeof slug === 'string' ? slug : '',
    expand: ['variants'],
    limit: 100,
  })

  const bestsellers = (
    await swell.products.list({ limit: 100 })
  ).results.filter((product) => product.tags?.includes('bestseller'))

  const category = await swell.categories.get(
    typeof slug === 'string' ? slug : ''
  )

  return {
    props: { category: category, products: products.results, bestsellers },
    revalidate: 60,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  swell.init(
    process.env.NEXT_PUBLIC_SWELL_STORE_ID || '',
    process.env.NEXT_PUBLIC_SWELL_API_KEY || ''
  )

  const { results } = await swell.categories.list()

  return {
    paths: results.map(({ slug }) => ({ params: { slug } })),
    fallback: 'blocking',
  }
}

export default CategorySlugPage
