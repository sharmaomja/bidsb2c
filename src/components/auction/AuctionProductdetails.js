import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useAuth } from '../../hooks/useAuth';
import {useParams } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';

const AuctionProductDetails = () => {
    const { user } = useAuth();
    const { productId, auctionId } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [bidAmount, setBidAmount] = useState('');
    const [paymentType, setPaymentType] = useState('direct');
    const [bidSuccess, setBidSuccess] = useState(false);
    const [bids, setBids] = useState([]);
    const [userData, setUserData] = useState(null);

    const apiBaseURL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/api/products/${productId}`);
                if (response.data) {
                    const combinedMedia = [
                        ...response.data.images.map(image => ({ type: 'image', url: image })),
                        ...response.data.videos.map(video => ({ type: 'video', url: video.videoUrl })),
                    ];
                    setProduct({ ...response.data, combinedMedia });
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        if (productId) {
            fetchProductDetails();
        }
    }, [productId, apiBaseURL]);

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/users/${user.userId}`);
                if (response.data) {
                    setUserData(response.data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (user.userId) {
            fetchUserData();
        }
    }, [user.userId, apiBaseURL]);

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/api/auctions/${auctionId}/bids`);
                if (response.data) {
                    console.log('Fetched bids:', response.data);
                    setBids(response.data);
                }
            } catch (error) {
                console.error('Error fetching bids:', error);
            }
        };

        if (auctionId) {
            fetchBids();
        }
    }, [auctionId, apiBaseURL]);


    const handleBidSubmit = async (e) => {
        e.preventDefault();
        try {
            const requestData = {
                auctionId: auctionId,
                userId: user.userId,
                bidAmount: parseFloat(bidAmount),
                coinsUsed: paymentType === 'coins' ? 10 : 0,
                payment_type: paymentType
            };
            const response = await axios.post(`${apiBaseURL}/api/bids`, requestData);
            // Reset form fields
            setBidAmount('');
            setPaymentType('direct');
            setBidSuccess(true); // Set bid success state variable

            // Hide bid success message after 3 seconds
            setTimeout(() => {
                setBidSuccess(false);
            }, 3000);

            // Refresh the page after successful bid submission
            window.location.reload();
        } catch (error) {
            console.error('Error submitting bid:', error);
        }
    };
    
    const openModal = (index) => {
        setSelectedImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedImageIndex(null);
        setIsModalOpen(false);
    };

    if (!product) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="bg-white flex flex-col min-h-screen">
            <div className="flex flex-col mt-3">
                <div className="overflow-x-auto h-8 bg-yellow-100 text-md font-semibold">
                    <marquee className="whitespace-nowrap" direction="right" scrollamount="20">
                        {bids.map((bid, index) => (
                            <span key={index} className="text-gray-800 mr-4">{`${userData.firstName} ${userData.lastName} - ₹ ${bid.bidAmount}`}</span>
                        ))}
                    </marquee>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Product Image Modal"
                style={{
                    content: {
                        width: '35%',
                        height: '70%',
                        margin: '0 auto',
                        overflow: 'hidden',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                }}
            >
                {product && selectedImageIndex !== null && (
                    <img
                        src={product.combinedMedia[selectedImageIndex].url}
                        alt={`Product media ${selectedImageIndex + 1}`}
                        className=" w-full h-full"
                    />
                )}
                <button className='bg-red-500 w-20 text-white font-bold' onClick={closeModal}>Close</button>
            </Modal>

            <div className='flex flex-col md:flex-row md:justify-center mt-3 md:mt-0 md:ml-4 md:mr-12'>
                <div className='flex flex-col md:flex-row md:justify-center mt-4 md:mt-0 md:ml-12 md:mr-12'>
                    <div className="flex-1 md:min-w-screen md:flex-col" style={{ width: "800px", height: "740px" }}>
                        <div className='flex-1 md:h-72'>
                            <Carousel>
                                {product &&
                                    product.combinedMedia &&
                                    product.combinedMedia.reduce((acc, media, index) => {
                                        if (index % 6 === 0) {
                                            acc.push([]);
                                        }
                                        acc[acc.length - 1].push(media);
                                        return acc;
                                    }, []).map((mediaGroup, groupIndex) => (
                                        <Carousel.Item key={groupIndex}>
                                            {/* Use a grid for desktop view */}
                                            <div className="hidden md:grid grid-cols-4 lg:grid-cols-3 gap-2">
                                                {mediaGroup.map((media, index) => {
                                                    if (media.type === 'image') {
                                                        return (
                                                            <img
                                                                key={index}
                                                                src={media.url}
                                                                alt={`Product media ${groupIndex * 3 + index + 1}`}
                                                                className="object-cover cursor-pointer"
                                                                style={{ width: "350px", height: "350px" }}
                                                                onClick={() => openModal(groupIndex * 3 + index)}
                                                            />
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                            {/* Use a 2x2 grid for mobile view */}
                                            <div className="md:hidden grid grid-cols-1 sm:grid-cols-1 gap-2">
                                                {mediaGroup.map((media, index) => {
                                                    if (media.type === 'image' && index < 1) {
                                                        return (
                                                            <img
                                                                key={index}
                                                                src={media.url}
                                                                alt={`Product media ${groupIndex * 2 + index + 1}`}
                                                                className="ml-4 w-full h-full sm:h-64 object-cover cursor-pointer"
                                                                style={{ width: "460px" }}
                                                                onClick={() => openModal(groupIndex * 2 + index)}
                                                            />
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                        </Carousel.Item>
                                    ))}
                            </Carousel>
                        </div>
                    </div>
                </div>

                {/* Product info */}
                <div className='flex-1 mt-2  md:ml-0'>
                    <div className="max-w-xl px-4 pb-4 sm:px-6 ">
                        <div className="lg:col-span-1 lg:pr-2 ">
                            <h1 className="text-2xl mt-2 font-bold tracking-tight text-gray-700 sm:text-3xl">{product.name}</h1>
                            <h1 className="text-xl font-semibold mt-2 tracking-tight text-gray-900 sm:text-2xl">{product.header}</h1>
                        </div>
                        <div className="py-4 lg:col-span-2 lg:col-start-1 lg:pb-16 lg:pr-8 lg:pt-6">
                            <div>
                                <h3 className="sr-only">Description</h3>
                                <div className="space-y-3 mt-0">
                                    <p className="text-base font-bold text-gray-900">{product.category}</p>
                                    <p className="text-base text-gray-900">{product.short_description}</p>
                                    <p className="text-base text-gray-900">
                                        {showMore ? product.description : `${product.description.slice(0, 400)}...`}
                                    </p>
                                    {product.description.length > 500 && (
                                        <button
                                            onClick={toggleShowMore}
                                            className="text-indigo-500 underline focus:outline-none"
                                        >
                                            {showMore ? 'See less' : 'See more'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <h2 className="">Product Attributes</h2>
                            <div className="mt-2">
                                {product.ProductAttributes && product.ProductAttributes.map((attribute, index) => (
                                    <div key={index} className="flex items-center">
                                        <span className="font-semibold">{attribute.name}:</span>
                                        <span className="ml-2">{attribute.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* biding */}
                        <div className="max-w-2xl px-1 pb-2 sm:px-6 ">
                            <form onSubmit={handleBidSubmit} className="mt-6">
                                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                                    <div className="sm:col-span-2 flex flex-col">
                                        <label htmlFor="bidAmount" className="text-sm font-medium text-gray-700 mb-1">
                                            Bid Amount
                                        </label>
                                        <div className="flex items-center">
                                            <div className="relative w-full">
                                                <input
                                                    type="number"
                                                    name="bidAmount"
                                                    id="bidAmount"
                                                    value={bidAmount}
                                                    onChange={(e) => setBidAmount(e.target.value)}
                                                    required
                                                    className="shadow-sm bg-gray-100 focus:ring-indigo-500 p-2 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2 flex flex-col">
                                        <label htmlFor="paymentType" className="text-sm font-medium text-gray-700 mb-1">
                                            Payment Type
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="paymentType"
                                                name="paymentType"
                                                value={paymentType}
                                                onChange={(e) => setPaymentType(e.target.value)}
                                                className="bg-gray-100 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            >
                                                <option value="direct">Direct</option>
                                                <option value="coins">Coins</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-red-400 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Apply for Bid
                                    </button>
                                </div>
                            </form>


                            {bidSuccess && (
                                <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded">
                                    Bid successfully submitted!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col mt-3">
                    <h2 className="text-2xl text-gray-600 font-bold underline mb-4">Top 5 Bids on this product:</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-8 py-3 text-left text-m font-medium text-gray-700 uppercase tracking-wider">Bidder</th>
                                    <th className="px-8 py-3 text-left text-m font-medium text-gray-700 uppercase tracking-wider">Bid Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bids.slice(0, 5).map((bid, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}>
                                    <td className="px-8 py-3 whitespace-nowrap text-sm font-semibold">{`${user?.firstName} ${user?.lastName}`}</td>
                                        <td className="px-8 py-3 whitespace-nowrap text-sm">{bid.bidAmount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionProductDetails;
