// const dot = dotenv.config({ path: ".env" });

const runMap = () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((position) => {
			const { latitude: lat } = position.coords;
			const { longitude: lon } = position.coords;

			const container = document.querySelector("#text-container");
			const select = document.getElementById("crimes");

			// if browser does not support map box.
			// eslint-disable-next-line no-undef
			if (!mapboxgl.supported()) {
				// eslint-disable-next-line no-console
				console.log("Your browser does not support Mapbox GL");
			}

			const currentMarkers = [];
			// sign up for account at mapbox to get secret key and public key to test. https://docs.mapbox.com/help/getting-started/
			// eslint-disable-next-line no-undef
			mapboxgl.accessToken = env.API_KEY;

			// eslint-disable-next-line no-undef
			const map = new mapboxgl.Map({
				container: "map",
				style: "mapbox://styles/mapbox/streets-v11",
				center: [`${lon}`, `${lat}`],
				zoom: 13,
				scrollZoom: true,
			});

			const fetchData = async () => {
				// use try catch block
				try {
					// get map data and police api data using promise all to return each result as element in an array
					const resultData = await Promise.all([
						fetch(
							// eslint-disable-next-line no-undef
							`https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?&access_token=${mapboxgl.accessToken}`
						),
						fetch(
							`https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lon}&date=2023-10`
						),
					]);

					// return pending map data and police api data as json
					const data = await Promise.all(resultData.map((ele) => ele.json()));

					const [mapData, policeData] = [...data];
					// remove mapbox api data and retuurn just police api data
					// const policeData = data.at(-1);

					// hide loader notice
					const loader = document.querySelector("#loader");
					loader.classList.add("fade-out");
					const area = document.querySelector("#area-header");

					const { features } = { ...mapData };
					const [dataObj] = [...features];
					const { context } = { ...dataObj };
					const [postcode, locality, place, district, ,] = [...context];
					area.textContent = `${locality.text}, ${place.text}, ${district.text}, ${postcode.text} `;

					// event listener for crime select element
					select.addEventListener("change", (event) => {
						event.preventDefault();
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
							// compare event target value to police api category value

							// if true create elements to display data
							if (event.target.value === policeData[i].category) {
								const panel = document.createElement("SECTION");
								panel.setAttribute("class", "crime-panel");
								const title = document.createElement("H2");
								title.setAttribute("class", "title");

								// capitalise first letter of category
								title.textContent =
									policeData[i].category.charAt(0).toUpperCase() +
									policeData[i].category.slice(1).replace(/-+/g, " ");

								const crimeDate = document.createElement("P");
								crimeDate.textContent = new Date(
									policeData[i].month
								).toDateString();

								// crime location
								const crimeLocation = document.createElement("P");
								// eslint-disable-next-line prefer-destructuring
								crimeLocation.textContent = policeData[i].location.street.name;
								// crime location
								const crimeOutcome = document.createElement("P");

								// eslint-disable-next-line prefer-destructuring
								crimeOutcome.textContent =
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

					// Add zoom and rotation controls to the map.
					// eslint-disable-next-line no-undef
					map.addControl(new mapboxgl.NavigationControl());
				} catch {
					throw Error("Promise failed");
				}
			};
			fetchData();
		});
	} else {
		// eslint-disable-next-line no-alert
		alert("Geolocation is not supported by this browser.");
	}
};

runMap();
