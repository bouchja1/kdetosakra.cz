const EARTH_RADIUS = 6371000; /* meters  */
const DEG_TO_RAD = Math.PI / 180.0;
const THREE_PI = Math.PI * 3;
const TWO_PI = Math.PI * 2;

function isFloat(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function recursiveConvert(input, callback) {
    if (input instanceof Array) {
        return input.map(el => recursiveConvert(el, callback));
    }
    if (input instanceof Object) {
        input = JSON.parse(JSON.stringify(input));
        for (let key in input) {
            if (input.hasOwnProperty(key)) {
                input[key] = recursiveConvert(input[key], callback);
            }
        }
        return input;
    }
    if (isFloat(input)) {
        return callback(input);
    }
}

function toRadians(input) {
    return recursiveConvert(input, val => val * DEG_TO_RAD);
}

function toDegrees(input) {
    return recursiveConvert(input, val => val / DEG_TO_RAD);
}

/*
coords is an object: {latitude: y, longitude: x}
toRadians() and toDegrees() convert all values of the object
*/
function pointAtDistance(inputCoords, distance) {
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
    result.longitude =
        coords.longitude + Math.atan2(sinBearing * sinTheta * cosLat, cosTheta - sinLat * Math.sin(result.latitude));
    /* normalize -PI -> +PI radians */
    result.longitude = ((result.longitude + THREE_PI) % TWO_PI) - Math.PI;

    return toDegrees(result);
}

export function roundToTwoDecimal(value) {
    return Math.round(value * 100) / 100;
}

export function pointInCircle(coord, distance) {
    const rnd = Math.random();
    /*use square root of random number to avoid high density at the center*/
    const randomDist = Math.sqrt(rnd) * distance;
    return pointAtDistance(coord, randomDist);
}

export const DEFAUL_MARKER_PLACE_ICON = 'https://kdetosakra.cz/questionmark.png';
export const DEFAUL_MARKER_ICON = 'https://kdetosakra.cz/marker.png';
export const TOTAL_ROUNDS_MAX = 2;
