//Global variables
var map;
var infoWindow;
var pinColor;
var pinImage;
var pinShadow;
var error = false; // this is more like a switch to indicate if there has been an error in returning the wiki content
var wikiAPI = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='; //part of the wiki api token
//ref: https://codepen.io/saksham_zz/pen/oeYrbm
//styles for the google map
//styles were taken from this awesome site
// ref: https://snazzymaps.com/style/143800/sustainability
var errorContent = 'Could not load wikipedia resources. Wikipedia servers are unreachable at the moment, please try again!';
var styles = [{
	"featureType": "administrative",
	"elementType": "geometry.fill",
	"stylers": [{
		"visibility": "on"
	}, {
		"color": "#ffffff"
	}]
}, {
	"featureType": "administrative",
	"elementType": "labels.text.fill",
	"stylers": [{
		"color": "#444444"
	}]
}, {
	"featureType": "landscape",
	"elementType": "all",
	"stylers": [{
		"color": "#f2f2f2"
	}]
}, {
	"featureType": "landscape.natural.landcover",
	"elementType": "all",
	"stylers": [{
		"visibility": "off"
	}]
}, {
	"featureType": "poi",
	"elementType": "all",
	"stylers": [{
		"visibility": "off"
	}]
}, {
	"featureType": "poi",
	"elementType": "geometry.fill",
	"stylers": [{
		"visibility": "on"
	}]
}, {
	"featureType": "poi",
	"elementType": "labels.text",
	"stylers": [{
		"visibility": "on"
	}, {
		"color": "#000000"
	}]
}, {
	"featureType": "poi",
	"elementType": "labels.text.fill",
	"stylers": [{
		"visibility": "on"
	}]
}, {
	"featureType": "poi",
	"elementType": "labels.text.stroke",
	"stylers": [{
		"visibility": "off"
	}]
}, {
	"featureType": "poi",
	"elementType": "labels.icon",
	"stylers": [{
		"visibility": "off"
	}]
}, {
	"featureType": "poi.attraction",
	"elementType": "geometry.fill",
	"stylers": [{
		"color": "#bde1c8"
	}]
}, {
	"featureType": "poi.business",
	"elementType": "geometry.fill",
	"stylers": [{
		"color": "#eceded"
	}, {
		"visibility": "on"
	}]
}, {
	"featureType": "poi.government",
	"elementType": "geometry.fill",
	"stylers": [{
		"color": "#ffffff"
	}, {
		"visibility": "on"
	}]
}, {
	"featureType": "poi.park",
	"elementType": "geometry.fill",
	"stylers": [{
		"color": "#bde1c8"
	}]
}, {
	"featureType": "poi.school",
	"elementType": "geometry.fill",
	"stylers": [{
		"color": "#f3f3f4"
	}]
}, {
	"featureType": "poi.sports_complex",
	"elementType": "geometry.fill",
	"stylers": [{
		"color": "#ffffff"
	}]
}, {
	"featureType": "road",
	"elementType": "all",
	"stylers": [{
		"saturation": -100
	}, {
		"lightness": 45
	}]
}, {
	"featureType": "road.highway",
	"elementType": "all",
	"stylers": [{
		"visibility": "simplified"
	}]
}, {
	"featureType": "road.arterial",
	"elementType": "labels.icon",
	"stylers": [{
		"visibility": "off"
	}]
}, {
	"featureType": "transit",
	"elementType": "all",
	"stylers": [{
		"visibility": "off"
	}]
}, {
	"featureType": "water",
	"elementType": "all",
	"stylers": [{
		"color": "#46bcec"
	}, {
		"visibility": "on"
	}]
}];

// storing our companies object into an array of locations
var companies = [{

	coords: {
		lat: 37.422995,
		lng: -122.061782
	},
	content: '<h1>Nasa</h1>' + '<p>Could not load wikipedia resources. Wikipedia servers are unreachable at the moment, please try again!</p>',
	title: 'NASA',
	visible: true,

}, {

	coords: {
		lat: 37.422000,
		lng: -122.084057
	},
	content: '<h1>Google</h1>' + '<p>Could not load wikipedia resources. Wikipedia servers are unreachable at the moment, please try again!</p>',
	title: 'Google',
	visible: true,

}, {

	coords: {
		lat: 37.332000,
		lng: -122.030781
	},
	content: '<h1>Apple</h1>' + '<p>Could not load wikipedia resources. Wikipedia servers are unreachable at the moment, please try again!</p>',
	title: 'Apple Inc',
	visible: true,

}, {

	coords: {
		lat: 37.387591,
		lng: -121.963787
	},
	content: '<h1>Intel</h1>' + '<p>Could not load wikipedia resources. Wikipedia servers are unreachable at the moment, please try again!</p>',
	title: 'Intel',
	visible: true,

}, {

	coords: {
		lat: 37.427475,
		lng: -122.169719
	},
	content: '<h1>Stanford University</h1>' + '<p>Could not load wikipedia resources. Wikipedia servers are unreachable at the moment, please try again!</p>',
	title: 'Stanford',
	visible: true,

}];

