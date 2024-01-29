const apiBaseURL = process.env.REACT_APP_API_URL;

export function createOrderItem(orderItem) {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(`${apiBaseURL}/api/order-items`, {
        method: 'POST',
        body: JSON.stringify(orderItem),
        headers: { 'content-type': 'application/json' },
      });
      const data = await response.json();
      resolve({ data });
    } catch (error) {
      resolve({ error: error.message || 'Failed to create order item' });
    }
  });
}

export function getOrderItemsByOrderId(orderId) {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(`${apiBaseURL}/api/orders/${orderId}/items`);
      const data = await response.json();
      resolve({ data });
    } catch (error) {
      resolve({ error: error.message || 'Failed to fetch order items' });
    }
  });
}

export function updateOrderItem(orderItemId, orderItemData) {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(`${apiBaseURL}/api/order-items/${orderItemId}`, {
        method: 'PUT',
        body: JSON.stringify(orderItemData),
        headers: { 'content-type': 'application/json' },
      });
      const data = await response.json();
      resolve({ data });
    } catch (error) {
      resolve({ error: error.message || 'Failed to update order item' });
    }
  });
}

export function deleteOrderItem(orderItemId) {
  return new Promise(async (resolve) => {
    try {
      await fetch(`${apiBaseURL}/api/order-items/${orderItemId}`, { method: 'DELETE' });
      resolve({ success: true });
    } catch (error) {
      resolve({ error: error.message || 'Failed to delete order item' });
    }
  });
}
