// const dot = dotenv.config({ path: ".env" });
// import * as dotenv from "dotenv";
// eslint-disable-next-line no-console
// console.log(dotenv);
// eslint-disable-next-line func-names
const runMap = () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((position) => {
			// eslint-disable-next-line prefer-destructuring
			const lat = position.coords.latitude;
			// eslint-disable-next-line prefer-destructuring
			const lon = position.coords.longitude;

			const container = document.querySelector("#text-container");
			const select = document.getElementById("crimes");

			// if browser does not support map box.
			// eslint-disable-next-line no-undef
			if (!mapboxgl.supported()) {
				// eslint-disable-next-line no-console
				console.log("Your browser does not support Mapbox GL");
			} else {
				const currentMarkers = [];
				// sign up for account at mapbox to get secret key and public key to test. https://docs.mapbox.com/help/getting-started/
				// eslint-disable-next-line no-undef
				mapboxgl.accessToken = `pk.eyJ1IjoicmF5b3JpYW5mYWMyMyIsImEiOiJja3Zwc25xNXAyY2VoMm50a2swYnp2dXFhIn0.lKM6McyWmA7lIHSSVQywhA`;
				// eslint-disable-next-line no-undef
				// mapboxgl.accessToken = `${process.env.API_KEY}`;

				// eslint-disable-next-line no-undef
				const map = new mapboxgl.Map({
					container: "map",
					style: "mapbox://styles/mapbox/streets-v11",
					center: [`${lon}`, `${lat}`],
					zoom: 13,
					scrollZoom: true,
				});

				// police api request data object
				const requestOptions = {
					method: "GET",
					redirect: "follow",
				};

				// send request to police api
				const fetchPolice = fetch(
					`https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lon}&date=2020-09`,
					requestOptions
				);

				// send request to mapbox api
				const fetchMap = fetch(
					// eslint-disable-next-line no-undef
					`https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?&access_token=${mapboxgl.accessToken}`
				);

				// Use promise all to get data for both apis
				// promise all accepts array.
				Promise.all([fetchPolice, fetchMap])
					.then((values) =>
						// convert returned promises to json data by passing promises (which are arrays) into promise.all again and looping over arrays and apply .json() to each element of the array then return an array as json data.
						Promise.all(values.map((element) => element.json()))
					)
					.then(([policeData, mapData]) => {
						// deconstruct array of data from both apis responses.

						// hide loader notice
						const loader = document.querySelector("#loader");
						loader.classList.add("fade-out");

						const area = document.querySelector("#area-header");

						// eslint-disable-next-line prefer-destructuring
						const { features } = { ...mapData };
						const [data] = [...features];
						// eslint-disable-next-line camelcase
						const { text } = { ...data };
						// eslint-disable-next-line no-console
						console.log(data);
						// eslint-disable-next-line camelcase
						area.innerHTML = text;

						// event listener for crime select element
						select.addEventListener("change", (event) => {
							// get all elements created if they already exist
							const list = document.getElementsByClassName("crime-panel");

							// if elements exists remove them to make space for new elements.
							if (list) {
								Array.from(list).forEach((e) => e.remove());
							}

							// if markers exist remove markers from array to make space for new markers
							if (currentMarkers !== null) {
								// eslint-disable-next-line no-plusplus
								for (let i = currentMarkers.length - 1; i >= 0; i--) {
									currentMarkers[i].remove();
								}
							}

							// loop over police data
							// eslint-disable-next-line no-plusplus
							for (let i = 0; i < policeData.length; i++) {
								// eslint-disable-next-line no-console
								// console.log(policeData[i]);
								// compare event target value to police api category value
								// if true create elements to display data
								if (event.target.value === policeData[i].category) {
									// panel
									const panel = document.createElement("SECTION");
									panel.setAttribute("class", "crime-panel");

									// title
									const title = document.createElement("H2");
									title.setAttribute("class", "title");
									// capitalise first letter of category
									title.innerHTML =
										policeData[i].category.charAt(0).toUpperCase() +
										policeData[i].category.slice(1).replace(/-+/g, " ");

									// crime date
									const crimeDate = document.createElement("P");
									crimeDate.innerHTML = new Date(
										policeData[i].month
									).toDateString();

									// crime location
									const crimeLocation = document.createElement("P");
									// eslint-disable-next-line prefer-destructuring
									crimeLocation.innerHTML = policeData[i].location.street.name;

									// crime location
									const crimeOutcome = document.createElement("P");
									// eslint-disable-next-line prefer-destructuring
									crimeOutcome.innerHTML =
										policeData[i].outcome_status.category;

									// append elements
									panel.appendChild(title);
									panel.appendChild(crimeDate);
									panel.appendChild(crimeLocation);
									panel.appendChild(crimeOutcome);
									container.appendChild(panel);

									// set a fixed height to text container and set overflow to scroll to hide overflow of the large amount of text returned from api and add a vertical scroll bar to enable scrolling.
									container.style.height = "100vh";
									container.style.overflow = "scroll";

									// add markers and pop ups showing details of crime
									// eslint-disable-next-line no-undef
									const marker = new mapboxgl.Marker()
										.setLngLat([
											`${policeData[i].location.longitude}`,
											`${policeData[i].location.latitude}`,
										])
										.setPopup(
											// eslint-disable-next-line no-undef
											new mapboxgl.Popup({ offset: 25 }) // add popups
												.setHTML(
													`<h3>${policeData[i].category.replace(
														/-/g,
														" "
													)}</h3><p>${policeData[i].location.street.name}</p>`
												)
										)
										.addTo(map);

									// save tmp marker into currentMarkers array
									currentMarkers.push(marker);
								}
							}
						});
					})
					.catch((status) => {
						// eslint-disable-next-line no-console
						console.log(status);
					});
			}
		});
	} else {
		// eslint-disable-next-line no-alert
		alert("Geolocation is not supported by this browser.");
	}
};

runMap();
