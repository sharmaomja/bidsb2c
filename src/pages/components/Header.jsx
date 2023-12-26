import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';
import help from '../../assets/help.png';
import cart from '../../assets/cart.png';
import login from '../../assets/login.png';
import cartd from '../../assets/cartd.png';
import order from '../../assets/order.png';
import profile from '../../assets/profile.png';
import logoutd from '../../assets/logoutd.png';
import tracking from '../../assets/tracking.png';
import returnd from '../../assets/returnd.png';
import wishlist from '../../assets/wishlist.png';
import wishlistd from '../../assets/wishlistd.png';
// import subscription from '../../assets/subscription.png';
// import auctions from '../../assets/auctions.PNG';
// import { selectItems } from '../../components/cart/components/cartSlice';
// import { useSelector } from 'react-redux';
import { useCart } from '../../contexts/CartContext';
// import { selectWishlistItems } from '../../components/wishlist/components/wishlistSlice';

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
        navigate('/');
    };

    return (
        <header className="text-white p-3 shadow-md w-full bg-blue-900">
            <div className="flex justify-between items-center">
                <div className='flex space-x-6 ml-12'>
                    <Link to="/">
                        <img src={logo} alt="Logo" className="h-8 mr-4" />
                    </Link>

                    {user && (
                        <>

                        </>
                    )}
                </div>


                <div className="h-12 p-2 rounded-lg justify-center" style={{ width: '660px' }}>
                    <div className="relative flex items-center w-full">
                        <input
                            type="text"
                            placeholder="Search products"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="p-3 w-full h-8 rounded-md border border-gray-300 focus:border-blue-500 text-gray-700"
                        />
                    </div>


                </div>
                <nav className="flex items-center space-x-6 mr-12">
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
                    <Dropdown className='grid place-items-center bg-gradient-to-r from-gray-300 to-blue-300 p-1 rounded-md'>
                        <Dropdown.Toggle
                            variant="transparent"
                            id="dropdown-basic"
                            className="text-black bg-transparent border-none"
                            style={{ fontWeight: 'semibold' }}>
                            {user ? `Welcome, ${user.firstName}` : 'Sign In/Register'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="bg-gradient-to-r from-gray-200 to-indigo-200 rounded-md border border-gray-300 shadow-md mt-2 w-48">
                            {user ? (
                                <>
                                    <Dropdown.Item as={Link} to="/profile" className="flex items-center px-4 py-2 text-gray-700">
                                        <div className='flex justify-start'>
                                            <img src={profile} alt="Profile" className="h-6 mr-2" />
                                            <span className='flex items-center font-semibold'>Profile</span>
                                        </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/cart" className="flex items-center px-4 py-2 text-gray-700">
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
                                    <Dropdown.Item as={Link} to="/shippment-tracking" className="flex items-center px-4 py-2 text-gray-700">
                                        <div className='flex justify-start'>
                                            <img src={tracking} alt="Return" className="h-6 mr-2" />
                                            <span className='flex items-center font-semibold'>Track-Orders</span>
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

                                    <Dropdown.Item as={Link} to="/" onClick={handleLogout} className="flex items-center px-4 py-2 text-gray-700">
                                        <div className='flex justify-start'>
                                            <img src={logoutd} alt="Logout" className="h-6 mr-2" />
                                            <span className='flex items-center font-semibold'>Logout</span>
                                        </div>
                                    </Dropdown.Item>
                                </>
                            ) : (
                                <Dropdown.Item as={Link} to="/auth" className="block px-4 py-2 text-gray-700">
                                    <div className='flex justify-start'>
                                        <img src={login} alt="Logout" className="h-6 mr-2" />
                                        <span className='flex items-center font-semibold'>Login/Register</span>
                                    </div>
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </nav>
            </div>
        </header>
    );
};

export default Header;




