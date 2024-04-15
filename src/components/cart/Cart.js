import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteItemFromCartAsync, fetchItemsByUserIdAsync, selectItems, updateCartAsync, fetchCartDetailsAsync, setAppliedCoupon, setDiscountAmount, removeAppliedCoupon } from './components/cartSlice';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import EmptyCart from './components/emptycart';
import { useCart } from '../../contexts/CartContext';

const Cart = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const totalAmount = items.reduce((amount, item) => item.productPrice * item.quantity + amount, 0);
  const totalItems = items.reduce((total, item) => item.quantity + total, 0);
  const [couponCode, setCouponCode] = useState('');
  const [discountedTotal, setDiscountedTotal] = useState(totalAmount);
  //const [appliedCoupon, setAppliedCoupon] = useState('');
  //const [discountAmount, setDiscountAmount] = useState(0);
  const appliedCoupon = useSelector((state) => state.cart.appliedCoupon);
  const discountAmount = useSelector((state) => state.cart.discountAmount);


  const apiBaseURL = process.env.REACT_APP_API_URL;
  const { fetchCartCount } = useCart();

  useEffect(() => {
    if (user) {
      const userId = user.userId;
      dispatch(fetchItemsByUserIdAsync(userId));
      dispatch(fetchCartDetailsAsync(userId));
    }
  }, [user, dispatch, fetchCartCount]);

  const applyCoupon = async () => {
    if (!couponCode) {
      alert("Please enter a coupon code");
      return;
    }
    try {
      const userId = user ? user.userId : null; // assuming user contains userId
      const response = await fetch(`${apiBaseURL}/cart/user/applyOffer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, couponCode }),
      });

      if (!response.ok) {
        throw new Error('Failed to apply coupon');
      }

      const data = await response.json();
      dispatch(setAppliedCoupon(couponCode));
      dispatch(setDiscountAmount(Number(data.discountAmount) || 0));
      setDiscountedTotal(data.finalTotal);
      alert('Coupon applied successfully');
    } catch (error) {
      console.error('Error applying coupon:', error);
      alert(error.message);
    }
  };

  const formatDiscountAmount = () => {
    return (Number(discountAmount) || 0).toFixed(0);
  };


  const removeCoupon = async () => {
    try {
      const userId = user ? user.userId : null;
      const response = await fetch(`${apiBaseURL}/cart/user/removeOffer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        throw new Error('Failed to remove coupon');
      }
      const data = await response.json();
      // Convert to number and provide a fallback
      if (response.ok) {
        dispatch(removeAppliedCoupon());
        setDiscountedTotal(data.finalTotal);
        alert('Coupon removed successfully');
      }
    } catch (error) {
      console.error('Error removing coupon:', error);
      alert(error.message);
    }
  };

  const handleQuantity = (e, item) => {
    const newQuantity = +e.target.value;
    if (newQuantity > 10) {
      alert("Maximum quantity allowed is 10");
      return;
    }
    dispatch(updateCartAsync({ ...item, quantity: newQuantity, id: item.cartItemId }));
    window.location.reload();
  };

  const handleRemove = async (itemId) => {
    await dispatch(deleteItemFromCartAsync(itemId));

    if (user) {
      dispatch(fetchItemsByUserIdAsync(user.userId));
      await fetchCartCount(user.userId);
    }
  };

  if (!items || items.length === 0) {
    return <p><EmptyCart /></p>;
  }

  return (
    <div className="container mx-auto mt-4">
      <h1 className="text-2xl text-center bg-blue-50 font-semibold text-gray-700 mb-4">Shopping Cart</h1>

      <div className="grid bg-white grid-cols-12 gap-4">
        <div className="col-span-12 sm:col-span-8">
          <div className="p-4 shadow-lg ">
            {items.map((item) => (
              <div key={item.productId} className="flex flex-col sm:flex-row items-center border-b border-gray-200 py-4">
                {/* Mobile View */}
                <div className="sm:hidden mb-4">
                  <div className="w-16 h-16 overflow-hidden">
                    {item.productImages && item.productImages[0] && (
                      <img
                        src={item.productImages[0]}
                        alt={item.productName}
                        className="w-full h-full object-cover object-center"
                      />
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900">{item.productName}</h3>
                  <p className="text-sm text-gray-500" title={item.productDescriptiom}>
                    {item.productDescriptiom.split('\n')[0]}...
                  </p>
                  <div className="flex space-x-10">
                    <div className="text-sm font-semibold">Price: ₹{Math.ceil(item.discountedPrice)}</div>
                    <div className="text-sm font-semibold">Total: ₹{Math.ceil((item.discountedPrice * item.quantity).toFixed(2))}</div>
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden sm:flex items-center ml-4">
                  <label htmlFor="quantity" className="mr-2 text-sm text-gray-700">Qty</label>
                  <select
                    onChange={(e) => handleQuantity(e, item)}
                    value={item.quantity}
                    className="border rounded p-1"
                  >
                    {[...Array(10).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>{num + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="ml-4">
                  <button
                    onClick={() => handleRemove(item.cartItemId)}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Remove
                  </button>
                </div>

                {/* Desktop View */}
                <div className="hidden sm:block ml-4">
                  <div className="w-16 h-16 overflow-hidden">
                    {item.productImages && item.productImages[0] && (
                      <img
                        src={item.productImages[0]}
                        alt={item.productName}
                        className="w-full h-full object-cover object-center"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 sm:hidden">
          <div className="bg-white p-4 shadow-lg">
            <div className="mt-2">
              {appliedCoupon ? (
                <div>
                  <p>Applied Coupon:{appliedCoupon}</p>
                  <p>Discount: ₹{formatDiscountAmount()}</p>
                  <button onClick={removeCoupon} className="text-red-500">Remove Coupon</button>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="border rounded p-2 w-full"
                    placeholder="Enter coupon code"
                  />
                  <button
                    onClick={applyCoupon}
                    className="mt-2 w-full bg-green-500 text-white rounded-md py-2 text-center font-medium hover:bg-green-600"
                  >
                    Apply Coupon
                  </button>
                </div>
              )}
            </div>
            <p className="text-base font-medium text-gray-900 mt-4">Discounted Total: ₹{Math.ceil(discountedTotal)}</p>
            <p className="text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
            <p className="mt-4 text-base font-medium text-gray-900">Total Items: {totalItems}</p>
            <p className="text-base font-medium text-gray-900">Total Amount: ₹{Math.ceil(totalAmount)}</p>
            <div className="mt-6">
              <Link
                to="/checkout"
                className="block w-full bg-indigo-400 text-white rounded-md py-2 text-center font-medium hover:bg-indigo-700"
              >
                Proceed to Checkout
              </Link>
            </div>
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>or...</p>
              <Link to="/" className="text-indigo-600 hover:text-indigo-500">
                Continue Shopping <span className="ml-1">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
        {/* Desktop View */}
        <div className="col-span-4 hidden sm:block">
          <div className="bg-white p-4 shadow-lg">
            <div className="mt-4">
              {appliedCoupon ? (
                <div>
                  <p>Applied Coupon: {appliedCoupon}</p>
                  <p>Discount: ₹{formatDiscountAmount()}</p>
                  <button onClick={removeCoupon} className="text-red-500">Remove Coupon</button>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="border rounded p-2 w-full"
                    placeholder="Enter coupon code"
                  />
                  <button
                    onClick={applyCoupon}
                    className="mt-2 w-full bg-teal-400 text-black rounded-md py-2 text-center font-medium hover:bg-teal-500"
                  >
                    Apply Coupon
                  </button>
                </div>
              )}
            </div>
            <p className="text-base font-medium text-gray-900 mt-4">Discounted Total: ₹{Math.ceil(discountedTotal)}</p>
            <p className="text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
            <p className="mt-4 text-base font-medium text-gray-900">Total Items: {totalItems}</p>
            <p className="text-base font-medium text-gray-900">Total Amount: ₹{Math.ceil(totalAmount)}</p>
            <div className="mt-6">
              <Link
                to="/checkout"
                className="block w-full bg-indigo-400 text-black rounded-md py-2 text-center font-medium hover:bg-indigo-500"
              >
                Proceed to Checkout
              </Link>
            </div>
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>or...</p>
              <Link to="/" className="text-indigo-600 hover:text-indigo-500">
                Continue Shopping <span className="ml-1">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
