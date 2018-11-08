
//==========================================
//  FOR FILTERING SEARCH RESULTS
//==========================================
function filterDaysUpdated(pet,day) {
  var petUpdateDate = new Date(pet.lastUpdate.$t);
  return Date.now() < petUpdateDate.setDate(petUpdateDate.getDate()+day);
} //function filterDaysUpdated(pet,day) {

function filterSpayed(pet) {
  var spayFlag = false;
  if (typeof pet.options.option !== 'undefined') {
    nOptions = pet.options.option.length;
    for (var i=0; i< nOptions; i++) {
      if (pet.options.option[i].$t === 'altered') {
        spayFlag = true;
      } //if
    } //for
  } //if
  return spayFlag
} //function

function filterShots(pet) {
  var shotsFlag = false;
  if (typeof pet.options.option !== 'undefined') {
    nOptions = pet.options.option.length;
    for (var i=0; i< nOptions; i++) {
      if (pet.options.option[i].$t === 'hasShots') {
        shotsFlag = true;
      } //if
    } //for
  } //if
  return shotsFlag
} //function

function filterHouseTrained(pet) {
  var houseTrainedFlag = false;
  if (typeof pet.options.option !== 'undefined') {
    nOptions = pet.options.option.length;
    for (var i=0; i< nOptions; i++) {
      if (pet.options.option[i].$t === 'housetrained') {
        houseTrainedFlag = true;
      } //if
    } //for
  } //if
  return houseTrainedFlag
} //function

function filterSizeSmall(pet) {
  var sizeFlag = false;
  if (typeof pet.size.$t !== 'undefined') {
    if (pet.size.$t === 'S') {
      sizeFlag = true;
    }//if(pet.size.$t
  } //if(typeof
  return sizeFlag;
} //function

function filterSizeMedium(pet) {
  var sizeFlag = false;
  if (typeof pet.size.$t !== 'undefined') {
    if (pet.size.$t === 'M') {
      sizeFlag = true;
    }//if(pet.size.$t
  } //if(typeof
  return sizeFlag;
} //function

function filterSizeLarge(pet) {
  var sizeFlag = false;
  if (typeof pet.size.$t !== 'undefined') {
    if (pet.size.$t === 'L') {
      sizeFlag = true;
    }//if(pet.size.$t
  } //if(typeof
  return sizeFlag;
} //function

function filterSizeExtraLarge(pet) {
  var sizeFlag = false;
  if (typeof pet.size.$t !== 'undefined') {
    if (pet.size.$t === 'XL') {
      sizeFlag = true;
    }//if(pet.size.$t
  } //if(typeof
  return sizeFlag;
} //function

//=========================================================
//  FOR ORGANIZING AND MANIPULATING SHELTER SEARCH QUERY
//========================================================

 function Location(lat,lon,zip) {
  this.lat = lat;
  this.lon = lon;
  this.zip = zip;
}



function contactPrettyFormatHTML(inputEmail,inputPhone) {
  var email;
  if (inputEmail) {
    email = inputEmail + '<br>';
  } else {
    email = '';
  }

  var phone;
  if (inputPhone) {
    phone = inputPhone;
  } else {
    phone = '';
  }

  return email+phone;
} //function contactPrettyFormatHTML(email,phone) {

function addressPrettyFormatHTML(inputAddress,inputCity,inputState,inputZip) {
  var address;
  if (inputAddress) {
    address = inputAddress + '<br>';
  } else {
    address = '';
  }

  var city;
  if (inputCity) {
    city = inputCity+', ';
  } else {
    city = '';
  }

  var state;
  if (inputState) {
    state = inputState+' ';
  } else {
    state = '';
  }

  var zip;
  if (inputZip) {
    zip = inputZip;
  } else {
    zip = '';
  }

  var prettyAddress = address+city+state+zip;
  return prettyAddress;
} //function shelterPrettyFormatHTML(inputAddress,inputCity,inputState,inputZip) {

