import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Filters from './components/Filters';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import AuctionComponent from './components/Auction';
import Offer from './components/Offer';

const Home = ({ searchTerm, onSearchSubmit }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({});
  const apiBaseURL = process.env.REACT_APP_API_URL;
  const [limit, setLimit] = useState(9);

  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams();
      // Append page and limit directly
      queryParams.append('page', currentPage);
      queryParams.append('limit', limit);
      // Append other filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          queryParams.append(key, value);
        }
      });
      if (searchTerm && searchTerm.trim() !== '') {
        queryParams.append('search', searchTerm.trim());
      };

      const response = await fetch(`${apiBaseURL}/api/products-all?${queryParams.toString()}`);
      console.log(`${apiBaseURL}/api/products-all?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProducts(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // useEffect(() => {
  //   fetchProducts();
  // }, [filters, currentPage]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchProducts(searchTerm);
  };
  useEffect(() => {
    fetchProducts();
  }, [searchTerm, filters, currentPage, limit]);
  // useEffect(() => {
  //   if (onSearchSubmit) {
  //     fetchProducts(searchTerm);
  //   }
  // }, [onSearchSubmit]);



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
      <Row>
        {/* Left section (1:4) */}
        <Col lg={2} className="border-right border-gray-300" style={{ maxWidth: '280px' }}>

          <Filters searchTerm={searchTerm} onApplyFilters={handleApplyFilters} />
        </Col>

        {/* Middle section (1:4) */}
        <Col lg={8} className="border-left border-right border-gray-300">
          <h2 className="text-3xl font-semibold mb-6 mt-4 text-gray-700">Our Products</h2>
          <Row className="flex flex-wrap">
            {products.map((product) => (
              <Col key={product.productId} md={6} lg={4} className="mb-3 flex">
                <Link to={`/products/${product.productId}`}>
                  <div
                    className="border p-3 rounded-lg shadow hover:shadow-lg transition duration-300 bg-white product-box flex flex-col"
                    style={{ height: '360px', width: '390px' }}
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
                    <div className="flex mt-auto items-end">
                      <p className="text-gray-600"> Rating: {product.averageRating ? `${product.averageRating}/5` : 'No ratings'} ⭐ </p>

                      <p className="text-m mt-1 tracking-tight text-gray-900 ml-auto">
                        {product.max_price !== product.discounted_price && (
                          <span className="line-through">
                            ₹ {Math.ceil(product.max_price)}
                          </span>
                        )}
                        {product.max_price !== product.discounted_price && (
                          <span className="text-m tracking-tight text-red-500 ml-2">
                            Save {(((product.max_price - product.discounted_price) / product.max_price) * 100).toFixed(2)}%
                          </span>
                        )}
                        &nbsp;  <span className="mr-4 font-semibold">
                        {Math.ceil(product.discounted_price)}
                      </span>
                      </p>
                    </div>
                  </div>

                </Link>
              </Col>
            ))}
          </Row>
          {renderPagination()}
        </Col>

        {/* Right section (1:4) */}
        <Col lg={2} className="border-left">
          <Offer />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
