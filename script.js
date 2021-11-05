
let container = document.querySelector('#text-container');

// if browser does not support map box.
if (!mapboxgl.supported()) {

    alert('Your browser does not support Mapbox GL');
    
} else {
    // sign up for account at mapbox to get secret key and public key to test. https://docs.mapbox.com/help/getting-started/
    mapboxgl.accessToken = '';

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',           
        center: [-79.4512, 43.6568],
        zoom: 13
    });
                    
    // Initialize the GeolocateControl.
    const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
    });

    // Add the control to the map.
    map.addControl(geolocate);
    // Set an event listener that fires
    // when a geolocate event occurs.
    geolocate.on('geolocate', () => {
        console.log('A geolocate event has occurred.');
    });

    // Add the control to the map.
    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    });

    //append search text input to div element with id geocoder
    document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


    //police api
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    // send request to police api
    const fetchPolice = fetch(`https://data.police.uk/api/crimes-street/all-crime?lat=52.629729&lng=-1.131592`, requestOptions);

    // send request to mapbox api
    const fetchMap = fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/chester.json?proximity=-74.70850,40.78375&access_token=${mapboxgl.accessToken}`)

    // Use promise all to get data for both apis
    // promise all accepts array. 
    Promise.all([fetchPolice,fetchMap])
    .then(values => {
        // loop over values in array of both responses. convert each element in array to json. return converted array of responses.  
        return Promise.all(values.map(r => r.json()));
    }) // value variable is now an array of  json values from both responses
    .then(value => console.log(value));
    
    

}