import React from 'react';
import './CouponModal.css';

const Modal = ({  onClose, offer }) => {
    if (!offer) {
        return null;
        }

    const handleClose = (e) => {
        e.stopPropagation(); // Prevent event from propagating to parent elements
        onClose(); // Close the modal
        };

  return (
    <div className="modal-backdrop" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', maxWidth: '500px', width: '100%', position: 'relative' }}>
        <button onClick={handleClose} style={{ position: 'absolute', top: '10px', right: '10px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
        <h1 style={{ color: 'black' }}>{offer.name}</h1>
        <img src={`${process.env.REACT_APP_API_URL}/${offer.couponCodeimg}`} alt="Offer" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />
        <p style={{ color: 'black' }}>{offer.description}</p>
        <p style={{ color: 'black' }}><strong>Terms & Conditions:</strong> {offer.termsCondition}</p>
        <p style={{ color: 'black' }}><strong>Coupon Code:</strong> {offer.couponCode}</p>
      </div>
    </div>
  );
};

export default Modal;
