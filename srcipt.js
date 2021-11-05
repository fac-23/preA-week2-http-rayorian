



let container = document.querySelector('#text-container');


mapboxgl.accessToken = '';

const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
//center: [`${lon}`, `${lat}`],            
center: [-79.4512, 43.6568],
zoom: 13
});
// Return a LngLat object such as {lng: 0, lat: 0}.         
const bounds = map.getBounds();

console.log(bounds._sw.lat, bounds._sw.lng);

let long = bounds._sw.lng;
let lat = bounds._sw.lat;

// Add the control to the map.
const geocoder = new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
mapboxgl: mapboxgl
});

document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch(`https://data.police.uk/api/crimes-at-location?lat=${lat}&lng=${long}`, requestOptions)
    .then(response => response.json())
    .then(result => {
        let html = '';

        let lon = "";
        let lat = "";
        //console.log(result);
        result.forEach(element => {
            
            html = `
                            
                <h2>${element.location.latitude}</h2>
                <h2>${element.location.longitude}</h2>
                <h2>${element.outcome_status.category}</h2>
                <h2>${element.location.street.name}</h2>
                
            `;
            
            lat = element.location.latitude;
            lon = element.location.longitude;

        });

        container.innerHTML = html; 
            
    })
    .catch(error => console.log('error', error));

