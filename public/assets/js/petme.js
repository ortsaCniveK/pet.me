$(document).ready(function() {

    $('select').material_select();
});

// Generate States Dropdown

var states = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];
var stateSelector = $("#stateSelector");

for (var i = 0; i < states.length; i++){
	var newOption = $("<option>");
	newOption.attr("value", states[i]);
	newOption.append(states[i]);
	stateSelector.append(newOption);
}

// Generate Breeds Dropdown

var breedsSpecific;
var breedSelector = $("#breedSelector")

$("#animalType").on("change", function(){
	$("#breedSelector").empty();
	var animalSelected = $(this).val();
	var breedDefault = $("<option>")
	breedDefault.attr("value", "");
	breedDefault.attr("selected");
	breedDefault.attr("disabled");
	breedSelector.append(breedDefault);
	$.ajax({
		url: "https://api.petfinder.com/breed.list?key=f2d74c99d5bc5124b40b57a6aaade29e&animal=" + animalSelected + "&format=json",
		method: "GET",
		jsonp: "callback",
		dataType: "jsonp"
	}).done(function(json){
		var breeds = json.petfinder.breeds.breed
		breedsSpecific = breeds.map(function(breed){
			return breed["$t"]
		})
		for (var i = 0; i < breedsSpecific.length; i++){
			var newOption = $("<option>");
			newOption.attr("value", breedsSpecific[i]);
			newOption.append(breedsSpecific[i]);
			breedSelector.append(newOption);
		}
		breedSelector.material_select();
	})
})

// AJAX Request

var citySelection;
var stateSelection;
var animalSelection;
var breedSelection;
var genderSelection;
var ageSelection;

	//function to get favorites on page load
	function getFavorites (callback) {

		var database = firebase.database();

		var favorites = database.ref()
		var favoritesList = [];

		favorites.once('value', function(snapshot) {
			var i = 0;

			if (snapshot.child("pets").numChildren() == 0) {
				callback(favoritesList, null);
			}

			var favoritesObject = snapshot.child("pets").val();

		    snapshot.child("pets").forEach(function(childSnapshot) {
		    	var petId = childSnapshot.val().petId;
		    	favoritesList.push(petId);
		      	i++;

		    	if(i == snapshot.child("pets").numChildren()) {
		    		callback(favoritesList, favoritesObject);
		      	}
		    });
		});
	}

	//function to display favorites on favorites page
	function displayFavorites (){
		getFavorites(function(favoritesList, favoritesObject){
			console.log(favoritesList);
			for (var i = 0; i < favoritesList.length; i++){
				var petId = favoritesList[i];
				var petName = favoritesObject[petId].name;
				var petBreed = favoritesObject[petId].breed;
				var petGender = favoritesObject[petId].gender;
				var petPhoto = favoritesObject[petId].petImage;
				var petAge = favoritesObject[petId].age;
				var pawPhoto = "./assets/images/OrangePawPrint.png";

				var tag = "<div class='col x13 m12' style='width:25%; max-height: 420px'>" +
							  "<div class='card'>" +
								  "<div class='card-image'>" +	
								  	"<img style='height:250px' src='"+ petPhoto +"'/>" +
								  	"<img onclick='favoritePet((this)," + petId + ", &quot;" + petName + "&quot;, " + "&quot;" + petGender + "&quot;, " + "&quot;" + petBreed + "&quot;, " + "&quot;" + petPhoto + "&quot;, " + "&quot;" + petAge + "&quot;, " + true + ")' class='moveRight' src='" + pawPhoto + "' style='height: 32px; width: auto; position: absolute; top: 0; z-index: 10' />" +
								  	"<span class='card-title'>" + petName + "</span>" + 
								  "</div>" +
								  "<div class='card-content'>" +
							  		"<p><strong>Gender: </strong>" + petGender + "</p>" +
							  		"<p><strong>Age: </strong>" + petAge + "</p>" +
								  	"<p><strong>Breed: </strong>" + petBreed + "</p>" +
								  "</div>" +
							  "</div>" +
						  "</div>"
				$("#favorites").append(tag);
			}
		})
	}

	//click function for paw print
	function favoritePet (event, petId, petName, petGender, petBreed, photos, petAge, isFavorite) {
		var onClickFunction = "favoritePet((this)," + petId + ",'" + petName + "','" + petGender + "','" + petBreed + "','" + photos + "'," + petAge + "',"+ !isFavorite + ");";
		var database = firebase.database();
		
		if (isFavorite) {
			$(event).attr("src", "./assets/images/PawPrintOutline.png");
			$(event).attr("onclick", onClickFunction);
			console.log("ALREADY FAVORITE");
			database.ref('pets/' + petId).remove();

		} else {
			$(event).attr("src", "./assets/images/OrangePawPrint.png");
			$(event).attr("onclick", onClickFunction);
			console.log("FAVORITE ADDED");
			database.ref('pets/' + petId).set({
				petId: petId,
				name: petName,
				gender: petGender,
				breed: petBreed,
				petImage: photos,
				age: petAge
			})
		}
	}