//this is the function that the google api callback when it reseives the request to construct the map
//Started implementing my code from this video : https://www.youtube.com/watch?v=Zxf1mnP5zcw
// and then changed/implemented extra functionality as needed
function initMap() {

	//setting attributes for our markers and map
	pinColor = "191970";
	pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor, //ref: https://stackoverflow.com/questions/2472957/how-can-i-change-the-color-of-a-google-maps-marker
		new google.maps.Size(21, 34),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34));
	pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
		new google.maps.Size(40, 37),
		new google.maps.Point(0, 0),
		new google.maps.Point(12, 35));
	var options = {
		zoom: 11,
		center: {
			lat: 37.3861,
			lng: -122.0839
		},
		styles: styles

	}

	// constructing the map
	map = new google.maps.Map(document.getElementById('map'), options);


	// Loop through our companies array and call the addMarker function
	for (var i = 0; i < companies.length; i++) {
		// Add marker
		addMarker(companies[i]);
	}

	// Add Marker Function to associate each location with it's marker + handling wiki API error
	function addMarker(props) {

		var marker = new google.maps.Marker({
			position: props.coords,
			map: map,
			title: props.title,
			visible: props.visible,


		});


		infoWindow = new google.maps.InfoWindow({


		});
		//when user clicks on the marker while the error switch has been indicated as 'true'
		//set the content of the infoWindow to the original/fail content
		marker.addListener('click', function () {
			if (props.content && error) {


				infoWindow.setContent(props.content);
				infoWindow.open(map, marker);
				map.panTo(marker.position); // zoom to the marker position
				marker.setAnimation(google.maps.Animation.BOUNCE); // play with the Animation
				marker.setIcon(pinImage);
				marker.setShadow(pinShadow);
				setTimeout(function () { // set time out for the marker new Animation&icon. after 1 sec reset to default
					marker.setAnimation(null);
					marker.setIcon(null);
				}, 1000); //ref: https://developers.google.com/maps/documentation/javascript/examples/marker-animations
				error = false; // reset the error switch

			}
		});

		// if there's no error indicated, assign the declared above marker to the companies markers
		// & add addListener to load content once clicked
		if (props.content && !error) {


			companies[i].marker = marker
			marker.addListener("click", wrapContent(marker), false); // used other listener from above because they produce problems otherwise


		}


	}

	ko.applyBindings(new ViewModel()); // Let knockout.js do its magic!
}

// Our ViewModel implementation
var ViewModel = function () {

	var self = this;
	self.originalCompanies = ko.observableArray(companies); //create an observableArray of our companies array

	self.currentSelected = ko.observable();

	var pins = []; //empty array to then store our original array & return it from self.filteredCompanies fucntion
	// This is important because our list in the dom is binded to this value
	self.query = ko.observable(); // user input

	self.filteredCompanies = ko.computed(function () {
		var pins = [];

		if (self.query()) { //user starts typing

			ko.utils.arrayForEach(self.originalCompanies(), function (element) { // loop through our observableArray

				if (element.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
					pins.push(element);
					element.marker.setVisible(true);
				} else {
					element.marker.setVisible(false);
				}
			});
		} else {
			pins = self.originalCompanies();
			ko.utils.arrayForEach(self.originalCompanies(), function (element) {
				element.marker.setVisible(true);
			});
		}
		//this is binded with our listContent dom element
		self.clicked = function (element) { // this is to indicate if the user clicked on our list items
			// & animate the associated marker + call loadWikiContent fucntion
			if (element.marker.getAnimation() !== null) {
				element.marker.setAnimation(null);
			} else {
				map.panTo(element.marker.position);

				element.marker.setAnimation(google.maps.Animation.BOUNCE);
				element.marker.setIcon(pinImage);
				element.marker.setShadow(pinShadow);
				setTimeout(function () {
					element.marker.setAnimation(null);
					element.marker.setIcon(null);
				}, 1000);
				loadWikiContent(element.marker, infoWindow);

			}
		};
		return pins;
	});

	//ref: https://stackoverflow.com/questions/29551997/knockout-search-filter
	//ref: https://opensoul.org/2011/06/23/live-search-with-knockoutjs/
};

function loadWikiContent(marker, infoWindow) {

	var wikiContent = wikiAPI + marker.title + '&format=json&callback=wikiCallback'; // getting the rest of the wiki url token as mentioned before
	if (error) {
		infoWindow.setContent('<div>' + '<h4>' + marker.title + '</h4>' + '<p>' + errorContent + '</p> ');
		infoWindow.open(map, marker);
	}
	///ajax request to retrieve the data from wikipedia api
	$.ajax({
			url: wikiContent,
			type: 'GET',
			contentType: "application/json; charset=utf-8",
			async: true,
			dataType: "jsonp",
			//ref: https://stackoverflow.com/questions/10852652/difference-between-datatype-jsonp-and-json
			success: function (data, status, jqXHR) {


				infoWindow.marker = marker;
				infoWindow.setContent('<div>' + '<h4>' + marker.title + '</h4>' + '<p>' + data[2][0] /*title associated wikipedia data */ + '</p>  <p> <a href="' + data[3][0] /*title associated wikipediaurl*/ + '" target="_blank">' + '...read more from Wikipedia here' + '</a> </p> </div>');

				infoWindow.open(map, marker);
				console.log(data[2][0]);
				console.log(data[3][0]); // debugging
				console.log("Error: " + error);
				marker.setAnimation(google.maps.Animation.BOUNCE);
				marker.setIcon(pinImage);
				marker.setShadow(pinShadow);
				setTimeout(function () {
					marker.setAnimation(null);
					marker.setIcon(null);
				}, 1000);

			}
		})
		.done(function () {
			console.log("success");
			error: false;
		})
		.fail(function () {
			//this is for debugging only
			console.log("error");
			error = true; //error detected!
			console.log("Error: " + error);
		})
		.always(function () {
			console.log("complete");
		});
	//ref: https://codepen.io/saksham_zz/pen/oeYrbm

}

function wrapContent(marker) {
	return function () {


		loadWikiContent(marker, infoWindow);

	};
}

function throwException() {
	alert("Google Map API hasn't responded. Please try again!.");
}
