import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  BarController
} from 'chart.js';

import Home from './pages/Home';
import Returns from './components/order/components/Returns';
import Checkout from './components/order/components/Checkout';
import Cart from './components/cart/Cart';
import Header from './pages/components/Header';
import Profile from './components/Profile/Profile';
import AuthForm from './components/Profile/components/AuthForm';
import ProductDetails from './components/Product/ProductDetails';
import Forgetpassword from './components/Profile/components/Forget-password';
import Payment from './components/order/components/PaymentPage'
import OrderSuccess from './components/order/components/OrderSuccess'
import 'bootstrap/dist/css/bootstrap.min.css';
import WishList from './components/wishlist/Wishlist';
import UserOrders from './components/order/components/OrderDetails';
// Import Redux components and hooks
import { Provider } from 'react-redux';
import store from './contexts/store';
import { selectItems as selectCart } from './components/cart/components/cartSlice';
import { selectWishlistItems as selectWishlist } from './components/wishlist/components/wishlistSlice';
import { OrderProvider } from './contexts/OrderContext';
import AuctionsPage from './components/auction/MainAuctionPage';
import EmptyCart from './components/cart/components/emptycart';
import { CartProvider } from './contexts/CartContext';
import ShipmentTrackingPage from './components/order/components/Shippment-tracking';
import Help from './pages/components/Help';
import EmptyWishlist from './components/wishlist/components/emptywishlist';
import AuctionProductDetails from './components/auction/AuctionProductdetails';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  BarController
);
const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const onSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  return (
    <AuthProvider>
      <OrderProvider>
        {/* Wrap your entire application with the Redux Provider */}
        <Provider store={store}>
          <CartProvider>
            <Router>
              <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={onSearch} />
              {/*<Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={onSearch} />*/}
              <Routes>
                <Route path="/" element={<Home searchTerm={searchTerm} onSearch={onSearch} />} />
                <Route path="/bidsb2c" element={<Home searchTerm={searchTerm} onSearch={onSearch} />} />
                <Route path="/auth" element={<AuthForm />} />
                <Route path="/help" element={<Help />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/products/:productId" element={<ProductDetails />} />

                {/* Pass Redux state to the Cart component */}
                <Route path="/cart" element={<Cart cartSelector={selectCart} />} />

                {/* Pass Redux state to the Wishlist component */}
                <Route path="/wishlist" element={<WishList wishlistSelector={selectWishlist} />} />

                {/* Pass Redux state to the UserOrders component */}
                <Route path="/orders" element={<UserOrders />} />
                <Route path="/auctions" element={<AuctionsPage />} />
                <Route path="/auction-products/:productId/:auctionId" element={<AuctionProductDetails />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/empty-cart" element={<EmptyCart />} />
                <Route path="/empty-wishlist" element={<EmptyWishlist />} />
                <Route path="/forget-password" element={<Forgetpassword />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/shippment-tracking" element={<ShipmentTrackingPage />} />
              </Routes>
            </Router>
          </CartProvider>

        </Provider>
      </OrderProvider>
    </AuthProvider>
  );
};

export default App;
