// Use Geolocation API of the navigator object to retrieve current user coordiantes
(function() {
    const navigator = window.navigator;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
			let lon = position.coords.longitude;

            getCrimes(lat, lon);
        });
    }
})() 

// request location crime data from police API using user coordinates
function getCrimes(lat, lon) {
    fetch(`https://data.police.uk/api/crimes-at-location?&lat=${lat}&lng=${lon}`)
    .then((response) => response.json())
    .then((crimesArray) => crimesArray.forEach((el) => displayCrimes(el)));
}

function displayCrimes(el) {
    container = document.querySelector('main');
    loader = document.querySelector('#loader');
    panel = document.createElement("SECTION");
	panel.setAttribute("class", "crime-panel");

	// title
	title = document.createElement("H2");
	title.setAttribute("class", "title");
	title.innerHTML = `${el.category.replace(/\-/g, ' ')}`;

	// crime date
	crimeDate = document.createElement("P");
	crimeDate.innerHTML = `${el.month}`;

	// crime location
	crimeLocation = document.createElement("P");
	crimeLocation.innerHTML = `${el.location.street.name}`;

	// append elements
	panel.appendChild(title);
	panel.appendChild(crimeDate);
	panel.appendChild(crimeLocation);
	container.appendChild(panel);
    loader.setAttribute('hidden', 'true');
}