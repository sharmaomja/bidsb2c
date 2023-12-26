import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createOrder, getOrders, getOrderById, updateOrder, deleteOrder } from './orderAPI';

const initialState = {
  orders: [],
  status: 'idle',
  currentOrder: null,
};

export const createOrderAsync = createAsyncThunk(
  'order/createOrder',
  async (order) => {
    const response = await createOrder(order);
    return response.data;
  }
);

export const getOrdersAsync = createAsyncThunk(
  'order/getOrders',
  async (userId) => {
    const response = await getOrders(userId);
    return response.data;
  }
);

export const getOrderByIdAsync = createAsyncThunk(
  'order/getOrderById',
  async (orderId) => {
    const response = await getOrderById(orderId);
    return response.data;
  }
);

export const updateOrderAsync = createAsyncThunk(
  'order/updateOrder',
  async ({ orderId, orderData }) => {
    const response = await updateOrder(orderId, orderData);
    return response.data;
  }
);

export const deleteOrderAsync = createAsyncThunk(
  'order/deleteOrder',
  async (orderId) => {
    await deleteOrder(orderId);
    return orderId;
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.orders.push(action.payload);
        state.currentOrder = action.payload;
      })
      .addCase(getOrdersAsync.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.status = 'idle';
      })
      .addCase(getOrderByIdAsync.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.status = 'idle';
      })
      .addCase(updateOrderAsync.fulfilled, (state, action) => {
        const updatedOrderIndex = state.orders.findIndex((order) => order.id === action.payload.id);
        if (updatedOrderIndex !== -1) {
          state.orders[updatedOrderIndex] = action.payload;
        }
        state.currentOrder = action.payload;
        state.status = 'idle';
      })
      .addCase(deleteOrderAsync.fulfilled, (state, action) => {
        state.orders = state.orders.filter((order) => order.id !== action.payload);
        state.currentOrder = null;
        state.status = 'idle';
      });
  },
});

export const { resetOrder } = orderSlice.actions;

export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectOrders = (state) => state.order.orders;

export default orderSlice.reducer;
