import {createSlice} from '@reduxjs/toolkit'

export const ConfigSlice = createSlice({
    name: 'config',
    initialState: {
        configData: null,
        paramsData: null,
        initializing: true,
        authorized: false,
    },

    reducers: {
        setConfigData: (state, {payload}) => {
            state.configData = payload;
        },

        setParamsData: (state, {payload}) => {
            state.paramsData = payload;
        },

        setInitializing: (state, {payload}) => {
            state.initializing = payload;
        },

        setAuthorized: (state, {payload}) => {
            state.authorized = payload;
        }
    }
})

export const {setConfigData, setParamsData, setInitializing, setAuthorized} = ConfigSlice.actions;
export default ConfigSlice.reducer