import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Filters from './Filters';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import AuctionComponent from './Auction';

const AuctionPage = ({ searchTerm, onSearchSubmit }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({});
  const apiBaseURL = process.env.REACT_APP_API_URL;
  const [limit, setLimit] = useState(9);

  const fetchAuctionProducts = async () => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', currentPage);
      queryParams.append('limit', limit);
  
      let isSearchKeyIncluded = false;
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          queryParams.append(key, value);
          if (key === 'search') isSearchKeyIncluded = true;
        }
      });
  
      if (!isSearchKeyIncluded && searchTerm && searchTerm.trim() !== '') {
        queryParams.append('search', searchTerm.trim());
      }
  
      const response = await fetch(`${apiBaseURL}/api/bid-products?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProducts(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching auction products:', error);
    }
  };

  useEffect(() => {
    fetchAuctionProducts();
  }, [searchTerm, filters, currentPage, limit]);
  
  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => setCurrentPage(number)}
          className="cursor-pointer"
        >
          {number}
        </Pagination.Item>
      );
    }

    return <Pagination className="justify-content-center my-4">{items}</Pagination>;
  };
  return (
    <Container fluid className="p-1">
      {/* ... */}
      <Row>
        <Col lg={2} className="border-right border-gray-300" style={{ maxWidth: '260px' }}>
          <Filters searchTerm={searchTerm} onApplyFilters={setFilters} />
        </Col>

        <Col lg={8} className="border-left border-right border-gray-300">
          <h2 className="text-3xl font-bold mb-6 mt-4 text-gray-700">Our Products</h2>
          <Row className="flex flex-wrap">
            {products.map((product) => (
              <Col key={product.productId} md={6} lg={4} className="mb-3 flex">
                <Link to={`/products/${product.productId}`}>
                  <div
                    className="border p-3 rounded-lg shadow hover:shadow-lg transition duration-300 bg-white product-box flex flex-col"
                    style={{ height: '360px', width: '400px' }}
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 object-cover mb-2"
                        style={{ height: '180px', width: '400px' }}
                      />
                    )}
                    <h3 className="text-xl font-semibold mb-2 text-gray-700 overflow-hidden overflow-ellipsis">
                      {product.name}
                    </h3>
                    <p
                      className="text-gray-600 overflow-hidden overflow-ellipsis"
                      style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden", WebkitLineClamp: 2 }}
                    >
                      {product.description}
                    </p>
                    <div className="flex flex-row">
                      <p className="text-gray-600"> Rating: {product.averageRating ? `${product.averageRating}/5` : 'No ratings'} ⭐ </p>
                      <p className="justify-end  font-semibold text-gray-600 ml-4">₹{product.max_price}</p>
                    </div>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
          {renderPagination()}
        </Col>

      </Row>
    </Container>
  );
};

export default AuctionPage;