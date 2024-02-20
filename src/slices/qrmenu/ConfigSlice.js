import { createSlice } from "@reduxjs/toolkit";

export const ConfigSlice = createSlice({
    name: 'config',
    initialState: {
        theme: 0,
        apiData: null,
        configData: null,
        isAuthorized: false,
        fetchingJson: true,
        lastScroll: 0
    },
    reducers: {
        setTheme: (state, {payload}) => {
            state.theme = payload;
        },

        setApiData: (state, {payload}) => {
            state.apiData = payload;
        },

        setIsAuthorized: (state, {payload}) => {
            state.isAuthorized = payload;
        },

        setConfigData: (state, {payload}) => {
            state.configData = payload
        },

        setFetchingJson: (state, {payload}) => {
            state.fetchingJson = payload
        },

        setLastScroll: (state, {payload}) => {
            state.lastScroll = payload
        }
    }
})


export const {setApiData, setConfigData, setIsAuthorized, setFetchingJson, setTheme, setLastScroll} = ConfigSlice.actions;
export default ConfigSlice.reducer;