import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';

const AuthForm = () => {
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [isForgetPassword, setIsForgetPassword] = useState(false);
    const [isPasswordReset, setIsPasswordReset] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    const [forgetPasswordEmail, setForgetPasswordEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const apiBaseURL = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMessage('');
    };

    const handleForgetPasswordChange = (e) => {
        setForgetPasswordEmail(e.target.value);
        setErrorMessage('');
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setIsForgetPassword(false);
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleForgetPasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiBaseURL}/users/forget-password`, { email: forgetPasswordEmail });
            setSuccessMessage(response.data.message);
            setErrorMessage('');
            setIsForgetPassword(false);
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'An error occurred. Please try again.');
            setSuccessMessage('');
        }
    };


    const handlePasswordResetSubmit = async (e) => {
        e.preventDefault();
        try {
            // Updated to use the new 'reset-generated-password' endpoint
            const response = await axios.post(`${apiBaseURL}/users/reset-generated-password`, {
                email: formData.email,
                oldPassword: formData.password,
                newPassword
            });
            setSuccessMessage(response.data.message);
            setErrorMessage('');
            setIsPasswordReset(false);
            //login(response.data, response.data.sessionId); // Update as needed
            navigate('/login');
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'An error occurred. Please try again.');
            setSuccessMessage('');
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isForgetPassword) {
            handleForgetPasswordSubmit(e);
            return;
        }
        const url = isLogin ? `${apiBaseURL}/users/login` : `${apiBaseURL}/users/register`;
        try {
            const response = await axios.post(url, formData);
            if (response.data) {
                if (isLogin) {
                    if (response.data.generated_password) {
                        setIsPasswordReset(true);
                        // You might want to store user's ID or email to use in handlePasswordResetSubmit
                    } else {
                        login(response.data, response.data.sessionId);
                        navigate('/bidsb2c');
                    }
                } else {
                    setSuccessMessage('Registration successful. Redirecting to login...');
                    setTimeout(() => {
                        setIsLogin(true);
                        setSuccessMessage('');
                    }, 3000);
                }
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'An error occurred. Please try again.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-200">
            <div className="" style={{ width: "400px" }}>
                {isPasswordReset && (
                    <form onSubmit={handlePasswordResetSubmit} className="bg-gray-50 p-6 rounded-full shadow-lg">
                        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
                        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <button
                            type="submit"
                            className="w-full p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300 ease-in-out"
                        >
                            Update Password
                        </button>
                    </form>
                )}
                {isForgetPassword && (
                    <form onSubmit={handleSubmit} className="bg-blue-50 p-6 rounded-md shadow-lg">
                        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
                        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email for password reset"
                            value={forgetPasswordEmail}
                            onChange={handleForgetPasswordChange}
                            required
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <button
                            type="submit"
                            className="w-full p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300 ease-in-out"
                        >
                            Send Reset Link
                        </button>
                        <button
                            onClick={() => setIsForgetPassword(false)}
                            className="text-blue-500 mt-4 cursor-pointer"
                        >
                            Back to Login
                        </button>
                    </form>
                )}

                {!isForgetPassword && (
                    <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
                        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
                        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
                        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="p-2 border border-gray-300 rounded"
                            />
                            <div className="text-sm">
                            </div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="p-2 border border-gray-300 rounded"
                            />
                            {!isLogin && (
                                <>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="p-2 border border-gray-300 rounded"
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="p-2 border border-gray-300 rounded"
                                    />
                                </>
                            )}
                            <button
                                type="submit"
                                className="w-full p-2 bg-yellow-400 font-semibold text-black rounded hover:bg-yellow-500 transition duration-300 ease-in-out"
                            >
                                {isLogin ? 'Login' : 'Register'}
                            </button>
                        </form>
                        <button onClick={toggleForm} className="text-blue-500 mt-4 cursor-pointer">
                            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                        </button>
                    </div>
                )}

                <div>
                    {!isForgetPassword && isLogin && (
                        <div className="text-sm mt-4">
                            <button
                                onClick={() => setIsForgetPassword(true)}
                                className="p-2 justify-center w-full bg-red-400 rounded-full font-semibold text-white"
                            >
                                Forgot password?
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthForm;








