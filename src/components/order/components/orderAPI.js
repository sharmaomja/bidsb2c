//orderAPI
const apiBaseURL = process.env.REACT_APP_API_URL;

export function createOrder(order) {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(`${apiBaseURL}/api/orders`, {
        method: 'POST',
        body: JSON.stringify(order),
        headers: { 'content-type': 'application/json' },
      });
      const data = await response.json();
      resolve({ data });
    } catch (error) {
      resolve({ error: error.message || 'Failed to create order' });
    }
  });
}

export function getOrders(userId) {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(`${apiBaseURL}/api/orders/user/${userId}`);
      const data = await response.json();
      console.log(data);
      resolve({ data });
    } catch (error) {
      resolve({ error: error.message || 'Failed to fetch orders' });
    }
  });
}

export function getOrderById(orderId) {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(`${apiBaseURL}/api/orders/${orderId}`);
      const data = await response.json();
      resolve({ data });
    } catch (error) {
      resolve({ error: error.message || 'Failed to fetch order' });
    }
  });
}

export function updateOrder(orderId, orderData) {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(`${apiBaseURL}/api/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify(orderData),
        headers: { 'content-type': 'application/json' },
      });
      const data = await response.json();
      resolve({ data });
    } catch (error) {
      resolve({ error: error.message || 'Failed to update order' });
    }
  });
}

export function deleteOrder(orderId) {
  return new Promise(async (resolve) => {
    try {
      await fetch(`${apiBaseURL}/api/orders/${orderId}`, { method: 'DELETE' });
      resolve({ success: true });
    } catch (error) {
      resolve({ error: error.message || 'Failed to delete order' });
    }
  });
}
