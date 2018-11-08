$(document).ready(function() {

		    $('select').material_select();
		});

var map, infoWindow, geocoder, pos;

//initialize map, request user location
function initMap() {
	
	//creating a map
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 32.853, lng: -117.183},
		zoom: 7,
		disableDefaultUI: true,
		zoomControl: true,
		zoomControlOptions: {
			position: google.maps.ControlPosition.TOP_RIGHT
		}
	});
	infoWindow = new google.maps.InfoWindow;
	geocoder = new google.maps.Geocoder;


	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			infoWindow.setPosition(pos);
			infoWindow.setContent('Location found.');
			infoWindow.open(map);
			map.setCenter(pos);
		}, function() {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}

	function handleLocationError(browserHasGeolocation, infoWindow, pos) {
		infoWindow.setPosition(pos);
	    infoWindow.setContent(browserHasGeolocation ?
	        				'Error: The Geolocation service failed.' :
	        				'Error: Your browser doesn\'t support geolocation.');
	    infoWindow.open(map);
	}

	//once the user agrees to provide location,
	// create a reverse geocode query to collect city and state
	geocodeLatLng(geocoder, map, infoWindow);



	//create callback to create the search results query and create an ajax call
	//will return the query object

}

function geocodeLatLng(geocoder, map, infowindow) {
  var input = document.getElementById('latlng').value;
  var latlngStr = input.split(',', 2);
  var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        map.setZoom(11);
        var marker = new google.maps.Marker({
          position: latlng,
          map: map
        });
        infowindow.setContent(results[0].formatted_address);
        infowindow.open(map, marker);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}

function generateQuery() {
	var baseUrl = 'https://api.petfinder.com/pet.find?key=f2d74c99d5bc5124b40b57a6aaade29e&output=full&format=json&count=30&'


	//city and state for the query
	//generated from the user location.


}

//creating markers for use in map

// Placeholder URLs
var queryUrl = "https://api.petfinder.com/pet.find?key=f2d74c99d5bc5124b40b57a6aaade29e&location=San%20Diego%20CA&animal=dog&count=10&output=full&format=json"
//establish objs for api calls
var querySettings = {
	url: queryUrl,
	method: 'GET',
	jsonp: 'callback',
	dataType: 'jsonp'
}

function setMarkers(array){
	//create locations array that will set the markers
	var locations = [];

	//loop through given array
		for ( i = 0; i < array.length; i++ ){
			//shelter url base
			var shelterUrl = "https://api.petfinder.com/shelter.get?key=f2d74c99d5bc5124b40b57a6aaade29e&format=json&id="

			//set params for call
			var shelterSettings = {
				method: 'GET',
				jsonp: 'callback',
				dataType: 'jsonp'
			}

			//build second API call to get shelter location info and add to shelterSettings Obj
			var shelterQuery = shelterUrl + array[i].shelterId.$t;
			shelterSettings['url'] = shelterQuery;
			//second call
			$.ajax(shelterSettings)
				.done(function(shelterResult){
					//get vals
					var latitude = shelterResult.petfinder.shelter.latitude.$t;
					var longitude = shelterResult.petfinder.shelter.longitude.$t;

					//create obj to append
					var location = {
						lat: parseFloat(latitude),
						lng: parseFloat(longitude)
					}

					//push on to the locations array
					locations.push(location);

					// Add some markers to the map.
					// Note: The code uses the JavaScript Array.prototype.map() method to
					// create an array of markers based on a given "locations" array.
					// The map() method here has nothing to do with the Google Maps API.
					var markers = locations.map(function(location, i) {
					  return new google.maps.Marker({
					    position: location
					  });
					});

					// Add a marker clusterer to manage the markers.
					var markerCluster = new MarkerClusterer(map, markers,
					    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
				});
		}
}

function createCards(array){
	for ( var i = 0; i < array.length; i++ ){
		//create paw icon
		var paw = $('<img>').attr('class', 'moveRight paw')
			.attr('src', './assets/images/PawPrintOutline.png')
			.attr('style', 'height: 32px; width: auto; position: absolute; top: 0; z-index: 10;');

		//gather data
		var pet = array[i];
		var petName = pet.name.$t;
		var petImgSrc = pet.media.photos.photo[3].$t;
		var petSex = ((pet.sex.$t === 'M') ? 'Male' : 'Female');
		var petAge = pet.age.$t;
		var petBreed = '';
		var breedArray = pet.breeds.breed;
		for ( var j = 0; j < breedArray.length; j++ ){
			petBreed += (breedArray[j].$t + ' ');
		}

		if (petBreed === '') {petBreed = 'N/A'};

		console.log(petBreed);


		//generate wrapper div
		var card = $('<div>').attr('class', 'card horizontal col xl12');

		//generate inner wrappers
		var cardImg = $('<div>').attr('class', 'card-image');
		var cardStack = $('<div>').attr('class', 'card-stacked');

		//image
		//card image tag
		var img = $('<img>').attr('src', petImgSrc).attr('style', 'height: 250px;');
		//append onto card image div
		cardImg.append(img);
		cardImg.append(paw);
		//insert back into card div
		card.append(cardImg);

		//Name Span
		var name = $('<span>').attr('class', 'card-title')
			.attr('style', 'color: white; position: absolute; bottom: 0px;')
			.text(petName);
		//append back to card
		card.append(name);

		//card content
		var gender = $('<p>');
		var genderText = $('<strong>').text('Gender: ' + petSex);
		gender.append(genderText);

		var age = $('<p>');
		var ageText = $('<strong>').text('Age: ' + petAge);
		age.append(ageText);

		var breed = $('<p>');
		var breedText = $('<strong>').text('Breed: ' + petBreed);
		breed.append(breedText);

		//append onto cardStack
		cardStack.append(gender).append(age).append(breed);

		//insert back into the parent
		card.append(cardStack);

		//append into the results
		$('#search').append(card);
	}

}

//Petfinder API call for pets
$.ajax(querySettings)
	.done(function(searchResults){
		//get the search results
		var petsArray = searchResults.petfinder.pets.pet

		//put them on the map
		setMarkers(petsArray);

		//display them in the search results
		createCards(petsArray);
	});

// //marker onclick -- needs work
// markers.addListener('click', function() {
// 	selectedPos = marker.getPosition();
// 	console.log(selectedPos);
// 	//center with matching results on the left
// 	map.setZoom(12);
// 	map.setCenter(selectedPos);

// 	//display location information (Shelter)
// });