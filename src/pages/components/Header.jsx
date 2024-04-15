import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo2.png';
import help from '../../assets/help.png';
import cart from '../../assets/cart.png';
import login from '../../assets/login.png';
import cartd from '../../assets/cartd.png';
import order from '../../assets/order.png';
import auction from '../../assets/auction.png';
import profile from '../../assets/profile.png';
import logoutd from '../../assets/logoutd.png';
import tracking from '../../assets/tracking.png';
import returnd from '../../assets/returnd.png';
import wishlist from '../../assets/wishlist.png';
import wishlistd from '../../assets/wishlistd.png';
import { useCart } from '../../contexts/CartContext';

const Header = ({ searchTerm, setSearchTerm, onSearch, onApplyFilters }) => {
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch(e.target.value);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const location = useLocation();
    const isHomePage = location.pathname === '/bidsb2c';

    return (
        <div>
            <header className="text-white p-2 shadow-md bg-yellow-400">
                <div className="flex flex-col sm:flex-row justify-between items-center flex-wrap">
                    <div className="flex items-center space-x-6 ml-2 sm:ml-12">
                        <div className="text-2xl font-bold underline text-teal-800">
                            <Link to="/bidsb2c">
                                <img src={logo} alt="Logo" className="h-12" />
                            </Link>
                        </div>
                        {user && (
                            <>
                                <Link to="/auctions">
                                    <img src={auction} alt="Auction" className="h-12" />
                                </Link>
                            </>
                        )}
                    </div>

                    <div className={`md:w-84 h-12 p-2 rounded-lg w-full sm:w-2/5 lg:w-1/3 xl:w-1/4 mt-2 sm:mt-0 ${isHomePage ? '' : 'hidden'}`}>
                        <div className="relative flex items-center w-full">
                            <input
                                type="text"
                                placeholder="Search products"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="p-3 w-full h-8 rounded-md border border-gray-300 focus:border-blue-500 text-gray-700 sm:text-base"
                            />
                        </div>
                    </div>

                    <nav className="flex items-center space-x-6 mt-2 sm:mt-0 sm:mr-10">
                        {user && (
                            <>
                                <Link to="/wishlist" className="relative">
                                    <img src={wishlist} alt="Logo" className="h-8 mr-4" />
                                </Link>

                                <Link to="/cart" className="relative">
                                    <img src={cart} alt="Logo" className="h-8 mr-2" />
                                    {cartCount > 0 && (
                                        <span className="absolute top-4 right-0 bg-red-500 text-white rounded-full px-1 py-0">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>

                                <Link to="/help">
                                    <img src={help} alt="Help" className="h-8 mr-4" />
                                </Link>
                            </>
                        )}
                        <Dropdown className="grid place-items-center bg-gradient-to-r from-yellow-100 to-yellow-500 p-1 rounded-md">
                            <Dropdown.Toggle
                                variant="transparent"
                                id="dropdown-basic"
                                className="text-black bg-transparent border-none"
                                style={{ fontWeight: 'semibold' }}>
                                {user ? `Welcome, ${user.firstName}` : 'Sign In/Register'}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="bg-gradient-to-r from-gray-300 to-yellow-300 rounded-md border border-gray-300 shadow-inner mt-4 w-36">
                                {user ? (
                                    <>
                                        <Dropdown.Item as={Link} to="/profile" className="flex items-center px-4 py-2 text-gray-700">
                                            <img src={profile} alt="Profile" className="h-6 mr-2" />
                                            <span className="font-semibold">Account</span>
                                        </Dropdown.Item>                                        <Dropdown.Item as={Link} to="/cart" className="flex items-center px-4 py-2 text-gray-700">
                                            <div className='flex justify-start'>
                                                <img src={cartd} alt="Cart" className="h-6 mr-2" />
                                                <span className='flex items-center font-semibold'>Cart</span>
                                            </div>
                                        </Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/orders" className="flex items-center px-4 py-2 text-gray-700">
                                            <div className='flex justify-start'>
                                                <img src={order} alt="Orders" className="h-6 mr-2" />
                                                <span className='flex items-center font-semibold'>Orders</span>
                                            </div>
                                        </Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/returns" className="flex items-center px-4 py-2 text-gray-700">
                                            <div className='flex justify-start'>
                                                <img src={returnd} alt="Return" className="h-6 mr-2" />
                                                <span className='flex items-center font-semibold'>Returns</span>
                                            </div>
                                        </Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/wishlist" className="flex items-center px-4 py-2 text-gray-700">
                                            <div className='flex justify-start'>
                                                <img src={wishlistd} alt="Wishlist" className="h-6 mr-2" />
                                                <span className='flex items-center font-semibold'>Wishlist</span>
                                            </div>
                                        </Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/shippment-tracking" className="flex items-center px-4 py-2 text-gray-700">
                                            <div className='flex justify-start'>
                                                <img src={tracking} alt="Return" className="h-6 mr-2" />
                                                <span className='flex items-center font-semibold'>Track-Orders</span>
                                            </div>
                                        </Dropdown.Item>

                                        <Dropdown.Item as={Link} to="/" onClick={handleLogout} className="flex items-center px-4 py-2 text-gray-700">
                                            <div className='flex justify-start'>
                                                <img src={logoutd} alt="Logout" className="h-6 mr-2" />
                                                <span className='flex items-center font-semibold'>Logout</span>
                                            </div>
                                        </Dropdown.Item>
                                    </>
                                ) : (
                                    <Dropdown.Item as={Link} to="/auth" className="block px-2 py-1 text-gray-700">
                                        <div className='flex justify-start'>
                                            <img src={login} alt="Logout" className="h-6 w-24 mr-1" />
                                            <span className='flex items-center font-semibold'>Login/Register</span>
                                        </div>
                                    </Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </nav>
                </div>
            </header>
        </div>
    );
};

export default Header;




