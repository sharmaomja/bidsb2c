import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addToWishlist, deleteItemFromWishlist, fetchWishlistItemsByUserId } from './wishlistAPI';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

export const addToWishlistAsync = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ item, userId }) => {
    const response = await addToWishlist(item, userId);
    return response;
  }
);

export const fetchWishlistItemsByUserIdAsync = createAsyncThunk(
  'wishlist/fetchWishlistItemsByUserId',
  async (userId) => {
    const response = await fetchWishlistItemsByUserId(userId);
    return response;
  }
);

export const deleteItemFromWishlistAsync = createAsyncThunk(
  'wishlist/deleteItemFromWishlist',
  async (itemId) => {
    await deleteItemFromWishlist(itemId);
    return itemId;
  }
);

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistItemsByUserIdAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishlistItemsByUserIdAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchWishlistItemsByUserIdAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteItemFromWishlistAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const selectWishlistItems = (state) => state.wishlist.items;

export default wishlistSlice.reducer;
