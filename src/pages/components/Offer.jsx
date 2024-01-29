import React, { useState, useEffect } from 'react';
import Modal from './CouponModal';

const Offer = () => {
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const apiBaseURL = process.env.REACT_APP_API_URL;
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = (offer) => {
    setSelectedOffer(offer);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOffer(null);
  };

  const fetchOffers = async () => {
    try {
      const response = await fetch(`${apiBaseURL}/offers/random`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setOffers(data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Coupon code copied to clipboard');
  };



  return (
    <div>
      {offers.map((offer, index) => (
        <div key={index} className="offer-box my-4 p-3 border rounded" onClick={() => handleOpenModal(offer)}>
          <h4 className="font-bold">{offer.name}</h4>
          <p>{offer.description}</p>
          {offer.couponCodeimg && (
            <img src={`${apiBaseURL}/${offer.couponCodeimg}`} alt="Offer" className="w-full h-auto" />
          )}
          <p><strong>Terms & Conditions:</strong> {offer.termsCondition}</p>
          <div className="flex items-center">
            <span className="mr-2">Use Code:</span>
            <span className="font-bold">{offer.couponCode}</span>
            <button onClick={() => copyToClipboard(offer.couponCode)} className="ml-2 text-sm underline">Copy</button>
          </div>
          {showModal && selectedOffer && <Modal offer={selectedOffer} onClose={handleCloseModal} />}
        </div>
      ))}
      
    </div>
  );
};

export default Offer;
