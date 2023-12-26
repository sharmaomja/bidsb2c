import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddressForm = ({ userId, sessionId, setAddresses, editingAddress, setEditingAddress, setShowAddAddressForm, fetchAddresses }) => {
    
    const [newAddress, setNewAddress] = useState({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        phone: '',
        addressType: 'shipping'
    });
    const [message, setMessage] = useState('');
    const [isDefaultAddress, setIsDefaultAddress] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (editingAddress) {
            setNewAddress(editingAddress);
        } else {
            resetForm();
        }
    }, [editingAddress]);

    const apiBaseURL = process.env.REACT_APP_API_URL;

    const handleInputChange = (e) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setNewAddress({
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
            phone: '',
            addressType: 'shipping'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation (Example: Check for required fields)
        if (!newAddress.addressLine1 || !newAddress.city || !newAddress.state || !newAddress.postalCode || !newAddress.country) {
            setMessage('Please fill in all required fields.');
            return;
        }

        const apiEndPoint = editingAddress
            ? `${apiBaseURL}/users/addresses/${editingAddress.addressId}`
            : `${apiBaseURL}/users/address`; // Ensure this endpoint matches your server route for adding an address

        const method = editingAddress ? 'put' : 'post';
        
        const addressData = {
            ...newAddress,
            userId: userId,
            isDefault: isDefaultAddress
        };

        console.log('Submitting Address:', addressData); // Temporarily log the data to be sent
        console.log(addressData);
        try {
            const config = {
                headers: {
                    'Session-Id': sessionId, // Include sessionId in headers
                }
            };

            const response = await axios[method](apiEndPoint, addressData, config);

            // Handle response and update state
            if (editingAddress) {
                setAddresses(prev => prev.map(addr => (addr.addressId === editingAddress.addressId ? response.data : addr)));
                setMessage('Address updated successfully');
                // Reset form and hide it
                resetForm();
                setEditingAddress(null);
                setShowAddAddressForm(false);
                fetchAddresses(userId);
                // Delayed navigation
                //setTimeout(() => navigate('/profile'), 2000);

            } else {
                setAddresses(prev => [...prev, response.data]);
                setMessage('Address added successfully');
                // Reset form and hide it
                resetForm();
                setEditingAddress(null);
                setShowAddAddressForm(false);
                fetchAddresses(userId);
                // Delayed navigation
                //setTimeout(() => navigate('/profile'), 2000);
            }
            resetForm();
            setEditingAddress(null);
        } catch (error) {
            console.error('Error submitting address:', error);
            setMessage('Failed to update address');
        }
    };
    console.log(typeof setAddresses); 
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
            <input
                type="text"
                name="addressLine1"
                placeholder="Address Line 1"
                value={newAddress.addressLine1}
                onChange={handleInputChange}
                className="p-1 border border-gray-500 rounded-md text-xl"
            />
            <input
                type="text"
                name="addressLine2"
                placeholder="Address Line 2"
                value={newAddress.addressLine2}
                onChange={handleInputChange}
                className="p-1 border border-gray-500 rounded-md text-xl"
            />
            <input
                type="text"
                name="city"
                placeholder="City"
                value={newAddress.city}
                onChange={handleInputChange}
                className="p-1 border border-gray-500 rounded-md text-xl"
            />
            <input
                type="text"
                name="state"
                placeholder="State"
                value={newAddress.state}
                onChange={handleInputChange}
                className="p-1 border border-gray-500 rounded-md text-xl"
            />
            <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={newAddress.postalCode}
                onChange={handleInputChange}
                className="p-1 border border-gray-500 rounded-md text-xl"
            />
            <input
                type="text"
                name="country"
                placeholder="Country"
                value={newAddress.country}
                onChange={handleInputChange}
                className="p-1 border border-gray-500 rounded-md text-xl"
            />
            <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={newAddress.phone}
                onChange={handleInputChange}
                className="p-1 border border-gray-500 rounded-md text-xl"
            />
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="defaultAddress"
                    name="defaultAddress"
                    checked={isDefaultAddress}
                    onChange={() => setIsDefaultAddress(!isDefaultAddress)}
                    className="mr-2"
                />
                <label htmlFor="defaultAddress" className="text-xl">
                    Set as default address
                </label>
            </div>
            <select
                name="addressType"
                value={newAddress.addressType}
                onChange={handleInputChange}
                className="p-1 border border-gray-500 rounded-md text-xl"
            >
                <option value="shipping">Shipping</option>
                <option value="billing">Billing</option>
            </select>

            <button type="submit" className="bg-blue-800 text-white p-1 rounded-md cursor-pointer text-xl hover:bg-blue-500">
                {editingAddress ? 'Update Address' : 'Add Address'}
            </button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default AddressForm;