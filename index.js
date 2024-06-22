import data from "./gb.js";

const runMap = () => {
	if (!mapboxgl.supported()) {
		console.log("Your browser does not support Mapbox GL");
	}

	// Sign up for account at mapbox to get secret key and public key to test. https://docs.mapbox.com/help/getting-started/
	mapboxgl.accessToken =
		"pk.eyJ1IjoicmF5b3JpYW5mYWMyMyIsImEiOiJjbHE5cjh5aWYxYmQ1MmpzOWZvMGZ2ZnE1In0.8wI_iaJYe_urI-9vl3Vctg";

	const { geolocation } = navigator;

	if (geolocation) {
		geolocation.getCurrentPosition((position) => {
			// user coordinates

			let { latitude: lat } = position.coords;
			let { longitude: lon } = position.coords;

			console.log(lat, lon);

			// crime data container
			const container = document.querySelector("#text-container");
			// select elemet
			const select = document.getElementById("crimes");

			const currentMarkers = [];

			const map = new mapboxgl.Map({
				container: "map",
				style: "mapbox://styles/mapbox/streets-v11",
				center: [`${lon}`, `${lat}`],
				zoom: 13,
				scrollZoom: true,
			});

			const fetchData = async () => {
				try {
					// Get map data and police api data using promise all to return each result as element in an array
					const resultData = await Promise.all([
						fetch(
							`https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?&access_token=${mapboxgl.accessToken}`
						),
						fetch(
							`https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lon}&date=2023-10`
						),
					]);
					// Return pending map data and police api data as json
					const data = await Promise.all(resultData.map((ele) => ele.json()));

					const [mapData, policeData] = [...data];
					// Hide loader notice
					const loader = document.querySelector("#loader");
					loader.classList.add("fade-out");
					// find crime in area header
					const area = document.querySelector("#area-header");
					// deconstrcut map object to get information
					const { features } = { ...mapData };
					const [dataObj] = [...features];
					const { context } = { ...dataObj };
					const [postcode, locality, place, district, ,] = [...context];

					// find crime in area header text
					area.textContent = `${locality.text}, ${place.text}, ${district.text}, ${postcode.text} `;

					// find selected crime committed by category
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

						// Iterate over police data
						for (let i = 0; i < policeData.length; i++) {
							// if selected value matches police crime data category, create section
							// to show details
							if (event.target.value === policeData[i].category) {
								const panel = document.createElement("SECTION");
								panel.setAttribute("class", "crime-panel");
								const title = document.createElement("H2");
								title.setAttribute("class", "title");

								// if any crime data found in crime category
								if (policeData[i].outcome_status !== null) {
									// Capitalise first letter of crime category
									title.textContent =
										policeData[i].category.charAt(0).toUpperCase() +
										policeData[i].category.slice(1).replace(/-+/g, " ");

									// Date of crime container
									const crimeDate = document.createElement("P");

									// Date of crime
									crimeDate.textContent = new Date(
										policeData[i].month
									).toDateString();

									// Crime location container
									const crimeLocation = document.createElement("P");

									// crime location details
									crimeLocation.textContent =
										policeData[i].location.street.name;

									// Crime Outcome container
									const crimeOutcome = document.createElement("P");

									// crime outcome details
									crimeOutcome.textContent =
										policeData[i].outcome_status.category;

									// Append elements
									panel.appendChild(title);
									panel.appendChild(crimeDate);
									panel.appendChild(crimeLocation);
									panel.appendChild(crimeOutcome);
									container.appendChild(panel);

									// Set a fixed height to text container and set overflow to scroll to hide overflow
									// large amount of text returned from api - vertical scroll bar added to enable scrolling.
									container.style.height = "100vh";
									container.style.overflow = "scroll";

									// Add markers and pop ups showing crime details
									const marker = new mapboxgl.Marker()
										.setLngLat([
											`${policeData[i].location.longitude}`,
											`${policeData[i].location.latitude}`,
										])
										.setPopup(
											new mapboxgl.Popup({ offset: 25 }) // Add Popups
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
									// crime date not found
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

			//select element for choosing city
			const citySelect = document.getElementById("cities");

			// add city names and coordinates to options element for select element.
			data.forEach((city) => {
				const options = document.createElement("OPTION");
				options.setAttribute("value", `${city.lat},${city.lng}`);
				options.textContent = `${city.city}`;
				citySelect.appendChild(options);
			});

			// add evemt listener
			citySelect.addEventListener("change", function (e) {
				e.preventDefault();
				// retreive lon and lat values as an array
				let result = e.target.value.trim().split(",");
				// assign values to variables to use in map object and fetch urls
				const lat1 = `${result[0]}`;
				const lon1 = `${result[1]}`;

				const currentMarkers1 = [];

				// new map object
				const map1 = new mapboxgl.Map({
					container: "map",
					style: "mapbox://styles/mapbox/streets-v11",
					center: [`${lon1}`, `${lat1}`],
					zoom: 13,
					scrollZoom: true,
				});

				const fetchDataOne = async () => {
					try {
						// Get map data and police api data using promise all to return each result as element in an array
						const resultData1 = await Promise.all([
							fetch(
								`https://api.mapbox.com/geocoding/v5/mapbox.places/${lon1},${lat1}.json?&access_token=${mapboxgl.accessToken}`
							),
							fetch(
								`https://data.police.uk/api/crimes-street/all-crime?lat=${lat1}&lng=${lon1}&date=2023-10`
							),
						]);
						// Return pending map data and police api data as json
						const data1 = await Promise.all(
							resultData1.map((ele) => ele.json())
						);

						const [mapData1, policeData1] = [...data1];
						// Hide loader notice
						const loader = document.querySelector("#loader");
						loader.classList.add("fade-out");
						// find crime in area header
						const area = document.querySelector("#area-header");
						// deconstrcut map object to get information
						const { features } = { ...mapData1 };
						const [dataObj] = [...features];
						const { context } = { ...dataObj };
						const [postcode, locality, place, district, ,] = [...context];

						// find crime in area header text
						area.textContent = `${locality.text}, ${place.text}, ${district.text}, ${postcode.text} `;

						// find selected crime committed by category
						select.addEventListener("change", (event) => {
							event.preventDefault();

							const list = document.getElementsByClassName("crime-panel");

							// If elements exists remove them to make space for new elements.
							if (list) {
								Array.from(list).forEach((e) => e.remove());
							}

							// If markers exist remove markers from array to make space for new markers
							if (currentMarkers1 !== null) {
								for (let i = currentMarkers1.length - 1; i >= 0; i--) {
									currentMarkers1[i].remove();
								}
							}

							// Iterate over police data
							for (let i = 0; i < policeData1.length; i++) {
								// if selected value matches police crime data category, create section
								// to show details
								if (event.target.value === policeData1[i].category) {
									const panel = document.createElement("SECTION");
									panel.setAttribute("class", "crime-panel");
									const title = document.createElement("H2");
									title.setAttribute("class", "title");

									// if any crime data found in crime category
									if (policeData1[i].outcome_status !== null) {
										// Capitalise first letter of crime category
										title.textContent =
											policeData1[i].category.charAt(0).toUpperCase() +
											policeData1[i].category.slice(1).replace(/-+/g, " ");

										// Date of crime container
										const crimeDate = document.createElement("P");

										// Date of crime
										crimeDate.textContent = new Date(
											policeData1[i].month
										).toDateString();

										// Crime location container
										const crimeLocation = document.createElement("P");

										// crime location details
										crimeLocation.textContent =
											policeData1[i].location.street.name;

										// Crime Outcome container
										const crimeOutcome = document.createElement("P");

										// crime outcome details
										crimeOutcome.textContent =
											policeData1[i].outcome_status.category;

										// Append elements
										panel.appendChild(title);
										panel.appendChild(crimeDate);
										panel.appendChild(crimeLocation);
										panel.appendChild(crimeOutcome);
										container.appendChild(panel);

										// Set a fixed height to text container and set overflow to scroll to hide overflow
										// large amount of text returned from api - vertical scroll bar added to enable scrolling.
										container.style.height = "100vh";
										container.style.overflow = "scroll";

										// Add markers and pop ups showing crime details
										const marker1 = new mapboxgl.Marker()
											.setLngLat([
												`${policeData1[i].location.longitude}`,
												`${policeData1[i].location.latitude}`,
											])
											.setPopup(
												new mapboxgl.Popup({ offset: 25 }) // Add Popups
													.setHTML(
														`<h3>${policeData1[i].category.replace(
															/-/g,
															" "
														)}</h3><p>${
															policeData1[i].location.street.name
														}</p>`
													)
											)
											.addTo(map1);

										// Save tmp marker into currentMarkers array
										currentMarkers1.push(marker1);
									} else {
										// crime date not found
										title.textContent = "No Crime Data Available";
										panel.appendChild(title);
										container.appendChild(panel);
									}
								}
							}
						});

						// Add zoom and rotation controls to the map.
						map1.addControl(new mapboxgl.NavigationControl());
					} catch {
						throw Error("Promise failed");
					}
				};
				fetchDataOne();
			});
		});
	} else {
		alert("Geolocation is not supported by this browser.");
	}
};

runMap();