function Shelter(id,name,email,phone,address,location) {
  this.id = id;
  this.name = name;
  this.email = email;
  this.phone = phone;
  this.address = address;
  this.location = location;
  this.contactHTML = contactPrettyFormatHTML(email,phone);
  this.rowHTML = function() {
    var rowHTML = $("<tr>");
    rowHTML.addClass("row-select");
    rowHTML.addClass("tr-style");
    rowHTML.addClass("tr-default-background-color");
    rowHTML.data('id',this.id);
    rowHTML.data('toggle-flag',false);

    var col1HTML = $("<td>");
    col1HTML.addClass("td-style");
    col1HTML.addClass("td-name-style");
    col1HTML.html(this.name);
    rowHTML.append(col1HTML);

    var col2HTML = $("<td>");
    col2HTML.addClass("td-style");
    col2HTML.addClass("td-contact-style");
    col2HTML.html(this.contactHTML);
    rowHTML.append(col2HTML);

    var col3HTML = $("<td>");
    col3HTML.addClass("td-style");
    col3HTML.addClass("td-address-style");
    col3HTML.html(this.address);
    rowHTML.append(col3HTML);

    return rowHTML;
  } //this.rowHTML = function() {
} //function Shelter(id,name,email,phone,address,coordinates)

function createShelterArray(inputArray) {
  var array =[];
  inputArray.forEach(function(shelter) {
    array[array.length] = new Shelter(
      shelter.id.$t,
      shelter.name.$t,
      shelter.email.$t,
      shelter.phone.$t,
      addressPrettyFormatHTML(shelter.address1.$t,shelter.city.$t,shelter.state.$t,shelter.zip.$t),
      new Location(shelter.latitude.$t,shelter.longitude.$t,shelter.zip.$t)
    ); //array[array.length] = new Shelter(
  }); //inputArray.forEach(function(shelter)) {
    return array;
}; //function createShelterArray(inputArray) {




function createTableHTML(shelterArray) {
  var tableHTML = $("<table>");
  tableHTML.addClass("table-style");

  var tableHeaderRow = $("<tr>");
  tableHeaderRow.addClass("tr-header-style");

  var th1 = $("<th>");
  th1.text("Shelter name");
  th1.addClass("tr-style");
  tableHeaderRow.append(th1);

  var th2 = $("<th>");
  th2.text("Contact Information");
  th2.addClass("tr-style");
  tableHeaderRow.append(th2);

  var th3 = $("<th>");
  th3.text("Address");
  th3.addClass("tr-style");
  tableHeaderRow.append(th3);

  tableHTML.append(tableHeaderRow);

  shelterArray.forEach(function(shelter) {
    tableHTML.append(shelter.rowHTML());


  }); //shipArray.forEach(function()){
  return tableHTML;
}//function tableHTML() {


var selection = {
  id: [],
  push: function(selection) {
    if (this.id.indexOf(selection) === -1) {
      this.id.push(selection);
    }
  },//push: function(selection) {,

  pop: function(selection) {
    if (this.id.indexOf(selection) !== -1) {
      this.id.splice(this.id.indexOf(selection),1);
    }
  }, //pop: function(selection) {

//   getCount: function(selection) {
//     for (int i=0; i<this.id.length; i++) {
//       var shelterID = this.id[i];
//       var petQuery = new PetQueryByShelter(shelterID);
//       petQuery.APIcall();
//     }
//   }
 } //var selection = {

//=========================================================
//  FOR QUERY OF SHELTERS BY LOCATION
//========================================================

