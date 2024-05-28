import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import store from './contexts/store';
import { Provider } from 'react-redux';
import Cart from './components/cart/Cart';
import Help from './components/home/components/Help';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/home/components/Header';
import Profile from './components/Profile/Profile';
import WishList from './components/wishlist/Wishlist';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import UserOrders from './components/order/OrderDetails';
import Returns from './components/order/components/Returns';
import Checkout from './components/order/components/Checkout';
import EmptyCart from './components/cart/components/emptycart';
import AuthForm from './components/Profile/components/AuthForm';
import Payment from './components/order/components/PaymentPage';
import AuctionsPage from './components/auction/MainAuctionPage';
import ProductDetails from './components/Product/ProductDetails';
import OrderSuccess from './components/order/components/OrderSuccess';
import EmptyWishlist from './components/wishlist/components/emptywishlist';
import Forgetpassword from './components/Profile/components/Forget-password';
import AuctionProductDetails from './components/auction/AuctionProductdetails';
import { selectItems as selectCart } from './components/cart/components/cartSlice';
import ShipmentTrackingPage from './components/order/components/Shippment-tracking';
import { selectWishlistItems as selectWishlist } from './components/wishlist/components/wishlistSlice';
import Policies from './components/policies/Policies';
import RefundPolicies from './components/policies/components/refund_policies';
import PrivacyPolicies from './components/policies/components/privacy_policies';
import ShippingPolicies from './components/policies/components/shipping_policies';
import TermsandCondidtion from './components/policies/components/termsandcondition';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, LineController, BarController } from 'chart.js';
import Footer from './components/home/components/Footer';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, LineController, BarController);

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const onSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  return (
    <AuthProvider>
      <OrderProvider>
        <Provider store={store}>
          <CartProvider>
            <Router>
              <div className="flex flex-col min-h-screen">
                <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={onSearch} />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home searchTerm={searchTerm} onSearch={onSearch} />} />
                    <Route path="/bidsb2c" element={<Home searchTerm={searchTerm} onSearch={onSearch} />} />
                    <Route path="/auth" element={<AuthForm />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/products/:productId" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart cartSelector={selectCart} />} />
                    <Route path="/wishlist" element={<WishList wishlistSelector={selectWishlist} />} />
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
                    <Route path="/policies" element={<Policies />} />
                    <Route path="/t&c" element={<TermsandCondidtion />} />
                    <Route path="/refund_policy" element={<RefundPolicies />} />
                    <Route path="/privacy_policy" element={<PrivacyPolicies />} />
                    <Route path="/shipping_policy" element={<ShippingPolicies />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </CartProvider>
        </Provider>
      </OrderProvider>
    </AuthProvider>
  );
};

export default App;
