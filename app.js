// user coords 
let lat;
let lng;

// Use Geolocation API of the navigator object to retrieve current user coordiantes
const navigator = window.navigator;

let positionPromise = new Promise(() => 
    navigator.geolocation.getCurrentPosition(getUserCoords));

positionPromise.then(console.log); // does not work! 

function getUserCoords(position) {
        const {latitude, longitude} = position.coords;
        lat = latitude;
        lng = longitude;
        //  url template to pass into the getCrimes function
        const url = `https://data.police.uk/api/crimes-at-location?&lat=${lat}&lng=${lng}`;
        console.log({url});
        return url;
};

// request location crime data from police API using user coordinates
function getCrimes(url) {
    fetch(url)
    .then((response) => response.json())
    .then(console.log);
}

// call the function with non-variable lat and lng to test access to API
getCrimes(`https://data.police.uk/api/crimes-at-location?&lat=51.5918737&lng=-0.0179151`);