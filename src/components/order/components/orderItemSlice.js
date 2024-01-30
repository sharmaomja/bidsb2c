import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createOrderItem, getOrderItemsByOrderId, updateOrderItem, deleteOrderItem } from './orderItemAPI';

const initialState = {
  orderItems: [],
  status: 'idle',
};

export const createOrderItemAsync = createAsyncThunk('orderItem/createOrderItem', async (orderItem) => {
  const response = await createOrderItem(orderItem);
  return response.data;
});

export const getOrderItemsByOrderIdAsync = createAsyncThunk('orderItem/getOrderItemsByOrderId', async (orderId) => {
  const response = await getOrderItemsByOrderId(orderId);
  return response.data;
});

export const updateOrderItemAsync = createAsyncThunk('orderItem/updateOrderItem', async ({ orderItemId, orderItemData }) => {
  const response = await updateOrderItem(orderItemId, orderItemData);
  return response.data;
});

export const deleteOrderItemAsync = createAsyncThunk('orderItem/deleteOrderItem', async (orderItemId) => {
  await deleteOrderItem(orderItemId);
  return orderItemId; // Return the orderItemId on successful deletion
});

export const orderItemSlice = createSlice({
  name: 'orderItem',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrderItemAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrderItemAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.orderItems.push(action.payload);
      })
      .addCase(getOrderItemsByOrderIdAsync.fulfilled, (state, action) => {
        state.orderItems = action.payload;
        state.status = 'idle';
      })
      .addCase(updateOrderItemAsync.fulfilled, (state, action) => {
        // Update the corresponding order item in the state
        const updatedOrderItemIndex = state.orderItems.findIndex((item) => item.id === action.payload.id);
        if (updatedOrderItemIndex !== -1) {
          state.orderItems[updatedOrderItemIndex] = action.payload;
        }
        state.status = 'idle';
      })
      .addCase(deleteOrderItemAsync.fulfilled, (state, action) => {
        // Remove the deleted order item from the state
        state.orderItems = state.orderItems.filter((item) => item.id !== action.payload);
        state.status = 'idle';
      });
  },
});

export const selectOrderItems = (state) => state.orderItem.orderItems;

export default orderItemSlice.reducer;