function ShelterQueryLocation(inputLocation) {
  this.key = "f2d74c99d5bc5124b40b57a6aaade29e"
  this.loc = inputLocation;
  this.count = 20;

  this.getQueryURL = function() {
    var queryURL = "https://api.petfinder.com/shelter.find?key="+this.key+"&location="+this.loc+"&count="+this.count+"&format=json"
    return queryURL;
  };

  this.APIcall = function() {
    $.ajax({
      url: this.getQueryURL(),
      method: "GET",
      jsonp: "callback",
      dataType: "jsonp"
    }).done(function(response) {
      petQueryResult = response.petfinder.shelters.shelter;
    });
  }; //this.APIcall = function() {

  this.updateHTMLtable = function() {
    $.ajax({
      url: this.getQueryURL(),
      method: "GET",
      jsonp: "callback",
      dataType: "jsonp"
    }).done(function(response) {
      shelterQuery = response.petfinder.shelters.shelter;
      shelterArray = createShelterArray(shelterQuery);
      var tableHTML = createTableHTML(shelterArray);
      $('#table').empty();
      $('#table').append(tableHTML);

        $(".row-select").hover(function(){
            $(this).removeClass("tr-default-background-color");
            $(this).addClass("hover-color");
            }, function(){
            $(this).removeClass("hover-color");
            $(this).addClass("tr-default-background-color");
        }); //$(".row-select").hover(function(){

        $(".row-select").on('click',function(){
          var toggleFlag = $(this).data('toggle-flag');
          if (toggleFlag === true) {
            $(this).data('toggle-flag',false);
            $(this).addClass("tr-default-background-color");
            $(this).removeClass("select-color");
            selection.pop($(this).data('id'));
          } else {
            $(this).data('toggle-flag',true);
            $(this).removeClass("tr-default-background-color");
            $(this).addClass("select-color");
            selection.push($(this).data('id'));
          } //if (toggleFlag === true) {
            console.log(selection.id);
        }); //$(".row-select").on('click',function(){
    });//$.ajax({
  }; //this.updateHTMLtable = function() {
} //function ShelterQueryLocation(inputLocation) {


//=========================================================
//  FOR QUERY FOR ANIMALS OF SPECIFIC SHELTER
//========================================================
function querySelectedQueryid(shelterSelectionArray) {
  if (shelterSelectionArray.length === 0) {
    console.log("sorry, no shelters selected!");
  } else {
    petQueryResultArray
    nShelter = shelterSelectionArray.length;
    for (var i=0; i<nShelter; i++) {
        shelterID = shelterSelectionArray[i];
        var petQuery = new PetQueryByShelter(shelterID);
        petQuery.APIcall();
    } //or (var i=0; i<nShelter; i++) {
  }
}



function PetQueryByShelter(shelterID) {
  this.key = "f2d74c99d5bc5124b40b57a6aaade29e"
  this.shelterID = shelterID;
  this.count = 1000;
  this.queryResult = [];

  this.setQueryResult = function() {
    this.queryResult = queryResult2;
  };

  this.getQueryURL = function() {
    var queryURL = "https://api.petfinder.com/shelter.getPets?key=f2d74c99d5bc5124b40b57a6aaade29e&id="+this.shelterID+"&count="+this.count+"&output=full&format=json"
    return queryURL;
  };

  this.APIcall = function() {
    $.ajax({
      url: this.getQueryURL(),
      method: "GET",
      jsonp: "callback",
      dataType: "jsonp"
    }).done(function(response) {
      foobar = response;
      petQueryResult = response.petfinder.pets.pet;
      countResult = new SearchResult(petQueryResult[0].shelterId.$t,petQueryResult);
      petQueryResultArray.push(countResult);
      if (petQueryResultArray.length === selection.id.length) {
        console.log("All done with AJAX calls!");
        plotCharts();
      }
    });
  }; //this.APIcall = function() {
}


//=========================================================
//  COUNTING RSULTS
//========================================================

function Type(nDog,nCat,nSmallFurry,nBarnyard,nBird,nReptile) {
  this.dog = nDog;
  this.cat = nCat;
  this.smallFurry = nSmallFurry;
  this.barnyard = nBarnyard;
  this.bird = nBird;
  this.reptile = nReptile;
}

function countType(petArray) {
  var nDog=0;
  var nCat=0;
  var nSmallFurry=0;
  var nBarnyard=0;
  var nBird=0;
  var nReptile=0;
  petArray.forEach(function(pet) {
      var petAttribute = pet.animal.$t;
      if (petAttribute === 'Dog') {
        nDog++;
      } else if (petAttribute === 'Cat') {
        nCat++;
      } else if (petAttribute === 'Small & Furry') {
        nSmallFurry++;
      } else if (petAttribute === 'nBarnyard') {
        nBarnyard++;
      } else if (petAttribute === 'Bird') {
        nBird++;
      } else if (petAttribute === 'Reptile') {
        nReptile++;
      }
  });
  var petTypes = new Type(nDog,nCat,nSmallFurry,nBarnyard,nBird,nReptile);
  return petTypes;
} //function sortAnimal(petArray) {

