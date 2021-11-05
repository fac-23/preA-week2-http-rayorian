(function(){

  if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(function(position){

        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        console.log(lat, lon)

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
                center: [`${lon}`, `${lat}`],
                zoom: 15
            });

            // Add the control to the map.
            const geocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl
            });

            //append search text input to div element with id geocoder
            document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


            //police api request data object
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            // send request to police api
            const fetchPolice = fetch(`https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lon}`, requestOptions);

            // send request to mapbox api
            const fetchMap = fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?&access_token=${mapboxgl.accessToken}`)

            // Use promise all to get data for both apis
            // promise all accepts array.
            Promise.all([fetchPolice,fetchMap])
            .then(values => {
                // loop over values in array of both responses. convert each element in array to json. return converted array of responses.
                return Promise.all(values.map(element => element.json()));
            })
            .then( ([policeData, mapData]) => {
                // value variable is now an array of  json values from both responses. value can also be deconstructed to
                console.log(policeData)
                let html = '';

                for(element of policeData ){

                    html = `
                            <h2>${element.category}</h2>
                            <h2>${element.location.longitude}</h2>
                            <h2>${element.location.latitude}</h2>
                            <h2>${element.month}</h2>
                            <h2>${element.location.street.name}</h2>
                        `;

                }
                container.innerHTML = html;


            });


        }
    });
	}
	else {

		alert("Geolocation is not supported by this browser.");

	}

})();
