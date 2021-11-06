(function(){

  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(function(position){

			let lat = position.coords.latitude;
			let lon = position.coords.longitude;
			let container = document.querySelector('#text-container');
			let select = document.getElementById('crimes');

			// if browser does not support map box.
			if (!mapboxgl.supported()) {
					alert('Your browser does not support Mapbox GL');

			}else {

				// sign up for account at mapbox to get secret key and public key to test. https://docs.mapbox.com/help/getting-started/
				mapboxgl.accessToken = '';

				const map = new mapboxgl.Map({
						container: 'map',
						style: 'mapbox://styles/mapbox/streets-v11',
						center: [`${lon}`, `${lat}`],
						zoom: 15
				});

				//police api request data object
				var requestOptions = {
						method: 'GET',
						redirect: 'follow'
				};

				// send request to police api
				const fetchPolice = fetch(`https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lon}&date=2020-09`, requestOptions);

				// send request to mapbox api
				const fetchMap = fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?&access_token=${mapboxgl.accessToken}`)

				// Use promise all to get data for both apis
				// promise all accepts array.
				Promise.all([fetchPolice,fetchMap])
				.then(values => {
						// loop over values in array of both responses. convert each element in array to json. return converted array of responses.
						return Promise.all(values.map(element => element.json()));
				})
				.then( ([policeData, mapData]) => {	// deconstruct value variable array of json values from both responses.

					// event listener for crime select element
					select.addEventListener('change', (event) => {

						//get all elements created if they already exist
						let list = document.getElementsByClassName('title');

						//if elements already exists remove them to be replaced by new elements.
						if(list){
							Array.from(list).forEach(e => e.remove() );
						}

						//loop over police data return from api
						for( let police of policeData){

							//compare event target value to police api value
							// thye are the same create element
							if(event.target.value === police.category ){

								console.log(police.category);

								// Create a element
								btn = document.createElement("H2");
								// add id
								btn.setAttribute("class", "title");
								// add text
								btn.innerHTML = `${police.category}`;
								// append element to container
								container.appendChild(btn);

							}
						}
					});
				});
			}
    });
	}
	else {

		alert("Geolocation is not supported by this browser.");

	}

})();
