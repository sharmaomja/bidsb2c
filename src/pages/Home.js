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


  const extractImageId = url => {
    const match = url.match(/\/d\/([^/]+)\//);
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}`;
    } else {
      console.error('Invalid Google Drive image URL:', url);
      return url;
    }
  };

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

      // Extract image URLs using extractImageId function
      const productsWithImages = data.data.map(product => ({
        ...product,
        image: extractImageId(product.image)
      }));

      setProducts(productsWithImages);
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

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (action) => {
    setIsOpen(false);
    action();
  };

  return (
    <Container fluid className="p-1">
      <div className="overflow-x-auto h-6 mt-2 bg-yellow-100 text-md font-semibold">
        <marquee className="whitespace-nowrap" direction="right" scrollamount="8">
          Check out our latest auctions and grab amazing deals! <a href="/auctions">Click here to start bidding now!</a>
        </marquee>
      </div>
      <Row>
      {/* Left section (1:4) */}
      <Col md={4} lg={2} className="border-right border-gray-300 hidden md:block">
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
        <Col md={12} className="text-center mt-2 md:hidden">
          <Filters searchTerm={searchTerm} onApplyFilters={handleApplyFilters} />
          <div className="text-center mt-2">
            <button
              onClick={closeFilters}
              className="bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600"
            >
              Close Filters
            </button>
          </div>
        </Col>
      )}
    
      {/* Middle section (1:4) */}
      <Col md={8} lg={9} className="border-left border-right border-gray-300">
        <div className="d-flex justify-content-md-end justify-content-center mt-3">
          <div className="space-x-3 relative">
            <button
              className="p-1 w-56 bg-yellow-200 font-semibold shadow-md rounded-lg text-gray-700 border border-yellow-400 hover:bg-yellow-400"
              onClick={toggleDropdown}
            >
              Sorting Options
            </button>
            {isOpen && (
              <div className="absolute top-full left-0 mt-2 bg-yellow-200 border border-gray-300 shadow-md">
                <button
                  className="block w-full text-left p-2 hover:bg-gray-100"
                  onClick={() => handleItemClick(reverseProductOrder)}
                >
                  What's New
                </button>
                <button
                  className="block w-full text-left p-2 hover:bg-gray-100"
                  onClick={() => handleItemClick(() => sortProductsByRating('desc'))}
                >
                  Customer Rating
                </button>
                <button
                  className="block w-full text-left p-2 hover:bg-gray-100"
                  onClick={() => handleItemClick(sortProductsByPriceAscending)}
                >
                  Sort by Price: Low to High
                </button>
                <button
                  className="block w-full text-left p-2 hover:bg-gray-100"
                  onClick={() => handleItemClick(sortProductsByPriceDescending)}
                >
                  Sort by Price: High to Low
                </button>
              </div>
            )}
          </div>
        </div>
        <Row className="flex flex-wrap mt-6">
          {products.map((product) => (
            <Col key={product.productId} md={6} lg={3} className="mb-3">
              <Link to={`/products/${product.productId}`}>
                <div className="border p-2 rounded-lg shadow hover:shadow-lg transition duration-300 bg-white product-box flex flex-col" style={{
                  height: '100%', 
                  width: '100%',
                  '@media (min-width: 992px)': {  // Media query for laptop screens (md breakpoint)
                    height: 'auto',
                    width: 'auto'
                  }
                }}>
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover mb-2"
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
    </Row>
    
    </Container>
  );
};

export default Home;