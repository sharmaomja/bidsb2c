const apiBaseURL = process.env.REACT_APP_API_URL;

export function addToCart(cartId, productId, quantity) {
  return new Promise(async (resolve) => {
    try {
      const payload = {
        cartId,
        productId,
        quantity
      };
      const response = await fetch(`${apiBaseURL}/api/cart-items`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const errorData = await response.json();
        resolve({ error: errorData });
      }
    } catch (error) {
      resolve({ error: { message: error.message } });
    }
  });
}

export function fetchItemsByUserId(userId) {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(`${apiBaseURL}/api/user/${userId}/cart-products`);
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else if (response.status === 404) {
        resolve({ data: [] });
      } else {
        const errorData = await response.json();
        resolve({ error: errorData });
      }
    } catch (error) {
      resolve({ error: { message: error.message } });
    }
  });
}

export function updateCart(update) {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(`${apiBaseURL}/api/cart-items/${update.id}`, {
        method: 'PUT',
        body: JSON.stringify(update),
        headers: { 'content-type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const errorData = await response.json();
        resolve({ error: errorData });
      }
    } catch (error) {
      resolve({ error: { message: error.message } });
    }
  });
}

export function deleteItemFromCart(itemId) {
  return new Promise(async (resolve) => {
    try {
      console.log(itemId);
      const response = await fetch(`${apiBaseURL}/api/cart-items/${itemId}`, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        resolve({ data: { id: itemId } });
      } else {
        const errorData = await response.json();
        resolve({ error: errorData });
      }
    } catch (error) {
      resolve({ error: { message: error.message } });
    }
  });
}

export async function resetCart(userId) {
  return new Promise(async (resolve) => {
    const response = await fetch(`${apiBaseURL}/api/shopping-cart/${userId}`);
    const items = await response.json();
    for (let item of items) {
      await deleteItemFromCart(item.id);
    }
    resolve({ status: 'success' });
  });
}
