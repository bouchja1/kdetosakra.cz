import { crCities } from '../data/cr';

const EARTH_RADIUS = 6371000; /* meters  */
const DEG_TO_RAD = Math.PI / 180.0;
const THREE_PI = Math.PI * 3;
const TWO_PI = Math.PI * 2;

const isFloat = n => {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

const recursiveConvert = (input, callback) => {
    if (input instanceof Array) {
        return input.map(el => recursiveConvert(el, callback));
    }
    if (input instanceof Object) {
        input = JSON.parse(JSON.stringify(input));
        for (const key in input) {
            if (input?.[key]) {
                input[key] = recursiveConvert(input[key], callback);
            }
        }
        return input;
    }
    if (isFloat(input)) {
        return callback(input);
    }

    return null;
};

const toRadians = input => {
    return recursiveConvert(input, val => val * DEG_TO_RAD);
};

const toDegrees = input => {
    return recursiveConvert(input, val => val / DEG_TO_RAD);
};

/*
coords is an object: {latitude: y, longitude: x}
toRadians() and toDegrees() convert all values of the object
*/
const pointAtDistance = (inputCoords, distance) => {
    const result = {};
    const coords = toRadians(inputCoords);
    const sinLat = Math.sin(coords.latitude);
    const cosLat = Math.cos(coords.latitude);

    /* go fixed distance in random direction*/
    const bearing = Math.random() * TWO_PI;
    const theta = distance / EARTH_RADIUS;
    const sinBearing = Math.sin(bearing);
    const cosBearing = Math.cos(bearing);
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    result.latitude = Math.asin(sinLat * cosTheta + cosLat * sinTheta * cosBearing);
    result.longitude = coords.longitude + Math.atan2(sinBearing * sinTheta * cosLat, cosTheta - sinLat * Math.sin(result.latitude));
    /* normalize -PI -> +PI radians */
    result.longitude = ((result.longitude + THREE_PI) % TWO_PI) - Math.PI;

    return toDegrees(result);
};

export const roundToTwoDecimal = value => {
    return Math.round(value * 100) / 100;
};

export const pointInCircle = (coord, distance) => {
    const rnd = Math.random();
    // use square root of random number to avoid high density at the center
    const randomDist = Math.sqrt(rnd) * distance;
    return pointAtDistance(coord, randomDist);
};

export const decryptEmail = encoded => {
    const address = atob(encoded);
    return `mailto:${address}`;
};

export const generateRandomRadius = () => {
    const RANDOM_RADIUS_ARRAY = [0.05, 0.1, 0.3, 0.5, 1.0];
    return RANDOM_RADIUS_ARRAY[Math.floor(Math.random() * (0, RANDOM_RADIUS_ARRAY.length - 1))];
};

export const getRandomCzechPlace = () => {
    let randomCity = crCities[Math.floor(Math.random() * crCities.length)];
    randomCity = {
        ...randomCity,
        coordinates: {
            latitude: randomCity.latitude,
            longitude: randomCity.longitude,
        },
    };
    return randomCity;
};

export const generatePlaceInRadius = (radius, locationCity) => {
    radius *= 1000; // to meters
    const generatedPlace = pointInCircle(
        {
            longitude: locationCity.coordinates.longitude,
            latitude: locationCity.coordinates.latitude,
        },
        radius,
    );
    return generatedPlace;
};

export const RADIUS_DESCRIPTION = 'Poloměr kružnice, ve které se náhodně vygeneruje panorama (středem je dle zvoleného módu buď centrum obce nebo vaše poloha).';