function Size(nSmall,nMedium,nLarge,nExtraLarge) {
  this.small = nSmall;
  this.medium = nMedium;
  this.large = nLarge;
  this.extraLarge = nExtraLarge;
}


function countSize(petArray) {
  var nSmall=0;
  var nMedium=0;
  var nLarge=0;
  var nExtraLarge=0;
  petArray.forEach(function(pet) {
      var petAttribute = pet.size.$t;
      if (petAttribute === 'S') {
        nSmall++;
      } else if (petAttribute === 'M') {
        nMedium++;
      } else if (petAttribute === 'L') {
        nLarge++;
      } else if (petAttribute === 'X-L') {
        nExtraLarge++;
      } 
  });
  var petSize = new Size(nSmall,nMedium,nLarge,nExtraLarge);
  return petSize;
} //function sortSize(petArray) {

function Age(nBaby,nYoung,nAdult,nSenior){
    this.baby = nBaby;
    this.young = nYoung;
    this.adult = nAdult;
    this.senior = nSenior;
}

function countAge(petArray) {
  var nBaby=0;
  var nYoung=0;
  var nAdult=0;
  var nSenior=0;
  petArray.forEach(function(pet) {
      var petAttribute = pet.age.$t;
      if (petAttribute === 'Baby') {
        nBaby++;
      } else if (petAttribute === 'Young') {
        nYoung++;
      } else if (petAttribute === 'Adult') {
        nAdult++;
      } else if (petAttribute === 'Senior') {
        nSenior++;
      } 
  });
  var petAge = new Age(nBaby,nYoung,nAdult,nSenior);
  return petAge;
} //function sortSize(petArray) {

function Gender(nMale,nFemale) {
  this.male = nMale;
  this.female = nFemale;
}

function countGender(petArray) {
  var nMale=0;
  var nFemale=0;
  petArray.forEach(function(pet) {
      var petAttribute = pet.sex.$t;
      if (petAttribute === 'M') {
        nMale++;
      } else if (petAttribute === 'F') {
        nFemale++;
      }
  });
  var petGender = new Gender(nMale,nFemale);
  return petGender;
} //function sortSize(petArray) {

function Options(nAltered,nShots,nTrained) {
  this.altered = nAltered;
  this.shots = nShots;
  this.trained = nTrained;
}

function countOptions(petArray) {
  var nAltered=0;
  var nShots=0;
  var nTrained=0;
  petArray.forEach(function(pet) {
      if (typeof pet.options.option !== 'undefined') {
        nOptions = pet.options.option.length;
        for (var i=0; i< nOptions; i++) {
          if (pet.options.option[i].$t === 'altered') {
            nAltered++;
          } else if (pet.options.option[i].$t === 'hasShots') {
              nShots++;
          } else if (pet.options.option[i].$t === 'housetrained') {
            nTrained++;
          } //if (pet.options.option[i].$t === 'altered') {
        }
      } //if (typeof pet.options.option !== 'undefined') {
  });
  var petOption = new Options(nAltered,nShots,nTrained);
  return petOption;
} //function sortSize(petArray) {


function getShelterName(shelterId) {
  var shelterName;
  for (var i = 0; i<shelterArray.length; i++) {
    if (shelterArray[i].id === shelterId) {
      shelterName = shelterArray[i].name;
    }
  } //for (var i = 0; i<shelterArray.length, i++) {
  return shelterName;
} //function getShelterName(shelterId) {


function SearchResult(shelterID,petArray) {
  this.shelterID = shelterID;
  this.shelterName = getShelterName(shelterID);
  this.count = petArray.length;
  this.age = countAge(petArray);
  this.type = countType(petArray);
  this.size = countSize(petArray);
  this.gender = countGender(petArray);
  this.option = countOptions(petArray);
}





