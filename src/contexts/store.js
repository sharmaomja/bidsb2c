import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../components/cart/components/cartSlice';
import orderReducer from '../components/order/components/orderSlice';
import wishlistReducer from '../components/wishlist/components/wishlistSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    order: orderReducer,
    wishlist: wishlistReducer,
  },
});

export default store;
