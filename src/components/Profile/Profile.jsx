import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import profile from '../../assets/profile.gif';
import AddressList from './components/AddressList';
import AddressForm from './components/AddressForm';

const Profile = () => {
  const { user, sessionId } = useAuth();
  const [profileData, setProfileData] = useState({});
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
      if (userData) {
        // Instead of accessing images directly, access UserProfilePicture.imageUrl
        const combinedMedia = [
          { type: 'image', url: userData.UserProfilePicture.imageUrl }
        ];
        // Set the received user data in the state
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
          'Authorization': undefined
        },
      });
      setUploadedProfilePicture(imageUrl);
      await axios.post(`${apiBaseURL}/users/update-profile-picture/${user.userId}`,
        { imageUrl: imageUrl }, // Sending the image URL to the backend
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
    <div className="flex flex-col sm:flex-row mt-10 ml-10 mr-10">
      <div className="w-full sm:w-1/2 pr-0 sm:pr-8">
        <div className="flex flex-col items-start p-4 sm:p-10 bg-yellow-50 shadow-md">
          <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-6 ml-0 sm:ml-6">
            <div className="relative w-full h-full lg:w-48 lg:h-48 mx-auto mb-4 sm:mb-0 sm:mr-6 overflow-hidden rounded-md">
              {profileData && profileData.UserProfilePicture && (
                <img
                  src={profileData.UserProfilePicture.imageUrl}
                  alt="Profile"
                  className="w-full h-full lg:w-48 lg:h-48 mx-auto mb-4 sm:mb-0 sm:mr-6 overflow-hidden rounded-md border-4 border-white object-cover"
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
                {`${profileData.email}`}
              </h3>
            </div>
          </div>

          <div className="w-full sm:w-2/3 lg:w-full pl-0 sm:pl-8">
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
              <p className="text-sm mt-2 text-gray-500 mb-4">
                The price includes GST at {calculateGSTPercentage()}% rate.
              </p>
              <button
                className="bg-teal-600 mt-4 w-full h-10 text-white p-2 rounded-md hover:bg-teal-700 transition duration-300"
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