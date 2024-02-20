import {createSlice} from '@reduxjs/toolkit'

export const OrderSlice = createSlice({
    name: 'order',
    initialState: {
        fetchingOrders: false,
        orderList: []
    },

    reducers: {
        setOrderList: (state, {payload}) => {
            state.orderList = payload;
        },

        setFetchingOrders: (state, {payload}) => {
            state.fetchingOrders = payload;
        }
    }
})

export const {setOrderList, setFetchingOrders} = OrderSlice.actions;
export default OrderSlice.reducer