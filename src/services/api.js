import axiosLib from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY;

const stage = 'Prod/';
const CITY_ENDPOINT = 'https://qz9m2zyb86.execute-api.eu-west-1.amazonaws.com/';
const RANDOM_ENDPOINT = 'https://ud6ordd6r1.execute-api.eu-west-1.amazonaws.com/';
const commonHeaders = {
    'Content-Type': 'application/json',
    'X-Api-Key': API_KEY,
};

const axiosCity = axiosLib.create({
    baseURL: CITY_ENDPOINT,
    timeout: 10000,
    headers: commonHeaders,
});

const axiosRandom = axiosLib.create({
    baseURL: RANDOM_ENDPOINT,
    timeout: 10000,
    headers: commonHeaders,
});

export const saveRandomScore = (randomUserResultToken, percent) =>
    axiosRandom.post(stage, {
        randomUserResultToken,
        percent,
    });
export const saveCityScore = (city, randomUserResultToken, percent) =>
    axiosCity.post(stage, {
        city,
        randomUserResultToken,
        percent,
    });
export const loadBestCityScore = city =>
    axiosCity.get(stage, {
        params: {
            city,
        },
    });
export const loadBestRandomScore = () => axiosRandom.get(stage);
