import { createSlice } from "@reduxjs/toolkit";

export const MenuSlice = createSlice({
    name: "menu",
    initialState: {
        menuList: {},
        currentMenuList: [],
        detailMenu: {},
        isFetchingMenu: false
    },
    reducers: {
        setMenuList: (state, {payload}) => {
            state.menuList = payload;
        },

        setCurrentMenuList: (state, {payload}) => {
            state.currentMenuList = payload;
        },

        setDetailMenu: (state, {payload}) => {
            state.detailMenu = payload
        },

        setIsFetchingMenu: (state, {payload}) => {
            state.isFetchingMenu = payload;
        }
    }
})

export const {setMenuList, setDetailMenu, setIsFetchingMenu, setCurrentMenuList} = MenuSlice.actions;
export default MenuSlice.reducer;