import axios from "axios"

export const getRequest = (url, options) => {
    return axios.get(url, options);
}

export const postRequest = (url, body, options) => {
    return axios.post(url, body, options);
}