
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Adjust the import path as needed

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCartCount(user.userId);
    }
  }, [user]);

  const fetchCartCount = async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}/cart-products`);
      if (!response.ok) {
        if (response.status === 404) {
          // If the API returns a 404, it means there are no items in the cart.
          setCartCount(0);
        } else {
          // Handle other types of errors.
          const errorData = await response.text();
          throw new Error(errorData || 'Error fetching cart count');
        }
      } else {
        const data = await response.json();
        setCartCount(data.length); // Assuming data is the array of cart items
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
