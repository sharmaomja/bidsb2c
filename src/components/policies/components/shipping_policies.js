import React from 'react';

const ShippingPolicies = () => (
  <div className="bg-gray-100 py-8">
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Shipping Policy for BidsB2C</h1>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Introduction</h2>
      <p className="text-gray-600 mb-4">At BidsB2C, we partner with reliable third-party shipping companies to ensure your items arrive safely and on time. Here is how our shipping process works:</p>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Shipping Methods and Costs</h2>
      <ul className="list-disc ml-6 text-gray-600 mb-4">
        <li><strong>Carriers:</strong> We use various trusted carriers to ship our products, including Blue Dart, XpressBee, Delhivery, India Post, etc.</li>
        <li><strong>Shipping Costs:</strong> Shipping costs are calculated based on the size, weight, and destination of your order. The final shipping cost will be displayed at checkout.</li>
        <li><strong>International Shipping:</strong> We offer international shipping; however, international orders may be subject to customs duties and taxes which are the responsibility of the customer.</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Delivery Times</h2>
      <ul className="list-disc ml-6 text-gray-600 mb-4">
        <li><strong>Processing Time:</strong> Orders typically take 1-3 business days to process before they are shipped.</li>
        <li><strong>Estimated Delivery:</strong> Delivery times vary based on the destination and the shipping method chosen. Standard delivery within the country usually takes 3-7 business days, while international delivery may take 10-20 business days.</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Tracking</h2>
      <p className="text-gray-600 mb-4">Once your order is shipped, you will receive a tracking number via email. You can use this number to track your order through the carrier’s website.</p>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Risk of Loss</h2>
      <p className="text-gray-600 mb-4">All items purchased from BidsB2C are made pursuant to a shipment contract. This means that the risk of loss and title for such items pass to you upon our delivery to the carrier.</p>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Shipping Issues</h2>
      <ul className="list-disc ml-6 text-gray-600 mb-4">
        <li><strong>    Damaged Items:</strong> If you receive a damaged item, please contact us immediately so we can work with the carrier to resolve the issue.</li>
        <li><strong>    Lost Packages:</strong> If your package is lost in transit, please contact us and we will assist in tracking it down or arrange a replacement or refund where appropriate.</li>
      </ul>
    </div>
  </div>
);

export default ShippingPolicies;
