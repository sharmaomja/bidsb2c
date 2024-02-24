import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Filters from './components/Filters';
import { Container, Row, Col, Pagination, Button } from 'react-bootstrap';
import Offer from '../components/xyz/Offer';

const Home = ({ searchTerm, onSearchSubmit }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({});
  const apiBaseURL = process.env.REACT_APP_API_URL;
  const [limit, setLimit] = useState(9);
  const [showFilters, setShowFilters] = useState(false);
  const [sortByRating, setSortByRating] = useState('desc');
  const [sortByPrice, setSortByPrice] = useState('asc');

  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', currentPage);
      queryParams.append('limit', limit);
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

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchProducts(searchTerm);
  };

  const reverseProductOrder = () => {
    setProducts([...products].reverse());
  };

  const sortProductsByPriceAscending = () => {
    const sortedProducts = [...products].sort((a, b) => a.discounted_price - b.discounted_price);
    setProducts(sortedProducts);
  };

  const sortProductsByPriceDescending = () => {
    const sortedProducts = [...products].sort((a, b) => b.discounted_price - a.discounted_price);
    setProducts(sortedProducts);
  };

  const sortProductsByRating = (order) => {
    const sortedProducts = [...products].sort((a, b) => {
      if (order === 'asc') {
        return a.averageRating - b.averageRating;
      } else {
        return b.averageRating - a.averageRating;
      }
    });
    setProducts(sortedProducts);
  };

  useEffect(() => {
    fetchProducts();
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

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const closeFilters = () => {
    setShowFilters(false);
  };

  return (
    <Container fluid className="p-1">
      <Row>
        <Col xs={12} className="text-center text-black bg-yellow-50 py-2">
          <div className="overflow-x-auto h-6 bg-yellow-100 text-md font-semibold">
            <marquee className="whitespace-nowrap" direction="right" scrollamount="8">
              Check out our latest auctions and grab amazing deals! <a href="/auctions">Click here to start bidding now!</a>
            </marquee>
          </div>
        </Col>

        {/* Left section (1:4) */}
        <Col lg={2} className="border-right border-gray-300 hidden md:block" style={{ width: "15%" }}>
          <Filters searchTerm={searchTerm} onApplyFilters={handleApplyFilters} />
        </Col>

        {/* Mobile view: Show Filters button */}
        <Col md={12} className="text-center mt-2 md:hidden">
          <button
            onClick={toggleFilters}
            className={`bg-teal-600 text-white px-4 py-2 rounded-full ${showFilters ? 'bg-teal-600' : 'hover:bg-teal-600'
              }`}
          >
            {showFilters ? 'Close Filters' : 'Show Filters'}
          </button>
        </Col>

        {/* Conditionally render Filters component for mobile view */}
        {showFilters && (
          <div
            style={{
              position: 'absolute',
              top: 166,
              left: 155,
              right: 20,
              bottom: 0,
              zIndex: 999,
              backdropFilter: 'blur(30px)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
            className='bg-teal-600'
          >
            <Col lg={2} className="border-right border-gray-300 md:hidden">
              <Filters searchTerm={searchTerm} onApplyFilters={handleApplyFilters} />
              <div className="text-center mt-2">
                <button
                  onClick={closeFilters}
                  className="bg-teal-500 text-white px-4 py-2 mr-48 rounded-full hover:bg-teal-600"
                >
                  Close Filters
                </button>
              </div>
            </Col>
          </div>
        )}

        {/* Middle section (1:4) */}
        <Col lg={8} className="border-left border-right border-gray-300" md={12} style={{ width: "70%" }}>
          <div className="d-flex justify-content-md-end justify-content-center">
            <div className="space-x-3 mt-3">
            <Button variant="outline-primary" className="p-1 bg-yellow-100 font-semibold shadow-md text-gray-700 border border-yellow-400 hover:bg-yellow-600" onClick={reverseProductOrder}>What's New</Button>
              <Button variant="outline-primary" className="p-1 bg-yellow-100 font-semibold shadow-md text-gray-700 border border-yellow-400 hover:bg-yellow-600" onClick={() => sortProductsByRating('desc')}>Customer Rating</Button>
              <Button variant="outline-primary" className="p-1 bg-yellow-100 font-semibold shadow-md text-gray-700 border border-yellow-400 hover:bg-yellow-600" onClick={sortProductsByPriceAscending}>Sort by Price: Low to High</Button>
              <Button variant="outline-primary" className="p-1 bg-yellow-100 font-semibold shadow-md text-gray-700 border border-yellow-400 hover:bg-yellow-600" onClick={sortProductsByPriceDescending}>Sort by Price: High to Low</Button>
            </div>
          </div>
          <Row className="flex flex-wrap mt-6">
            {products.map((product) => (
              <Col key={product.productId} md={6} lg={3} className="mb-3 flex">
                <Link to={`/products/${product.productId}`}>
                  <div
                    className="ml-16 md:ml-0 border p-2 rounded-lg shadow hover:shadow-lg transition duration-300 bg-white product-box flex flex-col"
                    style={{ height: '420px', width: '100%' }}
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover mb-2"
                        style={{ height: '280px', width: '100%' }}
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
                      <p className="text-gray-600 font-semibold">{product.averageRating ? `${product.averageRating}/5` : 'No ratings'} ⭐ </p>

                      <p className="text-m mt-1 tracking-tight text-gray-900 ml-auto">
                        {product.max_price !== product.discounted_price && (
                          <span className="line-through">
                            ₹ {Math.ceil(product.max_price)}
                          </span>
                        )}
                        <span className="font-semibold ml-1">
                          {Math.ceil(product.discounted_price)}
                        </span>
                        {product.max_price !== product.discounted_price && (
                          <span className="text-m font-semibold tracking-tight text-red-500 ml-1">
                            {(((product.max_price - product.discounted_price) / product.max_price) * 100).toFixed(2)}% off
                          </span>
                        )}

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
        <Col lg={2} className="border-left" md={12}>
          <Offer />
        </Col>
      </Row>

    </Container>
  );
};

export default Home;

