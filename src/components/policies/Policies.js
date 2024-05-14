import React from 'react';
import { useNavigate } from 'react-router-dom';
import termsandcondition from '../../assets/tnc.png';
import privacypolicy from '../../assets/privacypolicy.png';
import returnpolicy from '../../assets/returnpolicy.png';
import shippingpolicy from '../../assets/shippingpolicy.png';

const Policies = () => {
  const navigate = useNavigate();

  const policies = [
    { title: 'Terms and Conditions', path: '/t&c', icon: termsandcondition },
    { title: 'Shipping Policy', path: '/shipping_policy', icon: shippingpolicy },
    { title: 'Refund Policy', path: '/refund_policy', icon: returnpolicy },
    { title: 'Privacy Policy', path: '/privacy_policy', icon: privacypolicy },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-8">
      <h1 className="text-3xl font-bold text-center mb-12">Our Policies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {policies.map((policy, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer"
            onClick={() => navigate(policy.path)}
          >
            <div className="flex items-center justify-center mb-4">
              <img src={policy.icon} alt={`${policy.title} icon`} className="w-16 h-16" />
            </div>
            <h2 className="text-lg font-semibold text-center">{policy.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Policies;