var color = ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#c94cba"];

function plotPetAges(petQueryResultArray) {
  var labels = [];

  //CREATING THE LABEL NAMES
  for (var i=0; i < petQueryResultArray.length; i++) {
    var search = petQueryResultArray[i];
    labels.push(search.shelterName)
  }

  var dataset = [];

  //DATA FOR BABY
  var count = [];
  for (var i=0; i < petQueryResultArray.length; i++) {
    var search = petQueryResultArray[i];
    count.push(search.age.baby);
  }
  var data = {
    label: "baby",
    backgroundColor: color[0],
    data: count
  }
  dataset.push(data);

  //DATA FOR YOUNG
  var count = [];
  for (var i=0; i < petQueryResultArray.length; i++) {
    var search = petQueryResultArray[i];
    count.push(search.age.young);
  }
  var data = {
    label: "young",
    backgroundColor: color[1],
    data: count
  }
  dataset.push(data);

  //DATA FOR ADULT
  var count = [];
  for (var i=0; i < petQueryResultArray.length; i++) {
    var search = petQueryResultArray[i];
    count.push(search.age.adult);
  }
  var data = {
    label: "adult",
    backgroundColor: color[2],
    data: count
  }
  dataset.push(data);

  //DATA FOR SENIOR
  var count = [];
  for (var i=0; i < petQueryResultArray.length; i++) {
    var search = petQueryResultArray[i];
    count.push(search.age.senior);
  }
  var data = {
    label: "senior",
    backgroundColor: color[3],
    data: count
  }
  dataset.push(data);


  new Chart(document.getElementById("chart-age"), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: dataset,
    }, //data: {
    options: {
      title: {
        display: true,
        text: 'Pets by Age'
      }
    } //options: {
  }); //new Chart(document.getElementById("bar-chart-grouped"), {
}; //function plotPetTypes(petQueryResultArray) {



function plotPetTypes(petQueryResultArray) {
  var labels = [];

  //CREATING THE LABEL NAMES
  for (var i=0; i < petQueryResultArray.length; i++) {
    var search = petQueryResultArray[i];
    labels.push(search.shelterName)
  }

  var dataset = [];

  //DATA FOR DOGS
  var count = [];
  for (var i=0; i < petQueryResultArray.length; i++) {
    var search = petQueryResultArray[i];
    count.push(search.type.dog);
  }
  var data = {
    label: "Dog",
    backgroundColor: color[0],
    data: count
  }
  dataset.push(data);

  //DATA FOR CATS
  var count = [];
  for (var i=0; i < petQueryResultArray.length; i++) {
    var search = petQueryResultArray[i];
    count.push(search.type.cat);
  }
  var data = {
    label: "Cat",
    backgroundColor: color[1],
    data: count
  }
  dataset.push(data);

  //DATA FOR BIRDS
  var count = [];
  for (var i=0; i < petQueryResultArray.length; i++) {
    var search = petQueryResultArray[i];
    count.push(search.type.bird);
  }
  var data = {
    label: "Bird",
    backgroundColor: color[2],
    data: count
  }
  dataset.push(data);

  //DATA FOR SMALL & FURRY
  var count = [];
  for (var i=0; i < petQueryResultArray.length; i++) {
    var search = petQueryResultArray[i];
    count.push(search.type.smallFurry);
  }
  var data = {
    label: "Small & Furry",
    backgroundColor: color[3],
    data: count
  }
  dataset.push(data);

  //DATA FOR REPTILE
  var count = [];
  for (var i=0; i < petQueryResultArray.length; i++) {
    var search = petQueryResultArray[i];
    count.push(search.type.reptile);
  }
  var data = {
    label: "Reptile",
    backgroundColor: color[4],
    data: count
  }
  dataset.push(data);


  new Chart(document.getElementById("chart-type"), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: dataset,
    }, //data: {
    options: {
      title: {
        display: true,
        text: 'Pets by Type'
      }
    } //options: {
  }); //new Chart(document.getElementById("bar-chart-grouped"), {
}; //function plotPetTypes(petQueryResultArray) {

