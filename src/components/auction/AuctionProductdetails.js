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
    const [userData, setUserData] = useState(null);
    const [newReview, setNewReview] = useState({ title: '', body: '', rating: 0 });
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [reviewImages, setReviewImages] = useState(null);
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

    const submitReview = async () => {
        if (!user) {
            alert("Please log in to submit reviews.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('productId', productId);
            formData.append('userId', user.userId);
            formData.append('title', newReview.title);
            formData.append('body', newReview.body);
            formData.append('rating', rating);

            // Append each selected image to the formData
            if (reviewImages) {
                reviewImages.forEach((file, index) => {
                    formData.append('reviewImages', file, `image${index}.png`);
                });
            }

            const response = await axios.post(`${apiBaseURL}/api/product-reviews`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log("Review submitted", response.data);

            // Reload the page after submitting the review
            window.location.reload();
        } catch (error) {
            console.error('Error submitting review:', error);
        }

        setNewReview({ title: '', body: '', rating: 0 });
        setRating(0);
        setReviewImages([]); // Clear the selected images after submission
    };

    const handleImageChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Update the state directly with the File objects
        setReviewImages(selectedFiles);
    };

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length
        : 0;

    const handleLoadMore = () => {
        // Increase the visible comments by a certain amount (e.g., 5 more comments)
        setVisibleComments((prevVisibleComments) => prevVisibleComments + 5);
    };

    const handleReviewChange = (e) => {
        setNewReview({ ...newReview, [e.target.name]: e.target.value });
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
        <div className="bg-white flex flex-col min-h-screen">
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

            <div className="flex flex-col mt-24 mb-36 w-full md:ml-16">
                <div className="flex flex-col mt-8">
                    {/* Write a Review Section */}
                    <div className="flex flex-col lg:flex-row space-y-4 lg:space-x-8 lg:space-y-0">
                        <div className="w-full lg:w-1/3 p-4 bg-white rounded-lg shadow-lg">
                            <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
                            <textarea
                                name="body"
                                value={newReview.body}
                                onChange={handleReviewChange}
                                placeholder="Your review..."
                                className="border border-gray-300 p-2 mb-2 w-full h-32 rounded-md resize-none"
                            />
                            <div className="flex items-center mb-2">
                                <StarRatings
                                    rating={rating}
                                    starDimension="20px"
                                    starSpacing="2px"
                                    starRatedColor="#FF9900"
                                    changeRating={setRating}
                                    numberOfStars={5}
                                    name="rating"
                                />
                                <span className="ml-2 text-gray-600">{rating} / 5</span>
                            </div>
                            <button
                                onClick={submitReview}
                                className="bg-green-400 text-black text-lg px-2 py-1 rounded hover:bg-green-500 w-full"
                            >
                                Submit Review
                            </button>
                        </div>

                        {/* Customer Reviews Section */}
                        <div className="w-full lg:w-2/3 p-4 bg-white rounded-lg shadow-lg">
                            <h3 className="text-lg font-semibold mb-2">Customer Ratings & Reviews</h3>
                            <div className="flex items-center mb-4">
                                <div className="mr-2 flex items-center">
                                    <span className="text-gray-700">Average Rating:</span>
                                    {[...Array(5)].map((_, index) => (
                                        <svg
                                            key={index}
                                            className={`h-5 w-5 text-yellow-500 fill-current ${index < averageRating ? 'text-yellow-500' : 'text-gray-400'}`}
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path d="M10 3.55l1.5 3.75h3.63l-2.93 2.28 1.1 3.35L10 12.11l-3.3 2.82 1.1-3.35-2.93-2.28h3.63l1.5-3.75z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-gray-700">{averageRating.toFixed(1)} ({reviews.length} reviews)</span>
                            </div>
                            <ul className="space-y-4">
                                {reviews.slice(0, visibleComments).map((review, index) => (
                                    <li key={index} className="p-4 bg-gray-100 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            {[...Array(5)].map((_, index) => (
                                                <svg
                                                    key={index}
                                                    className={`h-5 w-5 text-yellow-500 fill-current ${index < review.rating ? 'text-yellow-500' : 'text-gray-400'}`}
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M10 3.55l1.5 3.75h3.63l-2.93 2.28 1.1 3.35L10 12.11l-3.3 2.82 1.1-3.35-2.93-2.28h3.63l1.5-3.75z" />
                                                </svg>
                                            ))}
                                            <span className="ml-2 text-gray-700 font-semibold">{review.User.firstName} {review.User.lastName}</span>
                                        </div>
                                        <p className="text-gray-800">{review.body}</p>
                                        {review.ReviewImages && review.ReviewImages.length > 0 && (
                                            <div className="flex flex-wrap mt-2">
                                                {review.ReviewImages.map((img, imgIndex) => (
                                                    <img
                                                        key={imgIndex}
                                                        src={`${apiBaseURL}/${img.imagePath}`}
                                                        alt={`Review Image ${imgIndex + 1}`}
                                                        className="object-cover w-20 h-20 mr-2 mb-2 rounded-md"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            {reviews.length > visibleComments && (
                                <button
                                    onClick={handleLoadMore}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Load More
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionProductDetails;
