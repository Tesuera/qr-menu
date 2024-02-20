import { createSlice } from "@reduxjs/toolkit";

export const CategorySlice = createSlice({
    name: 'category',
    initialState: {
        catList: null,
        currentlyActive: null,
        isFetchingCat: false
    },
    reducers: {
        setCatList: (state, {payload}) => {
            state.catList = payload
        },

        setCurrentlyActive: (state, {payload}) => {
            state.currentlyActive = payload
        },

        setIsFetchingCat: (state, {payload}) => {
            state.isFetchingCat = payload;
        }
    }
})


export const {setCatList, setCurrentlyActive, setIsFetchingCat} = CategorySlice.actions;
export default CategorySlice.reducer;