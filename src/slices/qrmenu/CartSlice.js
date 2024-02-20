import { createSlice } from "@reduxjs/toolkit";

export const CartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartList: [],
        billNo: 0,
        tableHeaderSyskey: ""
    },
    reducers: {
        setCartList: (state, {payload}) => {
            state.cartList = payload
        },

        addToCart: (state, {payload}) => {
            state.cartList = [...state.cartList, ...payload];
        },

        setBillNo: (state, {payload}) => {
            state.billNo = payload;
        },

        setTableHeaderSyskey: (state, {payload}) => {
            state.tableHeaderSyskey = payload;
        }
    }
})

export const {setCartList, addToCart, setBillNo, setTableHeaderSyskey} = CartSlice.actions;
export default CartSlice.reducer;