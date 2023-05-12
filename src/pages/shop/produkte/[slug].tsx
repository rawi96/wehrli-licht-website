import { Tab } from '@headlessui/react'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import swell, { Product } from 'swell-js'
import { Bestsellers } from '../../../components/Bestsellers'
import { Button } from '../../../components/Button'
import { Feedback } from '../../../components/Feedback'
import { Footer } from '../../../components/Footer'
import { Header } from '../../../components/Header'
import { PageContainer } from '../../../components/PageContainer'
import { useShopContext } from '../../../context/ShopContext'

type ProductSlugPageProps = {
  product?: Product
  bestsellers: Product[]
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const ProductSlugPage: NextPage<ProductSlugPageProps> = ({
  product,
  bestsellers,
}) => {
  console.log(product)
  const { cart, setCart, setIsShowCart } = useShopContext()

  const handleAddToCartClick = async (event: any) => {
    swell.init(
      process.env.NEXT_PUBLIC_SWELL_STORE_ID || '',
      process.env.NEXT_PUBLIC_SWELL_API_KEY || ''
    )

    const cart = await swell.cart.addItem({
      product_id: product?.id,
      quantity: 1,
    })

    setCart(cart)
  }

  return (
    <>
      <Header />
      <PageContainer>
        <div className="mx-auto max-w-2xl px-4 pb-20 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Produkte</h2>

          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
              {/* Image gallery */}
              <Tab.Group as="div" className="flex flex-col-reverse">
                {/* Image selector */}
                <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                  <Tab.List className="grid grid-cols-4 gap-6">
                    {product?.images?.map((image) => (
                      <Tab
                        key={image.id}
                        className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                      >
                        {({ selected }) => (
                          <>
                            <span className="sr-only">{product.name}</span>
                            <span className="absolute inset-0 overflow-hidden rounded-md">
                              <img
                                src={image.file?.url}
                                alt={product.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </span>
                            <span
                              className={classNames(
                                selected
                                  ? 'ring-wehrli-500'
                                  : 'ring-transparent',
                                'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2'
                              )}
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </Tab>
                    ))}
                  </Tab.List>
                </div>

                <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
                  {product?.images?.map((image) => (
                    <Tab.Panel key={image.id}>
                      <img
                        src={image.file?.url}
                        alt={product.name}
                        className="h-full w-full object-cover object-center sm:rounded-lg"
                      />
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>

              {/* Product info */}
              <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  {product?.name}
                </h1>

                <div className="mt-3">
                  <h2 className="sr-only">Product information</h2>
                  <p className="text-3xl tracking-tight text-gray-900">
                    {product?.price}
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="sr-only">Description</h3>

                  {product?.description && (
                    <div
                      className="space-y-6 text-base text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: product.description,
                      }}
                    ></div>
                  )}
                  <div className="mt-6">
                    <div className="sm:flex-col1 mt-10 flex">
                      <Button
                        text="Zum Warenkorb hinzufügen"
                        type="primary"
                        onClick={handleAddToCartClick}
                      />

                      {cart?.item_quantity && cart.item_quantity > 0 ? (
                        <Button
                          text="Warenkorb anzeigen"
                          type="quaternary"
                          onClick={() => setIsShowCart(true)}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <Link
                    className="text-base text-gray-700 underline hover:text-black"
                    href="/kontakt"
                  >
                    Besichtigungstermin vereinbaren
                  </Link>
                </div>
              </div>
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

export const getStaticProps: GetStaticProps<ProductSlugPageProps> = async ({
  params,
}) => {
  const { slug } = params || {}

  swell.init(
    process.env.NEXT_PUBLIC_SWELL_STORE_ID || '',
    process.env.NEXT_PUBLIC_SWELL_API_KEY || ''
  )

  const { results } = await swell.products.list({})

  const bestsellers = results.filter((product) =>
    product.tags?.includes('bestseller')
  )

  const currentProduct = results.find((product) => product.slug === slug)

  return {
    props: { product: currentProduct, bestsellers },
    revalidate: 60,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  swell.init(
    process.env.NEXT_PUBLIC_SWELL_STORE_ID || '',
    process.env.NEXT_PUBLIC_SWELL_API_KEY || ''
  )

  const { results } = await swell.products.list()

  return {
    paths: results.map(({ slug }) => ({ params: { slug } })),
    fallback: 'blocking',
  }
}

export default ProductSlugPage
