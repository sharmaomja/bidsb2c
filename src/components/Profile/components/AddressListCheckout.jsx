import React from 'react';
import axios from 'axios';

const AddressList = ({ addresses, setAddresses, onEditAddress, onSelectAddress, selectedAddressIndex }) => {
  const apiBaseURL = process.env.REACT_APP_API_URL;

  const handleDeleteAddress = async (addressId) => {
    try {
      await axios.delete(`${apiBaseURL}/users/addresses/${addressId}`);
      setAddresses((prev) => prev.filter((addr) => addr.addressId !== addressId));
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4" style={{ maxWidth: '1160px' }}>
      {addresses.map((address, index) => (
        <div
          key={address.addressId}
          className={`border border-gray-500 bg-gray-200 rounded-md p-3 ${index === selectedAddressIndex ? 'selected' : ''}`}
          onClick={() => onSelectAddress(index)}
        >
          <label className="flex items-center">
            <input
              type="radio"
              id={`address-${index}`}
              checked={index === selectedAddressIndex}
              onChange={() => onSelectAddress(index)}
              className="mr-2"
            />
            <p className='font-semibold p-1 justify-center flex'>
              {address.addressLine1}, {address.addressLine2}, {address.city}, {address.state}, {address.postalCode}, {address.country}
            </p>
          </label>
          <div className="flex justify-full gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent the click on the button from triggering the outer div click
                onEditAddress(address);
              }}
              className="bg-blue-900 text-white p-2 w-full rounded-md cursor-pointer text-sm hover:bg-yellow-700"
            >
              <span className="before-content">✏️</span> Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent the click on the button from triggering the outer div click
                handleDeleteAddress(address.addressId);
              }}
              className="bg-red-500 text-white p-2 w-full rounded-md cursor-pointer text-sm hover:bg-red-700"
            >
              <span className="before-content">🗑</span> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressList;
