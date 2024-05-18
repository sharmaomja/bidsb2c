import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addToCart, deleteItemFromCart, fetchItemsByUserId, resetCart, updateCart } from './cartAPI';

const apiBaseURL = process.env.REACT_APP_API_URL;
const initialState = {
  status: 'idle',
  items: [],
};

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async (item) => {
    const response = await addToCart(item);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const fetchItemsByUserIdAsync = createAsyncThunk(
  'cart/fetchItemsByUserId',
  async (userId) => {
    try {
      const response = await fetchItemsByUserId(userId);
      
      if (response.data) {
        // Assuming response.data is an array of items
        const itemsWithDiscount = response.data.map(item => ({
          ...item,
          // Check both property names for product description
          productDescription: item.productDescription || item.productDescriptiom,
          discountedPrice: item.discountedPrice // Assuming discountedPrice is returned by the backend
        }));
        return itemsWithDiscount;
      } else {
        throw new Error(response.error.message || 'Failed to fetch cart items');
      }
    } catch (error) {
      throw error;
    }
  }
);

export const updateCartAsync = createAsyncThunk(
  'cart/updateCart',
  async (update) => {
    const response = await updateCart(update);
    return response.data;
  }
);

export const deleteItemFromCartAsync = createAsyncThunk(
  'cart/deleteItemFromCart',
  async (itemId) => {
    const response = await deleteItemFromCart(itemId);
    return response.data;
  }
);

export const resetCartAsync = createAsyncThunk(
  'cart/resetCart',
  async (userId) => {
    const response = await resetCart(userId);
    return response.data;
  }
);

// Add a new thunk action to fetch cart details including coupon information
export const fetchCartDetailsAsync = createAsyncThunk(
  'cart/fetchCartDetails',
  async (userId, { dispatch, getState }) => {
    try {
      const cartResponse = await fetch(`${apiBaseURL}/api/user/${userId}/shopping-cart`);
      if (!cartResponse.ok) {
        throw new Error('Failed to fetch cart details');
      }

      const cartDetails = await cartResponse.json();

      let appliedCoupon = null;
      let discountAmount = 0;

      if (cartDetails.appliedOfferId) {
        const offerResponse = await fetch(`${apiBaseURL}/offers/${cartDetails.appliedOfferId}`);
        if (!offerResponse.ok) {
          throw new Error('Failed to fetch offer details');
        }

        const offerDetails = await offerResponse.json();
        appliedCoupon = offerDetails.couponCode;

        // Calculating the discount amount
        const totalBeforeDiscount = parseFloat(cartDetails.TotalBeforeDiscount);
        const finalTotal = parseFloat(cartDetails.finalTotal.finalTotal);
        discountAmount = totalBeforeDiscount - finalTotal;
      }

      return {
        appliedCoupon: appliedCoupon,
        discountAmount: discountAmount.toFixed(2) // Keeping two decimal places
      };
    } catch (error) {
      console.error('Error in fetchCartDetailsAsync:', error);
      throw error;
    }
  }
);



  


export const counterSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    setAppliedCoupon: (state, action) => {
      state.appliedCoupon = action.payload;
    },
    setDiscountAmount: (state, action) => {
      state.discountAmount = action.payload;
    },
    removeAppliedCoupon: (state) => {
      state.appliedCoupon = null;
      state.discountAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartDetailsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartDetailsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.appliedCoupon = action.payload.appliedCoupon; // Assuming this is the structure
        state.discountAmount = action.payload.discountAmount;
      }) // Removed the closing parenthesis from here
      .addCase(addToCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items.push(action.payload);
      })
      .addCase(fetchItemsByUserIdAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchItemsByUserIdAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(updateCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCartAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...action.payload
          };
        }
      })
      .addCase(deleteItemFromCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteItemFromCartAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const itemIdToDelete = action.payload?.data?.id; // Use optional chaining to avoid errors
        if (itemIdToDelete) {
          const index = state.items.findIndex(item => item.id === itemIdToDelete);
          if (index !== -1) {
            state.items.splice(index, 1);
          }
        }
      })
      .addCase(resetCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resetCartAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = []
      })
  },
});


export const { increment, setAppliedCoupon, setDiscountAmount, removeAppliedCoupon } = counterSlice.actions;

export const selectItems = (state) => state.cart.items;

export default counterSlice.reducer;
