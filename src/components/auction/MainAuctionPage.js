import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Pagination } from 'react-bootstrap';

import Filters from '../../pages/components/Filters';
import AuctionItem from './AuctionItem';
import AuctionAnalyticsDashboard from './AuctionAnalyticsDashboard';


const MainAuctionPage = ({ searchTerm, onSearchSubmit }) => {
  const [auctionData, setAuctionData] = useState({ auctions: [], totalItems: 0, totalPages: 0, currentPage: 1 });
  const [filters, setFilters] = useState({});
  const apiBaseURL = process.env.REACT_APP_API_URL;
  const [limit, setLimit] = useState(9);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isInLiveAuction, setIsInLiveAuction] = useState(false);

  useEffect(() => {
    const fetchAndSetAuctionAnalytics = async () => {
      // Your existing logic to fetch analytics data
      const auctionId = 'your-auction-id'; // Replace with actual auction ID
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
  }, []); // Empty dependency array ensures this runs once after initial render



  const fetchAuctions = async (appliedFilters = {}) => {
    try {
        const queryParams = new URLSearchParams({
          page: auctionData.currentPage,
          limit: limit,
          ...appliedFilters, // Include the applied filters
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
      console.log(data);
      setAuctionData({ 
        auctions: data.data, 
        totalItems: data.totalItems, 
        totalPages: data.totalPages, 
        currentPage: data.currentPage 
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching auctions:', error);
      setLoading(false);
    }
  };
  
  // useEffect(() => {
  //   fetchAuctions();
  
  //   // auctionData.auctions.forEach(auction => {
  //   //   fetch(`${apiBaseURL}/api/auctions/${auction.auctionId}/analytics`)
  //   //     .then(response => response.json())
  //   //     .then(analytics => {
  //   //       // Handle the analytics data (e.g., storing in state)
  //   //     })
  //   //     .catch(error => console.error('Error fetching auction analytics:', error));
  //   // });
  // }, [auctionData.auctions, apiBaseURL]);


  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setIsInLiveAuction(newFilters.isInLiveAuction === 'true');
    setAuctionData(prevState => ({ ...prevState, auctions: [], currentPage: 1 }));
    fetchAuctions({ ...newFilters, isInLiveAuction: newFilters.isInLiveAuction === 'true' });
  };

  useEffect(() => {
    fetchAuctions({ isInLiveAuction });
  }, [auctionData.currentPage, limit, searchTerm, isInLiveAuction]); // Add isInLiveAuction as a dependency



  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= auctionData.totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === auctionData.currentPage}
          onClick={() => setAuctionData({ ...auctionData, currentPage: number })}
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
    return <p>No ongoing auctions at the moment.</p>;
  }


  const fetchAuctionAnalytics = async (auctionId) => {
      try {
          const response = await fetch(`${apiBaseURL}/api/auctions/${auctionId}/analytics`);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const analyticsData = await response.json();
          return analyticsData;
      } catch (error) {
          console.error('Error fetching auction analytics:', error);
      }
  };

 

  return (
        <Container fluid className="p-1">
        <Row>
          {/* Other components */}
          
              <AuctionAnalyticsDashboard />
  
          {/* Other components */}
        </Row>
        <Row>
            {/* Left section for filters */}
            <Col lg={2} className="border-right border-gray-300" style={{ maxWidth: '260px' }}>
            <Filters
                searchTerm={searchTerm}
                onApplyFilters={handleApplyFilters}
                showLiveAuctionFilter={true}
                isInLiveAuction={isInLiveAuction}
                setIsInLiveAuction={setIsInLiveAuction}
                handleApplyFilters={handleApplyFilters} // Pass the function as a prop
            />
            </Col>

            {/* Middle section for auction items */}
            <Col lg={8} className="border-left border-right border-gray-300">
            <h2 className="text-3xl font-bold mb-6 mt-4 text-gray-700">Ongoing Auctions</h2>
            <Row className="flex flex-wrap">
                {auctionData.auctions.map(auction => (
                <Col key={auction.auctionId} md={6} lg={4} className="mb-3 flex">
                    <Link to={`/auctions/${auction.auctionId}`}>
                    <div
                        className="border p-3 rounded-lg shadow hover:shadow-lg transition duration-300 bg-white product-box flex flex-col"
                        style={{ height: '360px', width: '400px' }}
                    >
                        {auction.Product.ProductImage.length > 0 && (
                        <img
                            src={auction.Product.ProductImage[0].imageUrl}
                            alt={auction.Product.name}
                            className="w-full h-40 object-cover mb-2"
                            style={{ height: '180px', width: '400px' }}
                        />
                        )}
                        <h3 className="text-xl font-semibold mb-2 text-gray-700 overflow-hidden overflow-ellipsis">
                        {auction.Product.name}
                        </h3>
                        <p
                        className="text-gray-600 overflow-hidden overflow-ellipsis"
                        style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden", WebkitLineClamp: 2 }}
                        >
                        {auction.Product.description}
                        </p>
                        <div className="flex flex-row">
                        <p className="text-gray-600"> Rating: {auction.Product.averageRating ? `${auction.Product.averageRating}/5` : 'No ratings'} ⭐ </p>
                        <p className="justify-end font-semibold text-gray-600 ml-auto">Current Bid: ₹{auction.currentBid}</p>
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

           
            <Col lg={2} className="border-left">
              <div>
                <h3>Auction Analytics</h3>
                {/* Conditional rendering to check if analyticsData is not null */}
                {analyticsData ? (
                  <React.Fragment>
                    <p>Total Bids: {analyticsData.totalBids}</p>
                    <p>Highest Bid: {analyticsData.highestBid}</p>
                    <p>Participants: {analyticsData.participants}</p>
                    {/* Add more analytics details as needed */}
                  </React.Fragment>
                ) : (
                  <p>No analytics data available.</p>
                )}
              </div>
            </Col>
        </Row>
        
        </Container>
    );
    };


export default MainAuctionPage;