$("#submitSearch").on("click", function(e){
	e.preventDefault();
	$("#searchResults").empty();
	citySelection = $("#city").val();
	stateSelection = $("#stateSelector").val();
	animalSelection = $("#animalType").val();
	breedSelection = $("#breedSelector").val();
	genderSelection = $("#genderSelector").val();
	ageSelection = $("#ageSelector").val();

	if (!genderSelection){
		genderSelection = "";
	}

	if (!ageSelection){
		ageSelection = "";
	}

	var queryURL = "https://api.petfinder.com/pet.find?key=f2d74c99d5bc5124b40b57a6aaade29e&location=" + citySelection + "%20" + stateSelection + "&animal=" + animalSelection + "&breed=" + breedSelection + "&age=" + ageSelection + "&sex=" + genderSelection + "&count=20&output=full&format=json"

	// if (breedSelection === ""){
	// 	queryURL = "https://api.petfinder.com/pet.find?key=f2d74c99d5bc5124b40b57a6aaade29e&location=" + citySelection + "%20" + stateSelection + "&animal=" + animalSelection + "&count=20&output=full&format=json"
	// } else {
	// 	queryURL = "https://api.petfinder.com/pet.find?key=f2d74c99d5bc5124b40b57a6aaade29e&location=" + citySelection + "%20" + stateSelection + "&animal=" + animalSelection + "&breed=" + breedSelection + "&age=" + ageSelection + "&sex=" + genderSelection + "&count=20&output=full&format=json"
	// }
	var settings = {
		url: queryURL,
		method: "GET",
		jsonp: "callback",
		dataType: "jsonp"
	}
	var queryURL = "https://api.petfinder.com/pet.find?key=f2d74c99d5bc5124b40b57a6aaade29e&location=" + citySelection + "%20" + stateSelection + "&animal=" + animalSelection + "&breed=" + breedSelection + "&age=" + ageSelection + "&sex=" + genderSelection + "&count=20&output=full&format=json"

	var settings = {
		url: queryURL,
		method: "GET",
		jsonp: "callback",
		dataType: "jsonp"
	}

	// Get list of favorites from Firebase before building cards
	getFavorites(function(favoritesList, favoritesObject){

		$.ajax(settings)
		.done(function(json){
			var results = json.petfinder.pets.pet;

			for (var i = 0; i < results.length; i++){
				var photos = results[i].media.photos.photo[3].$t;
				var petId = parseInt(results[i].id.$t);
				var isFavorite = false;
				var pawPhoto = "./assets/images/PawPrintOutline.png";
				if ($.inArray(petId, favoritesList) !== -1) {
					isFavorite = true;
					pawPhoto = "./assets/images/OrangePawPrint.png";
				}

				if (results[i].breeds.breed.length > 1){
					var petBreed = results[i].breeds.breed[0].$t + "/" + results[i].breeds.breed[1].$t;
				} else {
					var petBreed = results[i].breeds.breed.$t;
				}
		
				var newCard = $("<div>");
				$("#searchResults").append(newCard);
				newCard.addClass("col x13 m12");
				newCard.css("width", "25%")
				newCard.css("max-height", "420px")
				var cardDiv = $("<div>");
				cardDiv.addClass("card");
				newCard.append(cardDiv);
				var imgDiv = $("<div>");
				imgDiv.addClass("card-image");
				cardDiv.append(imgDiv);
				var cardImg = $("<img>");
				cardImg.attr("height", 250);
				cardImg.attr("src", photos);
				var pawImg = $("<img onclick='favoritePet((this)," + results[i].id.$t + ", &quot;" + results[i].name.$t + "&quot;, " + "&quot;" + results[i].sex.$t + "&quot;, " + "&quot;" + petBreed + "&quot;, " + "&quot;" + photos + "&quot;, " + "&quot;" + petAge + "&quot;, " + isFavorite + ")' class='moveRight' src='" + pawPhoto + "' style='height: 32px; width: auto; position: absolute; top: 0; z-index: 10' />");
				var cardTitle = $("<span>")
				cardTitle.addClass("card-title");
				
				//creating pet name
				var name = results[i].name.$t;
				cardTitle.text(name);
				cardTitle.css("color", "white");
				cardTitle.css("position", "absolute");
				cardTitle.css("top", 0);
				cardDiv.append(cardTitle);
				imgDiv.append(cardImg);
				imgDiv.append(pawImg);
				var cardContent = $("<div>");
				cardContent.addClass("card-content");
				cardDiv.append(cardContent);
				var gender = $("<p>");

				//create variable for gender type
				var genderType = results[i].sex.$t
				if (results[i].sex.$t === "M"){
		          gender.html("<strong>Gender:</strong> Male");
		        } else {
		          gender.html("<strong>Gender:</strong> Female");
		        }
        		
        		var petAge = results[i].age.$t;
        		var age = $("<p>");
			  	age.html("<strong>Age:</strong> " + results[i].age.$t);
				var breed = $("<p>");
				if (results[i].breeds.breed.length > 1){
		          breed.html("<strong>Breed:</strong> " + results[i].breeds.breed[0].$t + "/" + results[i].breeds.breed[1].$t);
		        } else {
		          breed.html("<strong>Breed:</strong> " + results[i].breeds.breed.$t);
		        }
				cardContent.append(gender);
        		cardContent.append(age);
				cardContent.append(breed);
				var cardAction = $("<div>");
				cardAction.addClass("card-action");
				cardDiv.append(cardAction);
				var cardLink = $("<a>");
				cardLink.attr("href", "#");
				cardAction.append(cardLink);

				var currentResult = results[i]
		}

	})	



})
})