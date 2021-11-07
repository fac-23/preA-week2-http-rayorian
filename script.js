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
						// convert returned promises to json data by passing promises (which are arrays) into promise.all again and looping over arrays and applying .json() to each element of the array to return an array of json data .
						return Promise.all(values.map(element => element.json()));
				})
				.then( ([policeData, mapData]) => {	// deconstruct array of data from both apis responses.
					console.log(policeData, mapData)

					// event listener for crime select element
					select.addEventListener('change', (event) => {

						//get all elements created if they already exist
						let list = document.getElementsByClassName('title');

						//if elements already exists remove them to be replaced by new elements.
						if(list){
							Array.from(list).forEach(e => e.remove() );
						}

						//loop over police data return from api
						for( let i =0; i < policeData.length; i++){

							//compare event target value to police api value
							// thye are the same create element
							if(event.target.value === policeData[i].category ){

								// panel
								panel = document.createElement("SECTION");
								panel.setAttribute("class", "crime-panel");

								// title
								title = document.createElement("H2");
								title.setAttribute("class", "title");
								title.innerHTML = `${policeData[i].category.replace(/\-/g, ' ')}`;

								crimeDate = document.createElement("P");
								crimeDate.innerHTML = `${policeData[i].month}`;

								crimeLocation = document.createElement("P");
								crimeLocation.innerHTML = `${policeData[i].location.street.name}`;



								// append element
								panel.appendChild(title);
								panel.appendChild(crimeDate);
								panel.appendChild(crimeLocation);
								container.appendChild(panel);

								container.style.overflow = "scroll";
								container.style.height = "680px";

								//add markers
								const marker = new mapboxgl.Marker()
								.setLngLat([`${policeData[i].location.longitude}`, `${policeData[i].location.latitude}`])
								.addTo(map);



							}
						}
					});

				}).catch((status)=>{
					console.log(status)
				});
			}
    });
	}
	else {

		alert("Geolocation is not supported by this browser.");

	}

})();
