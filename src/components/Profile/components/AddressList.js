import React from 'react';
import axios from 'axios';

const AddressList = ({ addresses, setAddresses, onEditAddress }) => {
    const apiBaseURL = process.env.REACT_APP_API_URL;

    const handleDeleteAddress = async (addressId) => {
        try {
            await axios.delete(`${apiBaseURL}/users/addresses/${addressId}`);
            setAddresses(prev => prev.filter(addr => addr.addressId !== addressId));
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    return (
        <div className="flex flex-col gap-4" style={{ maxWidth: '1160px' }}  >
            {addresses.map(address => (
                <div key={address.addressId} className="border border-gray-500 bg-gray-300 rounded-md p-3" >
                    <p className='font-semibold p-1 justify-center flex'>{address.addressLine1}, {address.addressLine2}, {address.city}, {address.state}, {address.postalCode}, {address.country}</p>
                    <div className="flex justify-full gap-2">
                        <button
                            onClick={() => onEditAddress(address)}
                            className="bg-blue-600 text-white p-2 w-full rounded-md cursor-pointer text-sm hover:bg-yellow-700"
                        >
                            <span className="before-content">✏️</span> Edit
                        </button>
                        <button
                            onClick={() => handleDeleteAddress(address.addressId)}
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
