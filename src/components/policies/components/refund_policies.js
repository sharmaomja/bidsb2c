import React from 'react';

const RefundPolicies = () => (
  <div className="bg-gray-100 py-8">
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Refund and Replacement Policy for BidsB2C</h1>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Introduction</h2>
      <p className="text-gray-600 mb-4">At BidsB2C, we strive to ensure that all our customers are satisfied with their purchases. However, if you are not satisfied with your purchase, here are the details regarding our refund and replacement policies.</p>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Refund Policy</h2>
      <ul className="list-disc ml-6 text-gray-600 mb-4">
        <li><strong>Eligibility for Refund:</strong> You can request a refund within 7 days of receiving the item if the item is defective, not as described, or damaged during transit.</li>
        <li><strong>Condition of Items:</strong> Items must be returned in their original condition and packaging. Items that have been used, altered, or damaged by the customer are not eligible for a refund.</li>
        <li><strong>Process:</strong> To initiate a refund, please contact our customer service team with your order number, details of the item, and the reason for the return. We will provide you with further instructions on how to proceed.</li>
        <li><strong>Refund Method:</strong> Refunds will be processed to the original method of payment within 14 days of receiving the returned item.</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Replacement Policy</h2>
      <ul className="list-disc ml-6 text-gray-600 mb-4">
        <li><strong>Eligibility for Replacement:</strong> Items are eligible for replacement if they are defective, received damaged, or incorrect.</li>
        <li><strong>Process:</strong> Contact our customer support with details of the issue. If a replacement is warranted, we will arrange for the item to be collected and a replacement to be sent to you.</li>
        <li><strong>Time Frame:</strong> Replacement items will be dispatched as soon as the original item has been received and inspected.</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Custom and Auctioned Items</h2>
      <ul className="list-disc ml-6 text-gray-600 mb-4">
        <li><strong>Custom Items:</strong> Custom-made or personalized items are only eligible for replacement or refund if they arrive damaged or defective.</li>
        <li><strong>Auction Items:</strong> All sales of items purchased through auctions are final, except in cases where the item arrives damaged, defective, or significantly not as described.</li>
      </ul>
    </div>
  </div>
);

export default RefundPolicies;
