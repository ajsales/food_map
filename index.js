let map;
let service;
let infoWindow;

// Initializes map to either Northern California or current location
function initMap() {
	
	map = new google.maps.Map(document.getElementById("map"), {
		center: { lat: 38, lng: -121 },
		zoom: 10,
		mapId: "fecd56c00e9bc01e",
	});
	

	// Try HTML5 geolocation.
	geolocation();

}

// Moves center of the map to user's current location
function geolocation() {
	infoWindow = new google.maps.InfoWindow();
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				};
				infoWindow.setPosition(pos);
				infoWindow.setContent("Location found.");
				infoWindow.open(map);
				map.setCenter(pos);
			},
			() => {
				// User didn't allow geolocation.
				handleLocationError(true, infoWindow, map.getCenter());
			}
		);
	} else {
		// Browser doesn't support geolocation.
		handleLocationError(false, infoWindow, map.getCenter());
	}
}

// Handles error if browser doesn't support geolocation
function handleLocationError(browserhasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(
		browserhasGeolocation
			? "Error: The Geolocation service failed."
			: "Error: Your browser doesn't support geolocation."
	);
	infoWindow.open(map);
}

// Creates a marker given the location and icon
function createMarker(place, icon) {

	// Scaled icon
	const image = {
		url: icon,
		scaledSize: new google.maps.Size(30, 30)
	};

	// Google Maps Marker object
	const marker = new google.maps.Marker({
		map,
		position: place.geometry.location,
		icon: image,
	});

	// Markers can be clicked to show the name of the place
	infoWindow = new google.maps.InfoWindow();
	google.maps.event.addListener(marker, "click", () => {
		infoWindow.setPosition(place.geometry.location);
    	infoWindow.setContent(place.name);
    	infoWindow.open(map);
  	});

  	return marker;
}

// Returns array of markers given a search query
function addMarkerFromQuery(query, icon) {

	// The request is made through Google Places
	const request = {
	    query: query,
	    fields: ["name", "geometry"],
	    location: map.getCenter(),
	};

	service = new google.maps.places.PlacesService(map);

	// A marker is made for each valid search result
	let markers = [];
	service.textSearch(request, (results, status) => {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
	    	for (let i = 0; i < results.length; i++) {
	    		let marker = createMarker(results[i], icon);
	        	markers.push(marker);
	    	}

	    	// Map is re-centered to the first search result
	    	map.setCenter(results[0].geometry.location);
		}
	});

	return markers;
}

// The categories of food places to be queried
const places = [
	{
		query: "Brazilian steakhouse",
	 	icon: "public/images/kebab.png"
	},
	{
		query: "Korean bbq",
	 	icon: "public/images/bacon.png"
	},
	{
		query: "boba", 
	 	icon: "public/images/boba.png"
	},
	{
		query: "buffet", 
	 	icon: "public/images/buffet.png"
	}
]

let currMarkers = [];
for (let i = 0; i < places.length; i++) {
	currMarkers.push([]);
}

// Button behavior for the query page buttons
const choiceList = document.querySelectorAll(".choice");
for (let i = 0; i < choiceList.length; i++) {
	const choiceEl = choiceList[i];

	choiceEl.addEventListener("click", (e) => {
		e.preventDefault();

		choiceEl.classList.toggle("active-choice");

		// Adds/removes markers if button is active or not
		if (choiceEl.classList.contains("active-choice")) {
			const markers = addMarkerFromQuery(places[i].query, places[i].icon);
			currMarkers[i] = markers;
		} else {
			currMarkers[i].forEach(marker => marker.setMap(null));
			currMarkers[i] = [];
		}
	})
}

// Tab behavior to switch between the query and credits pages
const navbarContainers = document.querySelectorAll(".navbar-container");
const contents = document.querySelectorAll(".content");
navbarContainers.forEach(navbarContainer => {

	navbarContainer.addEventListener("click", e => {
		e.preventDefault();

		// Changes active tab and removes its hover behavior
		if (!navbarContainer.classList.contains("navbar-active")) {

			if (e.target.firstElementChild) {
				e.target.firstElementChild.classList.remove("navbar-hover");
			} else {
				e.target.classList.remove("navbar-hover");
			}

			navbarContainers.forEach(x => x.classList.toggle("navbar-active"));
			contents.forEach(x => x.classList.toggle("hidden"));
		}
	})

	// Gives hover behavior to non-active tab
	navbarContainer.addEventListener("mouseenter", e => {
		if (!navbarContainer.classList.contains("navbar-active")) {
			e.target.firstElementChild.classList.add("navbar-hover");
		}
	})

	navbarContainer.addEventListener("mouseleave", e => {
		if (!navbarContainer.classList.contains("navbar-active")) {
			e.target.firstElementChild.classList.remove("navbar-hover");
		}
	})
})
