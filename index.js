let map;
let service;
let infoWindow;


function initMap() {
	
	map = new google.maps.Map(document.getElementById("map"), {
		center: { lat: 38, lng: -121 },
		zoom: 10,
		mapId: "fecd56c00e9bc01e",
	});
	

	// Try HTML5 geolocation.
	// geolocation();

}

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

function handleLocationError(browserhasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(
		browserhasGeolocation
			? "Error: The Geolocation service failed."
			: "Error: Your browser doesn't support geolocation."
	);
	infoWindow.open(map);
}

function createMarker(place, icon) {
	const image = {
		url: icon,
		scaledSize: new google.maps.Size(30, 30)
	};
	const marker = new google.maps.Marker({
		map,
		position: place.geometry.location,
		icon: image,
	});
	infoWindow = new google.maps.InfoWindow();
	google.maps.event.addListener(marker, "click", () => {
		infoWindow.setPosition(place.geometry.location);
    	infoWindow.setContent(place.name);
    	infoWindow.open(map);
  	});
  	return marker;
}

function addMarkerFromQuery(query, icon) {
	var request = {
	    query: query,
	    fields: ["name", "geometry"],
	    location: map.getCenter(),
	};

	service = new google.maps.places.PlacesService(map);

	let markers = [];
	service.textSearch(request, (results, status) => {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
	    	for (var i = 0; i < results.length; i++) {
	        	markers.push(createMarker(results[i], icon));
	    	}
	    	map.setCenter(results[0].geometry.location);
		}
	});
	return markers;
}

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

let curr_markers = [];
for (let i = 0; i < places.length; i++) {
	curr_markers.push([]);
}

const choiceList = document.querySelectorAll(".choice");
for (let i = 0; i < choiceList.length; i++) {
	const choiceEl = choiceList[i];
	choiceEl.addEventListener("click", () => {
		choiceEl.classList.toggle("active-choice");
		if (choiceEl.classList.contains("active-choice")) {
			const markers = addMarkerFromQuery(places[i].query, places[i].icon);
			curr_markers[i] = markers;
		} else {
			curr_markers[i].forEach(marker => {
				marker.setMap(null);
			})
			curr_markers[i] = [];
		}
	})
}

const navbar_containers = document.querySelectorAll(".navbar-container");
const contents = document.querySelectorAll(".content");
navbar_containers.forEach(navbar_container => {
	navbar_container.addEventListener("click", e => {
		if (!navbar_container.classList.contains("navbar-active")) {
			if (e.target.firstElementChild) {
				e.target.firstElementChild.classList.remove("navbar-hover");
			} else {
				e.target.classList.remove("navbar-hover");
			}
			navbar_containers.forEach(x => x.classList.toggle("navbar-active"));
			contents.forEach(x => x.classList.toggle("hidden"));
		}
	})
	navbar_container.addEventListener("mouseenter", e => {
		if (!navbar_container.classList.contains("navbar-active")) {
			e.target.firstElementChild.classList.add("navbar-hover");
		}
	})
	navbar_container.addEventListener("mouseleave", e => {
		if (!navbar_container.classList.contains("navbar-active")) {
			e.target.firstElementChild.classList.remove("navbar-hover");
		}
	})
})
