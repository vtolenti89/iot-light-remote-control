import { useContext } from 'react';
import axios from "axios";
import { AppContext } from './../AppContextProvider';

const protocol = 'http://';

const get = (endpoint: string) => {

    return axios({
        method: "GET",
        url: protocol + endpoint,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            // 'Content-Type': 'text/html'
        },
    })
        .then((response) => {
            return isResponseValid(response)
        })
        .catch((error) => {
            console.log(error)
            throw error;
        })
}

/**
 * POST Request
 * @param {*} endpoint 
 * @param {*} data 
 * @param {*} that 
 * @param {*} context 
 */
const post = (endpoint: string, data: Object = {}) => {
    return axios({
        method: "POST",
        url: protocol + endpoint,
        data,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            return isResponseValid(response)
        })
        .catch(error => {
            console.error(error)
            throw error;
        })
}


/**
 * Check whether the response is valid
 * @param {Object} response 
 */
const isResponseValid = (response: any) => {
    if (response.status === 200) {
        return response.data
    }
    throw response
}


export const apiService = {
    get,
    post
};