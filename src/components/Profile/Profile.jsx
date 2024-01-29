import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import profile from '../../assets/profile.gif';

import AddressList from './components/AddressList';
import AddressForm from './components/AddressForm';

const Profile = () => {
  const { user, sessionId } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadedProfilePicture, setUploadedProfilePicture] = useState(null);
  const [coinsToBuy, setCoinsToBuy] = useState(0);
  const [customCoins, setCustomCoins] = useState('');
  const apiBaseURL = process.env.REACT_APP_API_URL;


  useEffect(() => {
    if (user && user.userId) {
      fetchUserData(user.userId);
    }
  }, [user]);

  const fetchUserData = async (userId) => {
    try {
      const config = {
        headers: {
          'Session-Id': sessionId,
        },
      };
      const response = await axios.get(`${apiBaseURL}/users/${userId}`, config);
      const userData = response.data;

      // Log the received user data for debugging
      console.log('Received User Data:', userData);
      console.log('Setting uploaded profile picture:', userData?.UserProfilePicture?.imagePath);
      // Assuming the user data includes imagePath for the profile picture
      setUploadedProfilePicture(userData?.UserProfilePicture?.imagePath || profile);
      // Other user data handling (if needed)

      // Fetch addresses if needed
      fetchAddresses(userId);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchAddresses = async (userId) => {
    try {
      const config = {
        headers: {
          'Session-Id': sessionId,
        },
      };
      const response = await axios.get(`${apiBaseURL}/users/${userId}/addresses`, config);
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddAddressForm(true);
  };

  const toggleAddAddressForm = () => {
    setShowAddAddressForm(!showAddAddressForm);
    setEditingAddress(null);
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);

    // Set the uploaded profile picture for preview
    setUploadedProfilePicture(URL.createObjectURL(file));

    // Call updateProfile immediately after selecting a file
    updateProfile(file);
  };

  const updateProfile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      console.log(formData);

      // Add other profile information to formData if needed

      const response = await axios.post(
        `${apiBaseURL}/users/upload-profile-picture/${user.userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Session-Id': sessionId,
          },
        }
      );

      // Assuming the response contains the updated user data including the profile picture path
      const updatedUser = response.data;


      // Update the uploaded profile picture path
      setUploadedProfilePicture(updatedUser.imagePath);

      console.log('Profile updated:', updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCoinsChange = (event) => {
    setCoinsToBuy(Number(event.target.value));
  };

  const handleCustomCoinsChange = (event) => {
    setCustomCoins(event.target.value);
  };

  const calculateTotalPrice = () => {
    // Calculate total price based on selected coins option or custom coins
    const pricePerCoin = 1; // Replace with the actual price per coin
    const gstPercentage = 18; // GST percentage

    let totalCoins = coinsToBuy;
    if (customCoins && !isNaN(customCoins)) {
      totalCoins = parseFloat(customCoins);
    }

    const totalPrice = totalCoins * pricePerCoin;
    const gstAmount = (totalPrice * gstPercentage) / 100;
    const totalAmount = totalPrice + gstAmount;

    return totalAmount.toFixed(2);
  };

  const handleBuyCoins = () => {
    // Implement the logic for buying coins
    const totalAmount = calculateTotalPrice();
    console.log(`Buying ${coinsToBuy} coins for Rs. ${totalAmount}`);
    // Add API call or other logic here
  };

  const calculateGST = () => {
    const totalPrice = calculateTotalPrice();
    const gstPercentage = 8;
    const gstAmount = (totalPrice * gstPercentage) / 100;
    return gstAmount.toFixed(2);
  };

  const calculateGSTPercentage = () => {
    return 8;
  };


  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-start p-4 sm:p-10 ml-4 sm:ml-24 mr-4 sm:mr-24 max-w-full mt-4 sm:mt-10 bg-gray-100 shadow-md">
      <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-6">
        <div className="relative w-32 h-32 mx-auto mb-4 sm:mb-0 sm:mr-6 overflow-hidden rounded-md border-4 border-white">
          {uploadedProfilePicture ? (
            <img
              src={`${apiBaseURL}/${uploadedProfilePicture}`}
              alt="Profile"
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <img
              src={`${apiBaseURL}/${profile}`}
              alt="Default Profile"
              className="w-full h-full object-cover rounded-md"
            />
          )}
          <label
            htmlFor="profilePicture"
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer opacity-0 transition-opacity duration-300 hover:opacity-100"
          >
            <span className="text-white text-3xl">+</span>
          </label>
          <input
            type="file"
            id="profilePicture"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePictureChange}
          />
        </div>
        <div className="ml-0 sm:ml-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {`${user.firstName} ${user.lastName}`}
          </h1>
          <h3 className="text-l sm:text-xl font-semibold text-gray-700">
            {`${user.email}`}
          </h3>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full">
        <div className="w-full sm:w-2/5 lg:w-2/5 pr-0 sm:pr-8">
          <button
            className="bg-yellow-400 text-white text-2xl sm:text-3xl w-full h-10 mb-4 rounded-full hover:bg-yellow-500"
            onClick={toggleAddAddressForm}
          >
            +
          </button>
          <AddressList
            addresses={addresses}
            setAddresses={setAddresses}
            onEditAddress={handleEditAddress}
          />
        </div>
        {showAddAddressForm && (
          <div className="w-full sm:w-1/3 lg:w-1/3 pl-0 sm:pl-8">
            <AddressForm
              userId={user.userId}
              sessionId={sessionId}
              setAddresses={setAddresses}
              editingAddress={editingAddress}
              setEditingAddress={setEditingAddress}
            />
          </div>
        )}
        <div className="w-full sm:w-2/3 lg:w-2/3 pl-0 sm:pl-8">
          <div className="bg-white h-full p-4 sm:p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-4">Buy Virtual Coins</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Coins to Buy</label>
              <select
                className="mt-1 p-2 w-full border rounded-md"
                onChange={handleCoinsChange}
                value={coinsToBuy}
              >
                <option value={0}>Select an option</option>
                <option value={50}>50 coins for Rs. 50</option>
                <option value={100}>100 coins for Rs. 100</option>
                <option value={200}>200 coins for Rs. 200</option>
                <option value={500}>500 coins for Rs. 500</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Custom Coins</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Enter custom coins"
                value={customCoins}
                onChange={handleCustomCoinsChange}
              />
            </div>
            <p className="mb-2">
              Total Price: Rs. {calculateTotalPrice()} (Including GST: Rs. {calculateGST()})
            </p>
            <p className="text-sm mt-2text-gray-500 mb-4">
              The price includes GST at {calculateGSTPercentage()}% rate.
            </p>
            <button
              className="bg-teal-500 mt-4 w-full h-10 text-white p-2 rounded-md hover:bg-teal-600"
              onClick={handleBuyCoins}
              disabled={coinsToBuy === 0 && !customCoins}
            >
              Buy Coins
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Note: Your purchase will be subject to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>


  );
};

export default Profile;
