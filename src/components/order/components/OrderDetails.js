import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../../contexts/AuthContext';
import { getOrdersAsync, updateOrderAsync, selectOrders } from '../components/orderSlice';
import axios from 'axios'; // Assuming axios is installed
import { useMediaQuery } from 'react-responsive';

const UserOrders = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const orders = useSelector(selectOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [returnAction, setReturnAction] = useState({});
  const [returnReason, setReturnReason] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [returnImages, setReturnImages] = useState({});
  const [ordersPerPage] = useState(5);
  const apiBaseURL = process.env.REACT_APP_API_URL;

  const handleReturnImagesChange = (e, item) => {
    setReturnImages({
      ...returnImages,
      [item.orderItemId]: e.target.files,
    });
  };

  const paginate = (pageNumber, e) => {
    e.preventDefault();
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (user) {
      dispatch(getOrdersAsync(user.userId));
    }
  }, [user, dispatch]);

  const handleReturnReplace = (e, item) => {
    setReturnAction({ ...returnAction, [item.orderItemId]: e.target.value });
  };

  const handleReturnReasonChange = (e, item) => {
    setReturnReason({ ...returnReason, [item.orderItemId]: e.target.value });
  };

  const submitReturnReplaceRequest = async (item) => {
    // Check if a return request already exists for the item
    const returnInfo = item.Returns && item.Returns.length > 0 ? item.Returns[0] : null;

    if (returnInfo && returnInfo.status === 'requested') {
      alert(`Return/Replacement request already submitted for ${item.Product.name}`);
    } else {
      const action = returnAction[item.orderItemId];
      const reason = returnReason[item.orderItemId];
      const images = returnImages[item.orderItemId];

      if (action && reason && images) {
        try {
          const formData = new FormData();
          formData.append('orderItemId', item.orderItemId);
          formData.append('reason', reason);
          formData.append('status', 'requested');
          // Append each selected image to the formData
          Array.from(images).forEach((file, index) => {
            formData.append('returnFiles', file, `return-image-${index}.png`);
          });

          const response = await axios.post(`${apiBaseURL}/api/returns`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          alert(`Return/Replacement request submitted for ${item.Product.name}`);
          // Re-fetch orders to update the state
          dispatch(getOrdersAsync(user.userId));
        } catch (error) {
          alert('Error submitting return/replacement request');
          console.error(error);
        }
      } else {
        alert('Please select an action, provide a reason, and upload at least one image.');
      }
    }
  };


  // Filter orders based on the search term first
  const filteredOrders = orders.filter(order =>
    order.orderId && order.orderId.toString().includes(searchTerm)
  );

  // Then apply pagination to the filtered orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);


  // Calculate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredOrders.length / ordersPerPage); i++) {
    pageNumbers.push(i);
  }

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  
const handleCancelOrder = (order) => {
  // Add your logic to handle canceling the order
  console.log(`Cancel order with ID: ${order.orderId}`);
};

