import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  fetchWishlistItemsByUserIdAsync,
  deleteItemFromWishlistAsync,
  selectWishlistItems,
} from './components/wishlistSlice';
import EmptyWishlist from './components/emptywishlist';

const WishList = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const items = useSelector(selectWishlistItems) || [];
  const apiBaseURL = process.env.REACT_APP_API_URL;
  const { fetchCartCount } = useCart();



  useEffect(() => {
    if (user && user.userId) {
      dispatch(fetchWishlistItemsByUserIdAsync(user.userId));
    }
  }, [user, dispatch]);


  const handleAddToCart = async (productId, wishListItemId) => {
    if (!user) {
      return;
    }
  
    try {
      let cartId;
      const cartResponse = await axios.get(`${apiBaseURL}/api/shopping-cart/${user.userId}`);
      if (cartResponse.data) {
        cartId = cartResponse.data.cartId;
      } else {
        const newCartResponse = await axios.post(`${apiBaseURL}/api/shopping-cart`, { userId: user.userId });
        cartId = newCartResponse.data.cartId;
      }
  
      await axios.post(`${apiBaseURL}/api/cart-items`, {
        cartId,
        productId,
        quantity: 1
      });
      if (user) {
        await fetchCartCount(user.userId);
      }

      handleRemove(wishListItemId); // Remove item from wishlist after adding to cart
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (!items || items.length === 0) {
    return <p><EmptyWishlist /></p>;
  }


  const handleRemove = async (wishlistItemId) => {
    if (wishlistItemId) {
      await dispatch(deleteItemFromWishlistAsync(wishlistItemId));
      dispatch(fetchWishlistItemsByUserIdAsync(user.userId)); // Refetch wishlist items
    }
  };

  const defaultImage = '/path/to/default-image.jpg'; // Replace with your default image path

  return (
    <div className="mx-auto bg-white max-w-8xl px-4 sm:px-6 lg:px-8">
      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
        <h1 className="text-3xl my-3 font-bold tracking-tight text-gray-900">Wishlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.wishListItemId} className="bg-white rounded-md overflow-hidden shadow-md">
                <Link to={`/products/${item.productId}`}>
                  <img
                    src={item.productImage || defaultImage}
                    alt={item.productName || 'Product image'}
                    className="h-48 w-full object-cover object-center"
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/products/${item.productId}`} className="text-base font-medium text-gray-900 hover:underline">
                    {item.productName}
                  </Link>
                  <p className="mt-1 text-sm text-gray-500">{item.brand || 'Brand not available'}</p>
                  <div className="mt-2 flex justify-between">
                    <p className="text-base font-semibold text-gray-900">₹{item.discounted_price}</p>
                    <div className="space-x-2">
                      <div><button
                        onClick={() => handleAddToCart(item.productId, item.wishListItemId)}
                        className="text-white bg-green-600 px-3 py-1 rounded-md hover:bg-green-700"
                      >
                        Cart
                      </button>
                        <button
                          onClick={() => handleRemove(item.wishListItemId)}
                          className="text-white mt-2 bg-red-600 ml-2 px-3 py-1 rounded-md hover:bg-red-700"
                        >
                          Remove
                        </button></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishList;
