import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteItemFromCartAsync, selectItems, updateCartAsync } from '../../cart/components/cartSlice';
import { useAuth } from '../../../hooks/useAuth';
import { createOrderAsync } from '../components/orderSlice';
import AddressList from '../../Profile/components/AddressListCheckout';
import AddressForm from '../../Profile/components/AddressForm';
import axios from 'axios';
import { OrderContext } from '../../../contexts/OrderContext';


const Checkout = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, sessionId } = useAuth();
  const [items, setItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigate = useNavigate();
  const apiBaseURL = process.env.REACT_APP_API_URL;
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isLoading, setIsLoading] = useState(false);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShippingOption, setSelectedShippingOption] = useState('');
  const { setOrderDetails } = useContext(OrderContext);


  const formatAddress = (address) => {
    return `${address.addressLine1}\n${address.addressLine2}\n${address.city}, ${address.state}\n${address.country}\n${address.postalCode}`;
  };

  useEffect(() => {
    if (user && user.userId) {
      fetchAddresses(user.userId);
      fetchCartItems(user.userId);
    }
  }, [user]);

  const fetchCartItems = async (userId) => {
    try {
      const response = await axios.get(`${apiBaseURL}/api/user/${userId}/cart-products`, {
        headers: { 'Session-Id': sessionId }
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  useEffect(() => {
    const fetchShippingOptions = async () => {
      try {
        const response = await axios.get(`${apiBaseURL}/api/shipping-options`, { headers: { 'Session-Id': sessionId } });
        setShippingOptions(response.data);
      } catch (error) {
        console.error('Error fetching shipping options:', error);
      }
    };

    fetchShippingOptions();
  }, [user, dispatch, sessionId]);

  const handleShippingOptionChange = (event) => {
    setSelectedShippingOption(parseInt(event.target.value));
  };

  const fetchAddresses = async (userId) => {
    try {
      const response = await axios.get(`${apiBaseURL}/users/${userId}/addresses`, {
        headers: { 'Session-Id': sessionId },
      });
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddAddressForm(true);
  };

  const handleRemove = (itemId) => {
    dispatch(deleteItemFromCartAsync(itemId));
  };

  const toggleAddAddressForm = () => {
    setShowAddAddressForm(!showAddAddressForm);
    setEditingAddress(null);
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleOrder = async () => {
    if (isAuthenticated && selectedAddress) {
      setIsLoading(true);
      const formattedAddress = formatAddress(selectedAddress);
      const totalPrice = items.reduce((total, item) => total + (parseFloat(item.quantity) * parseFloat(item.productPrice || 0)), 0);

      const orderData = {
        userId: user.userId,
        items,
        selectedAddress: formattedAddress,
        paymentMethod,
        shippingOptionId: selectedShippingOption,
        totalPrice,
      };

      try {
        const response = await axios.post(`${apiBaseURL}/api/order/create`, orderData, {
          headers: { 'Session-Id': sessionId }
        });
        setOrderDetails({ ...response.data, paymentMethod });
        await clearCart(user.userId);
        navigate('/payment');
      } catch (error) {
        console.error('Error creating order:', error);
        alert('Failed to create order');
      } finally {
        setIsLoading(false);
      }
    } else if (!selectedAddress) {
      alert('Please select a shipping address.');
    } else {
      navigate('/login');
    }
  };

  const AddressRadioList = () => {
    return (
      <div>
        {addresses.map((address, index) => (
          <div key={index} className="border border-gray-500 bg-gray-300 rounded-md p-3">
            <label className="address-label">
              <input
                type="radio"
                name="selectedAddress"
                value={address.addressId}
                checked={selectedAddress && selectedAddress.addressId === address.addressId}
                onChange={() => handleSelectAddress(address)}
                className="mr-2"
              />
              {`${address.addressLine1}\n${address.city}, ${address.state}\n${address.country}`}
            </label>
          </div>
        ))}
      </div>
    );
  };

  const handleQuantity = async (e, item) => {
    const newQuantity = +e.target.value;
    try {
      const updatedItem = await axios.put(
        `${apiBaseURL}/api/cart-items/${item.cartItemId}`,
        { quantity: newQuantity },
        { headers: { 'Session-Id': sessionId } }
      );
      setItems((prevItems) =>
        prevItems.map((prevItem) =>
          prevItem.cartItemId === item.cartItemId
            ? { ...prevItem, quantity: updatedItem.data.quantity }
            : prevItem
        )
      );
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  };

  const clearCart = async (userId) => {
    try {
      await axios.delete(`${apiBaseURL}/api/user/${userId}/shopping-cart`, {
        headers: { 'Session-Id': sessionId }
      });
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };


  return (
    <>
    <div className="mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg" style={{ maxWidth: '1500px' }}>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <div className="mb-8 flex">
              <h2 className="text-2xl text-gray-600 font-semibold mb-4">Add a new address to place an order</h2>
              <button
                onClick={toggleAddAddressForm}
                className="bg-teal-400 text-black p-2 w-48 h-10 ml-24 rounded hover:bg-teal-500"
              >
                {showAddAddressForm ? 'Hide Form' : 'Add New Address'}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                {addresses.map((address, index) => (
                  <div key={index} className="border border-gray-500 bg-gray-200 rounded-md p-3">
                    <label className="address-label">
                      <input
                        type="radio"
                        name="selectedAddress"
                        value={address.addressId}
                        checked={selectedAddress && selectedAddress.addressId === address.addressId}
                        onChange={() => handleSelectAddress(address)}
                        className="mr-2"
                      />
                      {`${address.addressLine1}\n${address.city}, ${address.state}\n${address.country}`}
                    </label>
                  </div>
                ))}
              </div>
              {showAddAddressForm && (
                <div>
                  <AddressForm
                    userId={user.userId}
                    sessionId={sessionId}
                    setAddresses={setAddresses}
                    editingAddress={editingAddress}
                    setEditingAddress={setEditingAddress}
                    setShowAddAddressForm={setShowAddAddressForm}
                    fetchAddresses={fetchAddresses}
                  />
                </div>
              )}
            </div>
            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700">Payment Method:</label>
              <select
                onChange={handlePaymentMethodChange}
                value={paymentMethod}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="upi">UPI</option>
                <option value="card">Credit Card</option>
              </select>
            </div>

            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700">Shipping Options:</label>
              <select
                value={selectedShippingOption}
                onChange={handleShippingOptionChange}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a shipping option</option>
                {shippingOptions.map((option) => (
                  <option key={option.optionId} value={option.optionId}>
                    {option.name} - {option.deliveryTime}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-8">
              <button
                onClick={!isLoading ? handleOrder : null}
                className={`w-full bg-indigo-400 text-black font-semibold py-2 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {isLoading ? 'Processing...' : 'Place Your Order'}
              </button>
            </div>
          </div>

          <div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h2 className="text-3xl font-semibold mb-5">Your Shopping Cart</h2>
              <div className="p-4 shadow-lg ">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center border-b border-gray-200 py-4">
                    <div className="w-16 h-16 overflow-hidden">
                      {item.productImages && item.productImages[0] && (
                        <img
                          src={item.productImages[0]}
                          alt={item.productName}
                          className="w-full h-full object-cover object-center"
                        />
                      )}
                    </div>

                    <div className="ml-4 flex-1">
                      <h3 className="text-base font-medium text-gray-900">{item.productName}</h3>
                      <div className='flex space-x-10'>
                        <div className='text-sm font-semibold'>Price: ₹{Math.ceil(item.productPrice)  }</div>
                        <div className='text-sm font-semibold'>Total: ₹{Math.ceil((item.productPrice * item.quantity).toFixed(2))}</div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
