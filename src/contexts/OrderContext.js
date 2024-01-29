// OrderContext.js
import { createContext, useState } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orderDetails, setOrderDetails] = useState(null);
  
    return (
      <OrderContext.Provider value={{ orderDetails, setOrderDetails }}>
        {children}
      </OrderContext.Provider>
    );
  };