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

				var currentMarkers=[];
				// sign up for account at mapbox to get secret key and public key to test. https://docs.mapbox.com/help/getting-started/
				mapboxgl.accessToken = 'pk.eyJ1IjoicmF5b3JpYW5mYWMyMyIsImEiOiJja3Zwc25xNXAyY2VoMm50a2swYnp2dXFhIn0.lKM6McyWmA7lIHSSVQywhA';

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
						// convert returned promises to json data by passing promises (which are arrays) into promise.all again and looping over arrays and apply .json() to each element of the array then return an array as json data.
						return Promise.all(values.map(element => element.json()));		
				})
				.then( ([policeData, mapData]) => {	// deconstruct array of data from both apis responses.
					console.log(policeData, mapData);
					
					// hide loader notice
					const loader = document.querySelector('#loader');
					loader.classList.add('fade-out');
					
					// event listener for crime select element
					select.addEventListener('change', (event) => {

						//get all elements created if they already exist
						let list = document.getElementsByClassName('crime-panel');

						//if elements exists remove them to make space for new elements.
						if(list){
							Array.from(list).forEach(e => e.remove() );

						}

						// if markers exist remove markers from array to make space for new markers
						if (currentMarkers!==null) {
							for (var i = currentMarkers.length - 1; i >= 0; i--) {
								currentMarkers[i].remove();
							}
						}


						//loop over police data
						for( let i =0; i < policeData.length; i++){

							//compare event target value to police api category value
							// if true create elements to display data
							if(event.target.value === policeData[i].category ){

								// panel
								panel = document.createElement("SECTION");
								panel.setAttribute("class", "crime-panel");

								// title
								title = document.createElement("H2");
								title.setAttribute("class", "title");
								title.innerHTML = `${policeData[i].category.replace(/\-/g, ' ')}`;

								// crime date
								crimeDate = document.createElement("P");
								crimeDate.innerHTML = `${policeData[i].month}`;

								// crime location
								crimeLocation = document.createElement("P");
								crimeLocation.innerHTML = `${policeData[i].location.street.name}`;


								// append elements
								panel.appendChild(title);
								panel.appendChild(crimeDate);
								panel.appendChild(crimeLocation);
								container.appendChild(panel);

								//set a fixed height to text container and set overflow to scroll to hide overflow of the large amount of text returned from api and add a vertical scroll bar to enable scrolling.
								container.style.height = "680px";
								container.style.overflow = "scroll";

								//add markers
								const marker = new mapboxgl.Marker()
								.setLngLat([`${policeData[i].location.longitude}`, `${policeData[i].location.latitude}`])
								.setPopup(
									new mapboxgl.Popup({ offset: 25 }) // add popups
										.setHTML(
											`<h3>${policeData[i].category.replace(/\-/g, ' ')}</h3><p>${policeData[i].location.street.name}</p>`
										)
								)
								.addTo(map);

								// save tmp marker into currentMarkers array
								currentMarkers.push(marker);

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
