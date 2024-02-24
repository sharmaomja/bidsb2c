import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import Countdown from 'react-countdown';
import axios from 'axios';

const MainAuctionPage = ({ searchTerm, onSearchSubmit }) => {
  const [auctionData, setAuctionData] = useState({ auctions: [], totalItems: 0, totalPages: 0, currentPage: 1 });
  const [previousAuctionData, setPreviousAuctionData] = useState({ auctions: [], totalItems: 0, totalPages: 0, currentPage: 1 });
  const [filters, setFilters] = useState({});
  const apiBaseURL = process.env.REACT_APP_API_URL;
  const [limit, setLimit] = useState(6);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isInLiveAuction, setIsInLiveAuction] = useState(false);

  useEffect(() => {
    const fetchAndSetAuctionAnalytics = async () => {
      const auctionId = 'your-auction-id';
      try {
        const response = await fetch(`/api/auctions/${auctionId}/analytics`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching auction analytics:', error);
      }
    };

    fetchAndSetAuctionAnalytics();
  }, []);

  const fetchOngoingAuctions = async (appliedFilters = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page: auctionData.currentPage,
        limit: limit,
        ...appliedFilters,
      });
      if (searchTerm && searchTerm.trim() !== '') {
        queryParams.set('search', searchTerm.trim());
      }
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          queryParams.set(key, value);
        }
      });
      if (isInLiveAuction) {
        queryParams.set('isInLiveAuction', 'true');
      }
      const response = await fetch(`${apiBaseURL}/api/auctions/ongoing-auctions/view?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAuctionData({
        auctions: data.data,
        totalItems: data.totalItems,
        totalPages: data.totalPages,
        currentPage: data.currentPage
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ongoing auctions:', error);
      setLoading(false);
    }
  };

  const fetchPreviousAuctions = async () => {
    try {
      const response = await axios.get(`${apiBaseURL}/api/auctions`);
      const data = response.data;
      console.log(response.data)
      // Fetch bids for each auction and extract top bid
      const previousAuctions = await Promise.all(
        data.map(async (auction) => {
          const bidResponse = await axios.get(`${apiBaseURL}/api/auctions/${auction.auctionId}/bids`);
          const bids = bidResponse.data;
          // Extract highest bid amount
          const highestBidAmount = bids.length > 0 ? Math.max(...bids.map(bid => parseFloat(bid.bidAmount))) : null;
          return { ...auction, highestBidAmount };
        })
      );
      setPreviousAuctionData({
        auctions: previousAuctions,
        totalItems: previousAuctions.length,
        totalPages: 1,
        currentPage: 1
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching previous auctions:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOngoingAuctions({ isInLiveAuction });
  }, [auctionData.currentPage, limit, searchTerm, isInLiveAuction]);

  useEffect(() => {
    fetchPreviousAuctions({ isInLiveAuction });
  }, [previousAuctionData.currentPage, limit, searchTerm, isInLiveAuction]);

  const renderPagination = (type) => {
    let data;
    if (type === 'previous') {
      data = previousAuctionData;
    } else {
      data = auctionData;
    }
    let items = [];
    for (let number = 1; number <= data.totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === data.currentPage}
          onClick={() => {
            if (type === 'previous') {
              setPreviousAuctionData({ ...previousAuctionData, currentPage: number })
            } else {
              setAuctionData({ ...auctionData, currentPage: number })
            }
          }}
          className="cursor-pointer"
        >
          {number}
        </Pagination.Item>
      );
    }
    return <Pagination className="justify-content-center my-4">{items}</Pagination>;
  };

  if (loading) {
    return <p>Loading auctions...</p>;
  }

  if (!Array.isArray(auctionData.auctions) || auctionData.auctions.length === 0) {
    return (
      <div className='flex flex-col items-center mt-36'>
        <p className='font-semibold mb-4 underline'>No ongoing auctions at the moment.</p>
        <Link to="/bidsb2c">
          <button className="btn p-4 bg-yellow-400">Continue Shopping on bidsb2c</button>
        </Link>
      </div>
    );
  }

  return (
    <Container fluid className="p-1">
      <Row className="justify-content-center ml-10 ml-md-2">
        <Col lg={10} className="border-right border-gray-300">
          <h2 className="text-2xl font-bold mb-4 mt-2 text-yellow-700 text-center">Ongoing Auctions</h2>
          <Row className="flex flex-wrap md:mr-0 mr-4">
            {auctionData.auctions.map(auction => (
              <Col key={auction.auctionId} md={6} lg={2} className="mb-3 flex">
                <Link to={`/auction-products/${auction.Product.productId}/${auction.auctionId}`}>
                  <div
                    className="border p-2 rounded-lg shadow hover:shadow-lg transition duration-300 bg-white product-box flex flex-col"
                    style={{ height: '100%', width: '100%' }}
                  >
                    {auction.Product.ProductImage.length > 0 && (
                      <img
                        src={auction.Product.ProductImage[0].imageUrl}
                        alt={auction.Product.name}
                        className="w-full h-full object-cover mb-1 rounded-t-lg"
                        style={{ height: '280px', width: '100%' }}
                      />
                    )}
                    <h3 className="text-lg font-semibold text-gray-700 overflow-hidden overflow-ellipsis" style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden", WebkitLineClamp: 1 }}>
                      {auction.Product.name}
                    </h3>
                    <p
                      className="text-gray-600 overflow-hidden overflow-ellipsis"
                      style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden", WebkitLineClamp: 1 }}
                    >
                      {auction.Product.description}
                    </p>
                    <div className="flex flex-col justify-between text-sm text-gray-600">
                      <p className="text-green-600 font-semibold mt-0">Starts: {new Date(auction.startTime).toLocaleString()}</p>
                      <p className="text-red-500 font-bold mt-0">Ends In : &nbsp;
                        <Countdown
                          date={new Date(auction.endTime)}
                          renderer={({ days, hours, minutes, seconds, completed }) => {
                            if (completed) {
                              return <span className="text-yellow-600">Auction Ended</span>;
                            } else {
                              return (
                                <span className="text-gray-600">
                                  {days}d {hours}h {minutes}m {seconds}s
                                </span>
                              );
                            }
                          }}
                        />
                      </p>
                    </div>
                    {auction.isInLiveAuction && (
                      <div>
                        <Link to={`/live-stream/${auction.auctionId}`}>Watch Live Stream</Link>
                      </div>
                    )}
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
          {renderPagination()}
        </Col>

        <Container fluid className="p-1">
          <Row className="justify-content-center ml-md-2">
            <Col lg={10}>
              <h2 className="text-2xl font-bold mb-2 text-yellow-700 text-center">Previous Auctions</h2>
              {previousAuctionData.auctions
                .filter(auction => new Date(auction.endTime) < new Date() && auction.highestBidAmount) // Filter out auctions with no bids
                .reduce((rows, auction, index) => {
                  if (index % 4 === 0) {
                    rows.push([]);
                  }
                  rows[rows.length - 1].push(auction);
                  return rows;
                }, [])
                .map((row, rowIndex) => (
                  <Row key={rowIndex} className="md:mr-0 mr-12">
                    {row.map(auction => (
                      <Col key={auction.auctionId} md={9} lg={3} className="mb-2 flex">
                        <Link to={`/auction-products/${auction.Product.productId}/${auction.auctionId}`}>
                          <div
                            className="border p-2 rounded-lg shadow hover:shadow-lg transition duration-300 bg-white product-box flex flex-col"
                            style={{ height: '100%', width: '100%' }}
                          >
                            <div>
                              <p className='text-yellow-900 font-bold text-md'>The highest bid amount is: {auction.highestBidAmount.toFixed(2)}</p>
                            </div>
                            {auction.Product.ProductImage && auction.Product.ProductImage.length > 0 && (
                              <img
                                src={auction.Product.ProductImage[0].imageUrl}
                                alt={auction.Product.name}
                                className="w-full h-full object-cover mb-1 rounded-t-lg"
                                style={{ height: '280px', width: '100%' }}
                              />
                            )}
                            <h3 className="text-lg font-semibold text-gray-700 overflow-hidden overflow-ellipsis">
                              {auction.Product.name}
                            </h3>
                            <p
                              className="text-gray-600 overflow-hidden overflow-ellipsis"
                              style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden", WebkitLineClamp: 1 }}
                            >
                              {auction.Product.description}
                            </p>
                            <div className="flex flex-col justify-between text-sm text-gray-600">
                              <p className="text-green-600 font-semibold mt-0">Start Time: {new Date(auction.startTime).toLocaleString()}</p>
                              <p className="text-red-500 font-bold mt-0">Bid Ended : &nbsp;
                                <span className="text-red-500">
                                  {new Date(auction.endTime).toLocaleString()}
                                </span>
                              </p>
                            </div>
                          </div>
                        </Link>
                      </Col>
                    ))}
                  </Row>
                ))
              }
            </Col>
          </Row>
        </Container>
      </Row>
    </Container>
  );
};

export default MainAuctionPage;

