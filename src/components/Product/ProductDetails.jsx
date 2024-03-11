import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useAuth } from '../../hooks/useAuth';
import { Carousel } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import { useCart } from '../../contexts/CartContext';
import securepay from '../../assets/securepay.png';
import freedelivery from '../../assets/freedelivery.png';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
    const { user } = useAuth();
    const { productId } = useParams();
    const { fetchCartCount } = useCart();
    const [product, setProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [addedToCart, setAddedToCart] = useState(false);
    const [addedToWishlist, setAddedToWishlist] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [reviewImages, setReviewImages] = useState(null);
    const [visibleComments, setVisibleComments] = useState(5);
    const [newReview, setNewReview] = useState({ title: '', body: '', rating: 0 });
    const [showMore, setShowMore] = useState(false);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [secureTransaction, setSecureTransaction] = useState(false);
    const [freeDelivery, setFreeDelivery] = useState(false);
    const [deliveryTime, setDeliveryTime] = useState('');
    const apiBaseURL = process.env.REACT_APP_API_URL;

    const extractImageId = url => {
        const match = url.match(/\/d\/([^/]+)\//);
        if (match && match[1]) {
            return `https://drive.google.com/thumbnail?id=${match[1]}`;
        } else {
            console.error('Invalid Google Drive image URL:', url);
            return url;
        }
    };

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/api/products/${productId}`);
                if (response.data) {
                    const combinedMedia = [
                        ...response.data.images.map(image => ({ type: 'image', url: extractImageId(image) })),
                        ...response.data.videos.map(video => ({ type: 'video', url: video.videoUrl })),
                    ];
                    console.log(combinedMedia)
                    setProduct({ ...response.data, combinedMedia });
                    setSecureTransaction(response.data.secureTransaction || true);
                    setFreeDelivery(response.data.freeDelivery || true);
                    setDeliveryTime(response.data.deliveryTime || '5-6 days');
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        if (productId) {
            fetchProductDetails();
        }
    }, [productId, apiBaseURL]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await axios.get(`${apiBaseURL}/api/products/${productId}`);
                console.log("Product Response:", productResponse.data);

                if (productResponse.data) {
                    const combinedMedia = [
                        ...productResponse.data.images.map(image => ({ type: 'image', url: extractImageId(image) })),
                        ...productResponse.data.videos.map(video => ({ type: 'video', url: video.videoUrl })),
                    ];

                    setProduct({ ...productResponse.data, combinedMedia });
                    const recommendResponse = await axios.get(`${apiBaseURL}/api//products/${productId}/recommend/category`);
                    setRecommendedProducts(recommendResponse.data);
                    // Fetch suggested products
                    const suggestResponse = await axios.get(`${apiBaseURL}/api//products/${productId}/recommend/seller`);
                    setSuggestedProducts(suggestResponse.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (productId) {
            fetchData();
        }
    }, [productId, apiBaseURL]);

    const openModal = (index) => {
        setSelectedImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedImageIndex(null);
        setIsModalOpen(false);
    };

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const reviewResponse = await axios.get(`${apiBaseURL}/api/products/${productId}/reviews`);
                console.log("Review Response:", reviewResponse.data);
                setReviews(reviewResponse.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        if (productId) {
            fetchReviews();
        }
    }, [productId, apiBaseURL]);



    const handleReviewChange = (e) => {
        setNewReview({ ...newReview, [e.target.name]: e.target.value });
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

    const handleAddToCart = async () => {
        console.log('Handle Add to Cart Clicked');
        if (!user) {
            alert("Please log in to add items to your cart.");
            return;
        }
        console.log('User:', user);
        console.log('ProductId:', productId);
        try {
            let cartId;
            try {
                const cartResponse = await axios.get(`${apiBaseURL}/api/shopping-cart/${user.userId}`);
                cartId = cartResponse.data.cartId;
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    const newCartResponse = await axios.post(`${apiBaseURL}/api/shopping-cart`, { userId: user.userId });
                    cartId = newCartResponse.data.cartId;
                } else {
                    throw error;
                }
            }
            await axios.post(`${apiBaseURL}/api/cart-items`, {
                cartId,
                productId,
                quantity: 1
            });
            if (user) {
                await fetchCartCount(user.userId);
            }
            //const { data } = await fetchItemsByUserId(user.userId);
            // setCartCount(data.length);
            setAddedToCart(true);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const addToWishlist = async () => {
        if (!user) {
            alert("Please log in to add items to your wishlist.");
            return;
        }

        try {
            // Add product to wishlist (this will create a wishlist if it doesn't exist)
            await axios.post(`${apiBaseURL}/api/wishlist/add`, {
                userId: user.userId,
                productId
            });

            setAddedToWishlist(true);
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
    };

    const handleImageChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        setReviewImages(selectedFiles);
    };

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    if (!product) {
        return <div className="loading">Loading...</div>;
    }

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length
        : 0;

    const handleLoadMore = () => {
        setVisibleComments((prevVisibleComments) => prevVisibleComments + 5);
    };

    return (
        <div className="bg-white flex flex-col min-h-screen min-w-screen">
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
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.60)',
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


            <div className='flex flex-col md:flex-row md:justify-center mt-3 md:mt-0 md:ml-12 md:mr-12'>
                <div className='flex flex-col md:flex-row md:justify-center mt-4 md:mt-0 md:ml-12 md:mr-12'>
                    <div className="flex-1 md:min-w-screen md:flex-col" style={{ width: "900px", height: "800px" }}>
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
                                            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-2">
                                                {mediaGroup.map((media, index) => {
                                                    if (media.type === 'image') {
                                                        return (
                                                            <img
                                                                key={index}
                                                                src={media.url}
                                                                alt={`Product media ${groupIndex * 3 + index + 1}`}
                                                                className="object-cover cursor-pointer w-full h-full"
                                                                // style={{ width: "100%", height: "100%" }}
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
                <div className='flex-1 mt-2 ml-2 md:ml-0'>
                    <div className="max-w-2xl px-4 pb-8 sm:px-6 ">
                        <div className="lg:col-span-1 lg:pr-2 ">
                            <h1 className="text-2xl mt-2 font-bold tracking-tight text-gray-700 sm:text-3xl">{product.name}</h1>
                            <h1 className="text-xl font-semibold mt-2 tracking-tight text-gray-900 sm:text-2xl">{product.header}</h1>

                        </div>
                        <div className="py-10 lg:col-span-2 lg:col-start-1 lg:pb-16 lg:pr-8 lg:pt-6">
                            <div>
                                <h3 className="sr-only">Description</h3>
                                <div className="space-y-3 mt-2">
                                    <p className="text-base text-gray-900">{product.category}</p>
                                    <p className="text-base text-gray-900">{product.short_description}</p>
                                    <p className="text-base text-gray-900">
                                        {showMore ? product.description : `${product.description.slice(0, 300)}...`}
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
                            <h2 className="sr-only">Product Attributes</h2>
                            <div className="mt-2 space-y-1">
                                {product.ProductAttributes && product.ProductAttributes.map((attribute, index) => (
                                    <div key={index} className="flex items-center">
                                        <span className="font-semibold">{attribute.name}:</span>
                                        <span className="ml-2">{attribute.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 space-y-6">
                                <p className="text-sm text-gray-600">{product.details}</p>
                                <div className="flex items-center">
                                    <StarRatings
                                        rating={averageRating}
                                        starDimension="25px"
                                        starSpacing="5px"
                                        starRatedColor="green"
                                    />
                                    <p className="text-lg text-green-700 font-bold ml-2">{averageRating.toFixed(2)} / 5 </p>
                                </div>
                            </div>
                        </div>
                        {/* Options */}
                        <div className="lg:row-span-3 lg:mt-0">
                            <h2 className="sr-only">Product information</h2>
                            <p className="text-3xl tracking-tight text-gray-900">
                                <span className='line-through'>₹ {Math.ceil(product.max_price)}</span> &nbsp; ₹ {Math.ceil(product.discounted_price)}
                                {product.max_price !== product.discounted_price && (
                                    <span className="text-2xl tracking-tight text-red-500 ml-4">
                                        Save {(((product.max_price - product.discounted_price) / product.max_price) * 100).toFixed(2)}%
                                    </span>
                                )}
                            </p>

                            <div className="flex items-center mt-4">
                                {secureTransaction && (
                                    <div className="flex items-center mr-4">
                                        <span className="text-green-500 font-semibold">Secure Transaction</span>
                                        <img
                                            src={securepay}
                                            alt="Secure Transaction Icon"
                                            className="ml-2 w-10 h-10"
                                        />
                                    </div>
                                )}
                                {freeDelivery && (
                                    <div className="flex items-center mr-4">
                                        <span className="text-green-500 font-semibold">Free Delivery</span>
                                        <img
                                            src={freedelivery}
                                            alt="Free Delivery Icon"
                                            className="ml-2 w-10 h-10"
                                        />
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <span className="text-red-600">Estimated Delivery:</span>
                                    <span className="ml-2 text-blue-900">{deliveryTime}</span>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col md:flex-row md:space-x-10'>
                            <button
                                type="submit"
                                onClick={handleAddToCart}
                                className={`mt-4 md:mt-10 flex w-full md:w-96 h-12 items-center justify-center rounded-md border-transparent bg-red-400 px-8 py-3 text-base font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${addedToCart ? 'bg-gray-500 cursor-not-allowed' : ''
                                    }`}
                            >
                                {addedToCart ? 'Added to Cart' : 'Add to Cart'}
                            </button>

                            <button
                                type="submit"
                                onClick={addToWishlist}
                                className={`mt-4 md:mt-10 flex w-full md:w-96 h-12 items-center justify-center rounded-md border-transparent bg-red-400 px-8 py-3 text-base font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${addedToCart ? 'bg-gray-500 cursor-not-allowed' : ''
                                    }`}
                            >
                                {addedToWishlist ? 'Added to Wishlist' : 'Add to Wishlist'}
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Recommended Products */}
            <h2 className="mt-10 flex justify-center text-xl font-semibold bg-blue-50 text-blue-900">Recommended Products</h2>
            <div className="mt-8 p-2">
                <div className="flex flex-col md:flex-row md:justify-center md:space-x-4">
                    {recommendedProducts.slice(0, 5).map((product, index) => (
                        <div key={index} className="text-center mb-4 md:mb-0">
                            <a href={`/products/${product.productId}`}>
                                <img
                                    src={product.images && product.images.length > 0 ? product.images[0] : 'placeholder-image-url'}
                                    alt={product.name}
                                    className="object-cover w-full h-48 rounded-lg md:w-96"
                                />
                            </a>
                            <p className="mt-2 text-sm md:text-base lg:text-lg overflow-hidden max-w-96">
                                {product.name.length > 30 ? `${product.name.substring(0, 20)}...` : product.name}
                            </p>
                            <p className="text-sm tracking-tight text-gray-900">
                                {product.max_price !== product.discounted_price && (
                                    <span className="ml-2 line-through">
                                        ₹ {Math.ceil(product.max_price)}
                                    </span>
                                )}
                                {product.max_price !== product.discounted_price && (
                                    <span className="text-sm tracking-tight text-red-500 ml-2">
                                        Save {(((product.max_price - product.discounted_price) / product.max_price) * 100).toFixed(2)}%
                                    </span>
                                )}
                                &nbsp; ₹ {Math.ceil(product.discounted_price)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Suggested Products */}
            <h2 className="flex justify-center text-xl font-semibold mt-4 bg-blue-50 text-blue-900">Suggested Products</h2>
            <div className="mt-8 p-2">
                <div className="flex flex-col md:flex-row md:justify-center md:space-x-4">
                    {suggestedProducts.slice(0, 5).map((product, index) => (
                        <div key={index} className="text-center mb-4 md:mb-0">
                            <a href={`/products/${product.productId}`}>
                                <img
                                    src={product.images && product.images.length > 0 ? product.images[0] : 'placeholder-image-url'}
                                    alt={product.name}
                                    className="object-cover w-full h-48 rounded-lg md:w-96"
                                />
                            </a>
                            <p className="mt-2 text-sm md:text-base lg:text-lg overflow-hidden max-w-full">
                                {product.name.length > 20 ? `${product.name.substring(0, 20)}...` : product.name}
                            </p>
                            <p className="text-sm tracking-tight text-gray-900">
                                {product.max_price !== product.discounted_price && (
                                    <span className="ml-2 line-through">
                                        ₹ {Math.ceil(product.max_price)}
                                    </span>
                                )}
                                {product.max_price !== product.discounted_price && (
                                    <span className="text-sm tracking-tight text-red-500 ml-2">
                                        Save {(((product.max_price - product.discounted_price) / product.max_price) * 100).toFixed(2)}%
                                    </span>
                                )}
                                &nbsp; ₹ {Math.ceil(product.discounted_price)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>


            <div className="flex flex-col mt-24 mb-36 w-full md:ml-24">
                <div className="lg:flex lg:space-x-8">
                    {/* Write a Review Section */}
                    <div className="flex-col w-full lg:w-1/3 p-4 bg-white">
                        <h3 className="text-xl font-bold mb-4">Write a Review</h3>
                        <textarea
                            name="body"
                            value={newReview.body}
                            onChange={handleReviewChange}
                            placeholder="Your review..."
                            className="border border-gray-300 p-2 mb-4 w-full h-32 rounded-md"
                        />
                        <div className="mb-4">
                            <label htmlFor="reviewImage" className="text-m font-semibold text-gray-600">
                                Upload images (optional):
                            </label>
                            <input
                                type="file"
                                id="reviewImage"
                                name="reviewImages"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-2"
                                multiple
                            />
                        </div>
                        <div className="mb-4 flex items-center">
                            <StarRatings
                                rating={rating}
                                starDimension="30px"
                                starSpacing="5px"
                                starRatedColor="#FF9900"
                                changeRating={setRating}
                                numberOfStars={5}
                                name="rating"
                            />
                        </div>
                        <button
                            onClick={submitReview}
                            className="bg-teal-500 text-white text-lg px-4 py-2 rounded hover:bg-green-400 w-full"
                        >
                            Submit Review
                        </button>
                    </div>

                    {/* Customer Reviews Section */}
                    <div className="lg:w-2/3 p-4">
                        <div className="mb-4">
                            <div className="flex justify-start items-center">
                                <h3 className="text-xl font-semibold">Customer Ratings</h3>
                                {[1, 2, 3, 4, 5].map((starIndex) => (
                                    <svg
                                        key={starIndex}
                                        className={`text-${starIndex <= averageRating ? 'gray-900' : 'gray-200'} h-5 w-5 flex-shrink-0`}
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <StarRatings
                                            rating={starIndex <= averageRating ? 1 : 0}
                                            starDimension="10px"
                                            starSpacing="5px"
                                            starRatedColor="#FF9900"
                                        />
                                    </svg>
                                ))}
                            </div>
                        </div>

                        <ul className="space-y-2">
                            {reviews.slice(0, visibleComments).map((review, index) => (
                                <li key={index} className="bg-white p-2 rounded-lg shadow-lg" style={{ width: '1050px' }}>
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((starIndex) => (
                                            <svg
                                                key={starIndex}
                                                className={`text-${starIndex <= review.rating ? 'gray-900' : 'gray-200'} h-5 w-5 flex-shrink-0`}
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                {/* Your StarRatings component here */}
                                            </svg>
                                        ))}
                                    </div>
                                    <div className="flex flex-col ml-2 ">
                                        <div className='flex items-center'>
                                            <p className="ml-2 text-sm font-medium text-blue-700">
                                                {review.User.firstName} {review.User.lastName}
                                            </p>
                                            <p className="ml-4 text-sm font-medium text-green-500">
                                                {review.rating} / 5 ⭐
                                            </p>
                                        </div>
                                        <div className="mt-2 ml-2">{review.body}</div>
                                    </div>
                                    {review.ReviewImages && review.ReviewImages.length > 0 && (
                                        <div className="mt-2 ml-4 flex flex-wrap">
                                            {review.ReviewImages.map((img, imgIndex) => (
                                                <img
                                                    key={imgIndex}
                                                    src={`${apiBaseURL}/${img.imagePath}`}
                                                    alt={`Review Image ${imgIndex + 1}`}
                                                    className="object-cover w-32 h-32 mr-2 mb-2"
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
    );
};

export default ProductDetails;

// <div className="mt-4 p-2 bg-blue-50">
//                                 <h2 className="text-l ml-2 font-semibold mb-1">Check Estimated Delivery Date</h2>
//                                 <div className="flex ml-2 items-center space-x-4">
//                                     <input
//                                         type="text"
//                                         placeholder="Enter Pincode"
//                                         value={pincode}
//                                         onChange={handlePincodeChange}
//                                         className="border p-2 h-8 w-64"
//                                     />
//                                     <button
//                                         onClick={handleCheckDeliveryDate}
//                                         className="bg-blue-500 text-white px-6 py-1 rounded-md hover:bg-blue-600"
//                                     >
//                                         Check Delivery Date
//                                     </button>
//                                 </div>
//                                 {deliveryDate && (
//                                     <p className="mt-2">Estimated Delivery Date: {deliveryDate}</p>
//                                 )}
//                             </div>