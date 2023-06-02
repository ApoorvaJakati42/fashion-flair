import React , { useReducer , createContext} from 'react' ;
import cartReducer from '../reducers/cart-reducer';

export const CartContext = createContext()

const CartProvider = CartContext.Provider

export function CartWrapper({ children}) {
    
    const storedCart = JSON.parse(typeof window !== 'undefined' ? localStorage.getItem('cart') : null)
    const [ cart , dispatchCart] = useReducer(cartReducer , storedCart || [])

    return <CartProvider value={{ cart , dispatchCart}}>
        {children}
    </CartProvider>
}