function plotPetSizes(petQueryResultArray) {
  var labels = [];

  //CREATING THE LABEL NAMES
  for (var i=0; i < petQueryResultArray.length; i++) {
    var search = petQueryResultArray[i];
    labels.push(search.shelterName)
  }

  var dataset = [];

  //DATA FOR SMALL
  var count = [];
  for (var i=0; i < petQueryResultArray.length; i++) {
    var search = petQueryResultArray[i];
    count.push(search.size.small);
  }
  var data = {
    label: "Small",
    backgroundColor: color[0],
    data: count
  }
  dataset.push(data);

  //DATA FOR Medium
  var count = [];
  for (var i=0; i < petQueryResultArray.length; i++) {
    var search = petQueryResultArray[i];
    count.push(search.size.medium);
  }
  var data = {
    label: "Medium",
    backgroundColor: color[1],
    data: count
  }
  dataset.push(data);

  //DATA FOR Large
  var count = [];
  for (var i=0; i < petQueryResultArray.length; i++) {
    var search = petQueryResultArray[i];
    count.push(search.size.large);
  }
  var data = {
    label: "Large",
    backgroundColor: color[2],
    data: count
  }
  dataset.push(data);

  //DATA FOR Extra Large
  var count = [];
  for (var i=0; i < petQueryResultArray.length; i++) {
    var search = petQueryResultArray[i];
    count.push(search.size.extraLarge);
  }
  var data = {
    label: "Extra Large",
    backgroundColor: color[3],
    data: count
  }
  dataset.push(data);



  new Chart(document.getElementById("chart-size"), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: dataset,
    }, //data: {
    options: {
      title: {
        display: true,
        text: 'Pets by Size'
      }
    } //options: {
  }); //new Chart(document.getElementById("bar-chart-grouped"), {
}; //function plotPetTypes(petQueryResultArray) {


function plotPetOptions(petQueryResultArray) {
  var labels = [];

  //CREATING THE LABEL NAMES
  for (var i=0; i < petQueryResultArray.length; i++) {
    var search = petQueryResultArray[i];
    labels.push(search.shelterName)
  }

  var dataset = [];

  //DATA FOR SMALL
  var count = [];
  for (var i=0; i < petQueryResultArray.length; i++) {
    var search = petQueryResultArray[i];
    count.push(search.option.altered);
  }
  var data = {
    label: '"Fixed"',
    backgroundColor: color[0],
    data: count
  }
  dataset.push(data);

  //DATA FOR Medium
  var count = [];
  for (var i=0; i < petQueryResultArray.length; i++) {
    var search = petQueryResultArray[i];
    count.push(search.option.shots);
  }
  var data = {
    label: "Has Shots",
    backgroundColor: color[1],
    data: count
  }
  dataset.push(data);

  //DATA FOR Large
  var count = [];
  for (var i=0; i < petQueryResultArray.length; i++) {
    var search = petQueryResultArray[i];
    count.push(search.option.trained);
  }
  var data = {
    label: "Trained",
    backgroundColor: color[2],
    data: count
  }
  dataset.push(data);



  new Chart(document.getElementById("chart-options"), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: dataset,
    }, //data: {
    options: {
      title: {
        display: true,
        text: 'Pets by Options'
      }
    } //options: {
  }); //new Chart(document.getElementById("bar-chart-grouped"), {
}; //function plotPetTypes(petQueryResultArray) {


function plotCharts() {
  console.log(petQueryResultArray);
  plotPetAges(petQueryResultArray);
  plotPetTypes(petQueryResultArray);
  plotPetSizes(petQueryResultArray);
  plotPetOptions(petQueryResultArray);
}

$("#locationSubmitButton").on("click",function() {
  clearCharts()
  var location = $("#locationShelterQuery").val();
  shelterQueryObj = new ShelterQueryLocation(location);
  shelterQueryObj.updateHTMLtable();
});

function clearCharts() {
  $("#chart-age").empty();
  $("#chart-size").empty();
  $("#chart-age").empty();
  $("#chart-age").empty();
}