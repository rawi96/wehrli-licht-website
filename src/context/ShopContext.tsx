import {
  ReactElement,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import swell, { Cart } from 'swell-js'

export type ShopContextType = {
  cart: Cart | null
  setCart: (cart: Cart) => void
  isShowCart: boolean
  setIsShowCart: (isShowCart: boolean) => void
}

export const shopContextDefaultValues: ShopContextType = {
  cart: null,
  setCart: () => {},
  isShowCart: false,
  setIsShowCart: () => {},
}

export const ShopContext = createContext<ShopContextType>(
  shopContextDefaultValues
)

async function getCartFromSwell() {
  swell.init(
    process.env.NEXT_PUBLIC_SWELL_STORE_ID || '',
    process.env.NEXT_PUBLIC_SWELL_API_KEY || ''
  )
  const cart = await swell.cart.get()
  return cart
}

export const ShopContextProvider = ({
  children,
}: {
  children: ReactNode
}): ReactElement => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isShowCart, setIsShowCart] = useState<boolean>(false)

  useEffect(() => {
    async function fetchCart() {
      const cart = await getCartFromSwell()
      setCart(cart)
    }
    fetchCart()
  }, [])

  return (
    <ShopContext.Provider
      value={{
        cart,
        setCart,
        isShowCart,
        setIsShowCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  )
}

export const useShopContext = (): ShopContextType => useContext(ShopContext)