const handleTrackOrder = (order) => {
  // Add your logic to handle tracking the order
  console.log(`Track order with ID: ${order.orderId}`);
};

  return (
    <div className="">
      <div className="mx-auto mt-4 max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="mb-4 sm:flex items-center border rounded-full px-4 py-1 bg-indigo-50">
          <label htmlFor="searchTerm" className="mr-2 text-black">
          </label>
          <input
            type="text"
            id="searchTerm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow focus:outline-none p-2 rounded-full bg-indigo-50 text-black font-semibold placeholder-black"
            placeholder="Search by Order ID"
          />
        </div>


        {currentOrders && currentOrders.length > 0 ? (
          currentOrders.map((order) => {
            return (
              <div key={order.orderId} className="border rounded-md overflow-hidden mb-8 bg-white shadow-md">
                {/* Order Header */}
                <div className="p-1 flex flex-row bg-indigo-100 justify-between items-center">
                <h1 className="ml-2 text-xl font-bold text-gray-800">Order #: {order.orderId}</h1>
                <p className="mr-2 text-m font-bold text-gray-600">Order Status: {order.orderStatus}</p>
              </div>
              

              <div className="p-3">
              {order.OrderItems && order.OrderItems.length > 0 ? (
                order.OrderItems.map((item) => {
                  const returnInfo = item.Returns && item.Returns.length > 0 ? item.Returns[0] : null;
                  const isReturnRequested = returnInfo && returnInfo.status === 'requested';

                  const canCancel = order.orderStatus !== 'shipped';
                  const canTrack = order.orderStatus === 'shipped';
                  const canReturn = order.orderStatus === 'delivered';

                  return (
                    <div key={item.orderItemId} className={`flex mt-2 items-center border-b ${isMobile ? 'flex-col' : ''}`}>
                     <div className={`flex-shrink-0 ${isMobile ? 'mb-2' : ''}`}>
                            {item.Product.ProductImage[0] && (
                              <img
                                src={item.Product.ProductImage[0].imageUrl}
                                alt={item.Product.name}
                                className="w-16 h-16 object-cover rounded-md"
                              />
                            )}
                          </div>
                          <div className={`ml-2 flex-grow ${isMobile ? 'text-start' : ''}`}>
                            <h4 className="text-lg font-semibold">{item.Product.name}</h4>
                            <p className="text-sm text-gray-600">{item.Product.description}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            <p className="text-sm text-gray-600">Price at time of purchase: {Math.ceil(order.totalPrice)}</p>
                            {returnInfo && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-600">Return Status: {returnInfo.status}</p>
                                <p className="text-sm text-gray-600">Return Reason: {returnInfo.reason}</p>
                              </div>
                            )}
                          </div>
                          <div className={`mb-4 justify-end flex flex-col ${isMobile ? 'mt-4' : ''}`}>
                          {isReturnRequested ? (
                            <div className="text-s font-semibold border mr-12 border-gray-400 bg-gray-100 w-64 shadow-md p-2">
                              Return/Replacement request already submitted for {item.Product.name}. We'll resolve your issue soon.
                            </div>
                          ) : (
                            <>
                              {canCancel && (
                                <button
                                  onClick={() => handleCancelOrder(order)}
                                  className="mb-2 px-2 py-1 w-64 bg-red-500 text-white font-semibold rounded-md hover:bg-red-700"
                                >
                                  Cancel Order
                                </button>
                              )}
                              {canTrack && (
                                <button
                                  onClick={() => handleTrackOrder(order)}
                                  className="mb-2 px-2 py-1 w-64 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-700"
                                >
                                  Track Order
                                </button>
                              )}
                              {canReturn && (
                                <div>
                                  <select
                                    className="mb-2 block w-64 rounded-md border border-gray-300"
                                    value={returnAction[item.orderItemId] || ''}
                                    onChange={(e) => handleReturnReplace(e, item)}
                                  >
                                    <option value="" disabled>Select action</option>
                                    <option value="return">Return</option>
                                    <option value="replace">Replace</option>
                                  </select>
                                  <textarea
                                    className="mb-2 block w-64 rounded-md border border-gray-300"
                                    placeholder="Reason"
                                    value={returnReason[item.orderItemId] || ''}
                                    onChange={(e) => handleReturnReasonChange(e, item)}
                                  />
                                  <input
                                    type="file"
                                    onChange={(e) => handleReturnImagesChange(e, item)}
                                    multiple
                                    className="mb-2"
                                  />
                                  <button
                                    onClick={() => submitReturnReplaceRequest(item)}
                                    className="px-2 py-1 w-64 bg-pink-500 text-white font-semibold rounded-md hover:bg-green-700"
                                  >
                                    Submit
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-600">No items in this order</div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-gray-600">No orders found or still loading...</div>
      )}
        {/* Pagination */}
        <nav className="mt-4">
          <ul className="flex justify-center space-x-2">
            {pageNumbers.map(number => (
              <li key={number} className="pagination-item">
                <a onClick={(e) => paginate(number, e)} href="#" className="text-blue-500 hover:underline">
                  {number}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};


export default UserOrders;
