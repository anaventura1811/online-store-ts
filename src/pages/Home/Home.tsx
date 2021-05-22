import React, {useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useCart } from '../../hook/useCart';
import {ProductList} from './styles';

interface Product {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
}

// interface ProductFormatted extends Product {
//   priceFormatted: string;
// }

interface CartItemsAmount {
  [key: string]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    const newSumAmount = {...sumAmount};
    newSumAmount[product.id] = product.amount;

    return newSumAmount;
    
  }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      return new Promise(() => {
        fetch('https://api.mercadolibre.com/sites/MLB/search?category=$&q=celular')
          .then((result) => result.json())
          .then((data) => setProducts(data.results))
      })
    }
    loadProducts();
  }, []);

  function handleAddProduct(id: string) {
    addProduct(id);
  }

  return (
    <div>
      <Header />
      <ProductList>
        {products.map(product => (
          <li key={product.id}>
          <img src={product.thumbnail} alt={product.title} />
          <strong>{product.title}</strong>
          <span>
              { new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(product.price)}
          </span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(product.id)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              {cartItemsAmount[product.id] || 0}
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
        ))}
      </ProductList>
      <Footer />

    </div>
  )
}

export default Home;
