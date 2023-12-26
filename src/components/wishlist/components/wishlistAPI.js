const apiBaseURL = process.env.REACT_APP_API_URL;

export async function addToWishlist(item, userId) {
  const wishlistResponse = await fetch(`${apiBaseURL}/wishlist/${userId}`);
  const wishlistData = await wishlistResponse.json();

  if (!wishlistResponse.ok) {
    throw new Error('Error fetching wishlist');
  }

  let wishlistId = wishlistData.wishlistId;
  if (!wishlistId) {
    const newWishlistResponse = await fetch(`${apiBaseURL}/wishlist`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!newWishlistResponse.ok) {
      throw new Error('Error creating new wishlist');
    }

    const newWishlistData = await newWishlistResponse.json();
    wishlistId = newWishlistData.wishlistId;
  }

  const response = await fetch(`${apiBaseURL}/wishlist-items`, {
    method: 'POST',
    body: JSON.stringify({ wishlistId, productId: item.productId }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Error adding item to wishlist');
  }

  return response.json();
}

export async function fetchWishlistItemsByUserId(userId) {
  const response = await fetch(`${apiBaseURL}/api/wishlist/${userId}/items`);

  if (!response.ok) {
    throw new Error('Error fetching wishlist items');
  }

  return response.json();
}

export async function deleteItemFromWishlist(itemId) {
  const response = await fetch(`${apiBaseURL}/api/wishlist/item/${itemId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Error deleting item from wishlist');
  }
}
