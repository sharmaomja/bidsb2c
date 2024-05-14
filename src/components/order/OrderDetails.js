import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
import { getOrdersAsync, updateOrderAsync, selectOrders } from './components/orderSlice';
import { PDFDownloadLink, PDFViewer, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import axios from 'axios'; // Assuming axios is installed
import { useMediaQuery } from 'react-responsive';
import logo from '../../assets/logo2.png';

const UserOrders = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const orders = useSelector(selectOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [returnAction, setReturnAction] = useState({});
  const [returnReason, setReturnReason] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [returnImages, setReturnImages] = useState({});
  const [ordersPerPage] = useState(3);
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
    console.log(`Cancel order with ID: ${order.orderId}`);
  };

  const handleTrackOrder = (order) => {
    console.log(`Track order with ID: ${order.orderId}`);
  };

  const formatAddress = (address) => {
    const cleanedAddress = address.replace(/"/g, "");
    const addressLines = cleanedAddress.split("\\n");
    return addressLines.join(', ');
  };

  const numberToWords = (num) => {
    const units = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const thousands = ['', 'Thousand', 'Million', 'Billion'];
    const convert = (num) => {
      if (num < 10) return units[num];
      if (num < 20) return teens[num - 10];
      if (num < 100) return tens[Math.floor(num / 10)] + ' ' + convert(num % 10);
      if (num < 1000) return units[Math.floor(num / 100)] + ' Hundred ' + convert(num % 100);
      for (let i = 0; i < thousands.length; i++) {
        if (num < 1000 ** (i + 1)) {
          return convert(Math.floor(num / (1000 ** i))) + ' ' + thousands[i] + ' ' + convert(num % (1000 ** i));
        }
      }
    };
    return convert(num);
  };

  const totalPriceInWords = (order) => numberToWords(order.totalPrice);

  const Invoice = ({ order }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image src={logo} style={styles.logo} />
            </View>
            <View style={styles.invoiceInfo}>
              <Text style={styles.text}>BidsB2C</Text>
              <Text style={styles.text}>123 Main Street</Text>
              <Text style={styles.text}>Invoice Date: <Text style={styles.bold}>{new Date(order.createdAt).toLocaleDateString()}</Text></Text>
              <Text style={styles.text}>Pune, Maharashtra</Text>
              <Text style={styles.text}>Invoice No: <Text style={styles.bold}>{order.orderId}</Text></Text>
            </View>
          </View>
          <View style={styles.shippingAddress}>
            <Text style={[styles.text, styles.bold]}>Shipping Address:</Text>
            <Text style={styles.text}>{formatAddress(order.shippingAddress)}</Text>
          </View>
          <View style={styles.lineItemsContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.heading}>Qty</Text>
              <Text style={styles.heading}>Description</Text>
              <Text style={styles.heading}>Price</Text>
              <Text style={styles.heading}>Subtotal</Text>
            </View>
            {order.OrderItems.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={[styles.text, styles.tableCell]}>{item.quantity}</Text>
                <Text style={[styles.text, styles.tableCell]}>{item.Product.name}</Text>
                <Text style={[styles.text, styles.tableCell, styles.right]}>₹ {item.Product.discounted_price}</Text>
                <Text style={[styles.text, styles.tableCell, styles.bold]}>₹ {item.quantity * item.Product.discounted_price}</Text>
              </View>
            ))}
          </View>
          <View style={styles.paymentInfoContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.heading}>Payment Method</Text>
              <Text style={styles.heading}>Item Subtotal</Text>
              <Text style={styles.heading}>Promotion Applied</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.text, styles.tableCell]}>Credit Card</Text>
              <Text style={[styles.text, styles.tableCell]}>₹ {order.totalPrice}</Text>
              <Text style={[styles.text, styles.tableCell]}>N/A</Text>
            </View>
            <View style={styles.totalPrice}>
              <Text style={[styles.text, styles.bold]}>Total Price (in words):</Text>
              <Text style={styles.text}>{totalPriceInWords(order)}</Text>
            </View>
          </View>
          <View style={styles.footer}>
            <View style={styles.footerInfo}>
              <Text style={styles.text}>bidsb2c.com</Text>
              <Text style={styles.text}>9876543210</Text>
            </View>
            <View style={styles.footerThanks}>
              <Text style={[styles.text, styles.thankYou]}>Thank you!</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );

  const styles = StyleSheet.create({
    page: {
      backgroundColor: '#ffffff',
      padding: 20,
    },
    container: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      padding: 10,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
    },
    logoContainer: {
      width: '30%',
    },
    logo: {
      height: 50,
      width: '100%',
    },
    invoiceInfo: {
      width: '65%',
    },
    bold: {
      fontWeight: 'bold',
    },
    shippingAddress: {
      marginBottom: 20,
    },
    lineItemsContainer: {
      marginBottom: 30,
      border: 1,
      borderColor: 'black',
      borderRadius: 5,
      padding: 5,
    },
    tableHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    heading: {
      fontWeight: 'bold',
      fontSize: 13,
    },
    tableRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    right: {
      textAlign: 'right',
    },
    paymentInfoContainer: {
      marginBottom: 30,
    },
    text: {
      fontSize: 10,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    footerInfo: {
      width: '50%',
    },
    footerThanks: {
      width: '50%',
      textAlign: 'right',
    },
    thankYou: {
      fontWeight: 'bold',
    },
    tableCell: {
      flex: 1,
      padding: 2,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderColor: 'black',
    },
    totalPrice: {
      marginTop: 30,
    },
  });

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
                  <PDFDownloadLink className='p-1 font-bold ' document={<Invoice order={order} />} fileName={`Invoice_Order_${order.orderId}.pdf`}>
                    {({ blob, url, loading, error }) => (loading ? 'Generating Invoice...' : 'Download Invoice ⬇️')}
                  </PDFDownloadLink>

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
                                {canCancel && order.orderStatus !== 'delivered' && (
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
          <div class="flex justify-center items-center h-screen">
            <div class="text-center">
              <p class="text-gray-600 font-bold mb-4">Loading Orders...</p>
              <p class="text-gray-600">Please wait while we retrieve your orders. This may take a moment. If you have placed orders previously, they will appear here once loaded. Thank you for your patience.</p>
            </div>
          </div>

        )}
        {/* Pagination */}
        <nav className="mt-4 mb-10 p-10">
          <ul className="flex justify-center space-x-2">
            {pageNumbers.map(number => (
              <li key={number} className="pagination-item">
                <a onClick={(e) => paginate(number, e)} href="#" className="p-2 rounded-full bg-yellow-400 text-lg text-gray-600 font-bold hover:underline">
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
