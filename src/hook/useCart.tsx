import { createContext, ReactNode, useContext, useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Product } from '../types';
import * as api from '../services/api';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: string;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: string) => Promise<void>;
  removeProduct: (productId: string) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps) : JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {

    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  // atualiza os valores no localStorage em toda atualização do carrinho
  // com o useRef e o useEffect
  const prevCartRef = useRef<Product[]>();
    useEffect(() => {
      prevCartRef.current = cart;
    })
    const cartPreviousValue = prevCartRef.current ?? cart;

    useEffect(() => {
      if (cartPreviousValue !== cart) {
        localStorage.setItem('@RocketStore:cart', JSON.stringify(cart))
      }
    }, [cart, cartPreviousValue])

    const addProduct = async (productId: string) => {

      try {
        const updatedCart = [...cart]; // para não alterar o array original
        const productExists = updatedCart.find(product => product.id === productId);
        const item = await api.getProductById(productId);
        const stock = await item.available_quantity;
        const currentAmount = productExists ? productExists.amount : 0; // quantidade do produto no carrinho;
  
        const amount = currentAmount + 1; // quantidade desejada
  
        if (amount > stock) {
          toast.error('Quantidade solicitada fora de estoque');
          return;
        }
  
        if (productExists) {
          productExists.amount = amount; // atualiza automaticamente o updated cart, atualiza quantidade do produto
  
        } else {
          const product = await api.getProductById(productId); // se for novo produto, atualiza
          const newProduct = {
            ...product,
            amount: 1, // primeira vez que tá sendo adicionado ao carrinho
          }
          updatedCart.push(newProduct);
      } 
      setCart(updatedCart); // pra perpetuar as alterações no estado do carrinho
      // localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart)); // salva no localStorage
      } catch {
        toast.error('Erro na adição do produto');
      }
    }
  
    const removeProduct = (productId: string) => {
      try {
       const updatedCart = [...cart];
         const newCart = updatedCart.filter(product => product.id !== productId );
         setCart(newCart);
      } catch {
        toast.error('Erro na remoção do produto');
      }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
      try {
        if (amount <= 0) {
          return;
        }

        const item = await api.getProductById(productId);
        const stock = await item.available_quantity;

        if (amount > stock) {
          toast.error('Quantidade solicitada fora de estoque');
          return;
        }

        const updatedCart = [...cart];
        const productExists = updatedCart.find(product => product.id === productId);

        if (productExists) {
          productExists.amount = amount;
          setCart(updatedCart);
          
        } else {
          throw Error();
        }

      } catch {
        toast.error('Erro na alteração de quantidade do produto');
      }
    };

    return (
      <CartContext.Provider
        value={{ cart, addProduct, removeProduct, updateProductAmount }}
      >
        {children}
      </CartContext.Provider>
    );

}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}