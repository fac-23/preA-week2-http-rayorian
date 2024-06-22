const runMap = () => {
	const { geolocation } = navigator;

	if (geolocation) {
		geolocation.getCurrentPosition((position) => {
			const { latitude: lat } = position.coords,
				{ longitude: lon } = position.coords,
				container = document.querySelector("#text-container"),
				select = document.getElementById("crimes");

			// If browser does not support map box.
			if (!mapboxgl.supported()) {
				console.log("Your browser does not support Mapbox GL");
			}

			const currentMarkers = [];
			// Sign up for account at mapbox to get secret key and public key to test. https://docs.mapbox.com/help/getting-started/
			// eslint-disable-next-line no-undef
			mapboxgl.accessToken =
				"pk.eyJ1IjoicmF5b3JpYW5mYWMyMyIsImEiOiJjbHE5cjh5aWYxYmQ1MmpzOWZvMGZ2ZnE1In0.8wI_iaJYe_urI-9vl3Vctg";

			// eslint-disable-next-line no-undef
			const map = new mapboxgl.Map({
					container: "map",
					style: "mapbox://styles/mapbox/streets-v11",
					center: [`${lon}`, `${lat}`],
					zoom: 13,
					scrollZoom: true,
				}),
				fetchData = async () => {
					// Use try catch block
					try {
						// Get map data and police api data using promise all to return each result as element in an array
						const resultData = await Promise.all([
								fetch(
									// eslint-disable-next-line no-undef
									`https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?&access_token=${mapboxgl.accessToken}`
								),
								fetch(
									`https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lon}&date=2023-10`
								),
							]),
							// Return pending map data and police api data as json
							data = await Promise.all(resultData.map((ele) => ele.json())),
							[mapData, policeData] = [...data],
							// Hide loader notice
							loader = document.querySelector("#loader");
						loader.classList.add("fade-out");
						const area = document.querySelector("#area-header"),
							{ features } = { ...mapData },
							[dataObj] = [...features],
							{ context } = { ...dataObj },
							[postcode, locality, place, district, ,] = [...context];

						area.textContent = `${locality.text}, ${place.text}, ${district.text}, ${postcode.text} `;

						// Event listener for crime select element
						select.addEventListener("change", (event) => {
							event.preventDefault();

							const list = document.getElementsByClassName("crime-panel");

							// If elements exists remove them to make space for new elements.
							if (list) {
								Array.from(list).forEach((e) => e.remove());
							}

							// If markers exist remove markers from array to make space for new markers
							if (currentMarkers !== null) {
								for (let i = currentMarkers.length - 1; i >= 0; i--) {
									currentMarkers[i].remove();
								}
							}

							// Loop over police data
							// eslint-disable-next-line no-plusplus
							for (let i = 0; i < policeData.length; i++) {
								if (event.target.value === policeData[i].category) {
									const panel = document.createElement("SECTION");
									panel.setAttribute("class", "crime-panel");
									const title = document.createElement("H2");
									title.setAttribute("class", "title");

									console.log(policeData[i]);

									if (policeData[i].outcome_status !== null) {
										// Capitalise first letter of category
										title.textContent =
											policeData[i].category.charAt(0).toUpperCase() +
											policeData[i].category.slice(1).replace(/-+/g, " ");

										// Crime Date
										const crimeDate = document.createElement("P");
										crimeDate.textContent = new Date(
											policeData[i].month
										).toDateString();

										// Crime location
										const crimeLocation = document.createElement("P");

										crimeLocation.textContent =
											policeData[i].location.street.name;
										// Crime Outcome
										const crimeOutcome = document.createElement("P");

										// crime outcome
										crimeOutcome.textContent =
											policeData[i].outcome_status.category;

										// Append elements
										panel.appendChild(title);
										panel.appendChild(crimeDate);
										panel.appendChild(crimeLocation);
										panel.appendChild(crimeOutcome);
										container.appendChild(panel);

										// Set a fixed height to text container and set overflow to scroll to hide overflow of the large amount of text returned from api and add a vertical scroll bar to enable scrolling.
										container.style.height = "100vh";
										container.style.overflow = "scroll";

										// Add markers and pop ups showing details of crime
										// eslint-disable-next-line no-undef
										const marker = new mapboxgl.Marker()
											.setLngLat([
												`${policeData[i].location.longitude}`,
												`${policeData[i].location.latitude}`,
											])
											.setPopup(
												// eslint-disable-next-line no-undef
												new mapboxgl.Popup({ offset: 25 }) // Add popups
													.setHTML(
														`<h3>${policeData[i].category.replace(
															/-/g,
															" "
														)}</h3><p>${policeData[i].location.street.name}</p>`
													)
											)
											.addTo(map);

										// Save tmp marker into currentMarkers array
										currentMarkers.push(marker);
									} else {
										title.textContent = "No Crime Data Available";
										panel.appendChild(title);
										container.appendChild(panel);
									}
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
		alert("Geolocation is not supported by this browser.");
	}
};

runMap();
