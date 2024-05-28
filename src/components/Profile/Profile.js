import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import AddressList from './components/AddressList';
import AddressForm from './components/AddressForm';

const Profile = () => {
  const { user, sessionId } = useAuth();
  const [profileData, setProfileData] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [uploadedProfilePicture, setUploadedProfilePicture] = useState(null);
  const [coinsToBuy, setCoinsToBuy] = useState(0);
  const [customCoins, setCustomCoins] = useState('');
  const apiBaseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (user && user.userId) {
      fetchUserData(user.userId);
    }
  }, [user, sessionId]); // Added sessionId to the dependencies

  const fetchUserData = async (userId) => {
    try {
      const config = {
        headers: {
          'Session-Id': sessionId,
        },
      };
      const response = await axios.get(`${apiBaseURL}/users/${userId}`, config);
      const userData = response.data;
      if (userData) {
        setProfileData(userData);
        setUploadedProfilePicture(userData?.UserProfilePicture?.signedUrl);
        fetchAddresses(userId);
      }
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

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }

    try {
      const presignedUrlResponse = await axios.get(`${apiBaseURL}/users/generateUploadURL/${user.userId}?fileType=${file.type}`, {
        headers: {
          'Session-Id': sessionId,
        },
      });
      const { presignedUrl, imageUrl } = presignedUrlResponse.data;
      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
          'Authorization': undefined // Ensure this is intentional
        },
      });
      setUploadedProfilePicture(imageUrl);
      await axios.post(`${apiBaseURL}/users/update-profile-picture/${user.userId}`,
        { imageUrl: imageUrl },
        {
          headers: {
            'Content-Type': 'application/json',
            'Session-Id': sessionId,
          },
        }
      );
      console.log('Profile picture updated successfully');
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

  const handleCoinsChange = (event) => {
    setCoinsToBuy(Number(event.target.value));
  };

  const handleCustomCoinsChange = (event) => {
    setCustomCoins(event.target.value);
  };

  const calculateTotalPrice = () => {
    const pricePerCoin = 1;
    const gstPercentage = 18;

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
    const totalAmount = calculateTotalPrice();
    console.log(`Buying ${coinsToBuy} coins for Rs. ${totalAmount}`);
    // Add API call or other logic here
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col sm:flex-row mt-10 ml-10 mr-10">
      <div className="w-full sm:w-1/2 pr-0 sm:pr-8">
        <div className="flex flex-col items-start p-4 sm:p-10 bg-yellow-50 shadow-md">
        <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-6 ml-0 sm:ml-6">
        <div className="relative w-full h-full lg:w-48 lg:h-48 mx-auto mb-4 sm:mb-0 sm:mr-6 overflow-hidden rounded-md">
          {profileData && profileData.UserProfilePicture ? (
            <img
              src={profileData.UserProfilePicture.imageUrl}
              alt="Profile"
              className="w-full h-full lg:w-48 lg:h-48 mx-auto mb-4 sm:mb-0 sm:mr-6 overflow-hidden rounded-md border-4 border-white object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full lg:w-48 lg:h-48 mx-auto mb-4 sm:mb-0 sm:mr-6 overflow-hidden rounded-md border-4 border-white bg-gray-200">
              <span className="text-gray-600">No profile image</span>
            </div>
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
                {profileData.email || 'No email available'}
              </h3>
              <button
                className="text-md text-red-500 mt-2 underline"
                onClick={() => document.getElementById("profilePicture").click()}
              >
                Update profile picture
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full sm:w-1/2">
        <div className="flex flex-col items-start p-4 sm:p-10 bg-yellow-50 shadow-md">
          <button
            className="bg-yellow-400 text-white text-3xl sm:text-3xl w-full h-10 mb-4 rounded-full hover:bg-yellow-600 transition duration-300"
            onClick={toggleAddAddressForm}
          >
            +
          </button>
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4">
            <AddressList
              addresses={addresses}
              setAddresses={setAddresses}
              onEditAddress={handleEditAddress}
              className="w-full lg:w-1/2"
            />
            {showAddAddressForm && (
              <AddressForm
                userId={user.userId}
                sessionId={sessionId}
                setAddresses={setAddresses}
                editingAddress={editingAddress}
                setShowAddAddressForm={setShowAddAddressForm}
                setEditingAddress={setEditingAddress}
                className="w-full lg:w-2/3"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
