import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home/Home';
import './App.css';
import { CartProvider } from './hook/useCart';
import ShoppingCart from './pages/ShoppingCart/ShoppingCart';
import GlobalStyles from './styles/global';
import ProductDetails from './pages/ProductDetails/ProductDetails';

function App() {
  return (
      <BrowserRouter >
        <CartProvider>
            <GlobalStyles />
            <Switch>
              <Route path="/" exact component={ Home } />
              <Route path="/cart" component={ ShoppingCart } />
              <Route path="/product:id" component={ ProductDetails } />
            </Switch>
            <ToastContainer autoClose={4000} />
        </CartProvider>
      </BrowserRouter>
  );
}

export default App;
