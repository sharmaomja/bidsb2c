import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useAuth } from '../../hooks/useAuth';
import { useParams } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';

const AuctionProductDetails = () => {
    const { user, sessionId } = useAuth();
    const [profileData, setProfileData] = useState({});
    const { productId, auctionId } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [bidAmount, setBidAmount] = useState('');
    const [paymentType, setPaymentType] = useState('direct');
    const [bidSuccess, setBidSuccess] = useState(false);
    const [bids, setBids] = useState([]);
    const [newQna, setNewQna] = useState({ title: '', body: '' });
    const [qnas, setQnas] = useState([]);
    const [newReply, setNewReply] = useState({ body: '' });
    const [parentId, setParentId] = useState(null);
    const [visibleComments, setVisibleComments] = useState(5);
    const [auctionData, setAuctionData] = useState(null);
    const [bidderData, setBidderData] = useState({});
    const apiBaseURL = process.env.REACT_APP_API_URL;
    const [timeRemaining, setTimeRemaining] = useState(null);

    useEffect(() => {
        if (auctionData) {
            const endTime = new Date(auctionData.endTime).getTime();
            const now = new Date().getTime();
            const timeDiff = endTime - now;

            if (timeDiff > 0) {
                const intervalId = setInterval(() => {
                    const updatedTimeDiff = endTime - new Date().getTime();
                    if (updatedTimeDiff <= 0) {
                        clearInterval(intervalId);
                        setTimeRemaining(null);
                    } else {
                        setTimeRemaining(updatedTimeDiff);
                    }
                }, 1000);

                return () => clearInterval(intervalId);
            } else {
                setTimeRemaining(null);
            }
        }
    }, [auctionData]);

    const formatTime = (time) => {
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
        const days = Math.floor(time / (1000 * 60 * 60 * 24));

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/api/products/${productId}`);
                if (response.data) {
                    const combinedMedia = [
                        ...response.data.images.map(image => ({ type: 'image', url: image.imageUrl })),
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

    const fetchBidderData = async (userId) => {
        try {
            const response = await axios.get(`${apiBaseURL}/users/${userId}`);
            const userData = response.data;
            setBidderData((prevData) => ({
                ...prevData,
                [userId]: userData,
            }));
            console.log('Received Bidder Data:', userData);
        } catch (error) {
            console.error('Error fetching bidder data:', error);
        }
    };

    // Inside useEffect for fetching bids
    useEffect(() => {
        const fetchBids = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/api/auctions/${auctionId}/bids`);
                if (response.data) {
                    console.log('Fetched bids:', response.data);
                    // Fetch bidder data for each bid
                    for (const bid of response.data) {
                        await fetchBidderData(bid.userId);
                    }
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

    useEffect(() => {
        const fetchAuctionData = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/api/auctions/view/${auctionId}`);
                if (response.data) {
                    console.log('Auction Data:', response.data)
                    setAuctionData(response.data); // Set auction data
                }
            } catch (error) {
                console.error('Error fetching auction data:', error);
            }
        };

        if (auctionId) {
            fetchAuctionData();
        }
    }, [auctionId, apiBaseURL]);

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!user) {
                console.error('User not authenticated');
                return;
            }
            const requestData = {
                auctionId: auctionId,
                userId: user.userId, // Add null check here
                bidAmount: parseFloat(bidAmount),
                coinsUsed: paymentType === 'coins' ? 10 : 0,
                payment_type: paymentType
            };
            const response = await axios.post(`${apiBaseURL}/api/bids`, requestData);
            // Reset form fields
            setBidAmount('');
            setPaymentType('direct');
            setBidSuccess(true);
            // Hide bid success message after 3 seconds
            setTimeout(() => {
                setBidSuccess(false);
            }, 10000);

            window.location.reload();
        } catch (error) {
            console.error('Error submitting bid:', error);
        }
    };

    useEffect(() => {
        fetchQnas();
    }, []);

    const fetchQnas = async () => {
        try {
            const response = await axios.get(`${apiBaseURL}/api/products/${productId}/qna`);
            setQnas(response.data);
        } catch (error) {
            console.error('Error fetching Q&As:', error);
        }
    };

    const submitQna = async () => {
        if (!user) {
            alert("Please log in to submit questions.");
            return;
        }

        try {
            const response = await axios.post(`${apiBaseURL}/api/auction-qna`, {
                productId: productId,
                userId: user.userId,
                title: newQna.title,
                body: newQna.body,
                parentId: null
            });

            console.log("Q&A submitted", response.data);
            setNewQna({ title: '', body: '' });
            fetchQnas();
        } catch (error) {
            console.error('Error submitting Q&A:', error);
        }
    };

    const submitReply = async (parentId) => {
        if (!user) {
            alert("Please log in to submit replies.");
            return;
        }

        try {
            const response = await axios.post(`${apiBaseURL}/api/auction-qna`, {
                productId: productId,
                userId: user.userId,
                title: '',
                body: newReply.body,
                parentId: parentId
            });

            console.log("Reply submitted", response.data);
            setNewReply({ body: '' });
            fetchQnas();
        } catch (error) {
            console.error('Error submitting reply:', error);
        }
    };

    const handleQnaChange = (e) => {
        setNewQna({ ...newQna, [e.target.name]: e.target.value });
    };

    const handleReplyChange = (e) => {
        setNewReply({ ...newReply, [e.target.name]: e.target.value });
    };

    const handleLoadMore = () => {
        setVisibleComments((prevVisibleComments) => prevVisibleComments + 5);
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
    const uniqueBids = {};

    // Iterate through bids to find the highest bid for each user
    bids.forEach(bid => {
        // Check if the user's bid exists in uniqueBids
        if (!uniqueBids[bid.userId] || bid.bidAmount > uniqueBids[bid.userId].bidAmount) {
            // If not, or if the current bid is higher, update the user's bid in uniqueBids
            uniqueBids[bid.userId] = bid;
        }
    });

    // Convert uniqueBids object back to an array
    const uniqueBidsArray = Object.values(uniqueBids);

    // Now you can render uniqueBidsArray instead of bids

    return (
        <div className="bg-white flex flex-col min-h-screen min-w-screen overflow-x-hidden">
            <div className="flex flex-col mt-3">
                <div className="overflow-x-auto h-8 bg-yellow-100 text-md font-semibold">
                    <marquee className="whitespace-nowrap" direction="right" scrollamount="20">
                        {uniqueBidsArray.map((bid, index) => (
                            <span key={index} className="text-gray-800 mr-4">
                                {bidderData[bid.userId] ? `${bidderData[bid.userId].firstName} ${bidderData[bid.userId].lastName}` : 'Unknown Bidder'} - ₹ {bid.bidAmount}
                            </span>
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
                        width: '40%',
                        height: '80%',
                        margin: 'auto',
                        overflow: 'hidden',
                        borderRadius: '20px', // Adding some border radius
                        boxShadow: '0 4px 8px rgba(1, 0, 0, 0.9)' // Adding a shadow
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75            )',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: '9999'
                    },
                }}
            >
                {product && selectedImageIndex !== null && (
                    <img
                        src={product.combinedMedia[selectedImageIndex].url}
                        alt={`Product media ${selectedImageIndex + 1}`}
                        className="object-contain bg-transparent"
                        style={{
                            width: '100%',
                            height: '90%'
                        }}
                    />
                )}
                <div className="flex justify-center">
                    <button className="bg-red-500 text-white font-bold w-96 h-8 mt-4 rounded-full" onClick={closeModal}>Close</button>
                </div>
            </Modal>
            <div className='flex flex-col md:flex-row md:justify-center pt-10 md:mt-0 md:ml-12 md:mr-12'>
                <div className="flex-1 md:min-w-screen min-h-screen md:flex-col">
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
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {mediaGroup.map((media, index) => (
                                                <div key={index} className="relative">
                                                    {media.type === 'image' ? (
                                                        <img
                                                            src={media.url}
                                                            alt={`Product media ${groupIndex * 3 + index + 1}`}
                                                            className="w-full h-full object-contain cursor-pointer"
                                                            onClick={() => openModal(groupIndex * 3 + index)}
                                                        />
                                                    ) : null}
                                                    {media.type === 'video' ? (
                                                        <video className="w-full h-full object-cover" controls>
                                                            <source src={media.url} type="video/mp4" />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    ) : null}
                                                    <div className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md">
                                                        {media.type === 'image' ? (
                                                            <i className="fas fa-image text-gray-600"></i>
                                                        ) : (
                                                            <i className="fas fa-video text-gray-600"></i>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Carousel.Item>
                                ))}
                        </Carousel>
                    </div>
                </div>

                {/* Product info */}
                <div className='flex-1 mt-2 lg:ml-12'>
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
                        {timeRemaining && (
                            <div className="mt-4">
                                <h2 className="text-lg font-semibold text-red-600">Time Remaining: {formatTime(timeRemaining)}</h2>
                            </div>
                        )}
                        {/* biding */}
                        <div className="max-w-2xl px-1 pb-2 sm:px-6 ">
                            {auctionData && auctionData.status !== 'completed' ? (
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
                                                        min={auctionData.startingBid}
                                                        className="shadow-sm bg-gray-100 focus:ring-indigo-500 p-2 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                    <span className="text-sm font-semibold text-gray-800">Bid amount cannot be less than ₹{auctionData.startingBid}</span> {/* Display text indicating minimum bid amount */}
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
                                            className="w-full bg-red-400 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Apply for Bid
                                        </button>
                                    </div>
                                </form>) : auctionData && auctionData.status === 'completed' ? (
                                    <div className="mt-6 text-red-500 font-bold underline text-xl">This bid is not active</div>
                                ) : (
                                <div className="mt-6 text-red-500 font-semibold text-lg">This bid is not active</div>
                            )}

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
                                {uniqueBidsArray.slice(0, 5).map((bid, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}>
                                        <td className="px-8 py-3 whitespace-nowrap text-sm font-semibold">
                                            {/* Display bidder's name */}
                                            {bidderData[bid.userId]?.firstName} {bidderData[bid.userId]?.lastName}
                                        </td>
                                        <td className="px-8 py-3 whitespace-nowrap text-sm">{bid.bidAmount}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>

            <div className="flex flex-col max-w-8xl mb-12">
            <div className="flex flex-col space-y-4">
                {/* Write a Q&A Section */}
                <div className="w-full p-4 bg-gray-100 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Ask a Question</h3>
                    <input
                        type="text"
                        name="title"
                        value={newQna.title}
                        onChange={handleQnaChange}
                        placeholder="Title..."
                        className="border border-gray-300 p-2 mb-2 w-full rounded-md focus:outline-none focus:border-blue-500"
                    />
                    <textarea
                        name="body"
                        value={newQna.body}
                        onChange={handleQnaChange}
                        placeholder="Your question..."
                        className="border border-gray-300 p-2 mb-2 w-full h-24 rounded-md resize-none focus:outline-none focus:border-blue-500"
                    />
                    <button
                        onClick={submitQna}
                        className="bg-blue-500 text-white text-base px-4 py-2 rounded hover:bg-blue-600 transition duration-200 w-full"
                    >
                        Submit Question
                    </button>
                </div>
        
                {/* Customer Q&A Section */}
                <div className="w-full p-4 bg-gray-100 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Customer Questions & Answers</h3>
                    <ul className="space-y-4">
                        {qnas.slice(0, visibleComments).map((qna, index) => (
                            <li key={index} className="p-4 bg-white rounded-lg shadow-sm">
                                <div className="flex items-center mb-2">
                                    <span className="text-gray-700 font-semibold">{qna.User.firstName} {qna.User.lastName}</span>
                                </div>
                                <h4 className="text-gray-800 font-semibold mb-1">{qna.title}</h4>
                                <p className="text-gray-700 mb-2">{qna.body}</p>
        
                                {/* Reply Section */}
                                <div className="mt-2 border-t pt-2">
                                    <input
                                        type="text"
                                        name="body"
                                        value={newReply.body}
                                        onChange={handleReplyChange}
                                        placeholder="Your reply..."
                                        className="border border-gray-300 p-2 mb-1 w-full rounded-md focus:outline-none focus:border-blue-500"
                                    />
                                    <button
                                        onClick={() => submitReply(qna.id)}
                                        className="bg-green-500 text-white text-base px-3 py-1 rounded hover:bg-green-600 transition duration-200"
                                    >
                                        Submit Reply
                                    </button>
                                </div>
        
                                {/* Display Replies */}
                                {qna.answers && qna.answers.length > 0 && (
                                    <ul className="mt-2 space-y-2">
                                        {qna.answers.map((answer, ansIndex) => (
                                            <li key={ansIndex} className="p-2 bg-gray-100 border border-gray-200 rounded-lg">
                                                <div className="flex items-center mb-1">
                                                    <span className="text-gray-600 font-medium">{answer.User.firstName} {answer.User.lastName}</span>
                                                </div>
                                                <p className="text-gray-700">{answer.body}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                    {qnas.length > visibleComments && (
                        <button
                            onClick={handleLoadMore}
                            className="mt-4 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                        >
                            Load More
                        </button>
                    )}
                </div>
            </div>
        </div>
        
        </div>
    );
};

export default AuctionProductDetails;
