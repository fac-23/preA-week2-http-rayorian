// Use navigator object to retrieve current user coordiantes
const lat = 51.591577;
const lng = -0.0201425;
// return a url to pass into the getCrimes function

// request street crime data from police API using user coordinates

const userLocation = `https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lng}`;

function getCrimes(userLocation) {
    fetch(userLocation)
    .then((response) => response.json())
    .then(console.log);
} 

// getCrimes(userLocation);

// try making neighbourhood boundary request
fetch(`https://data.police.uk/api/leicestershire/NC04/boundary`)
.then((response) => response.json())
.then(console.log);
