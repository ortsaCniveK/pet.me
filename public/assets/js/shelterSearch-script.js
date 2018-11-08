//==========================================
//   DECLARING VARIABLES TO BE USED LATER
//==========================================

var petArrayQuery = new Array();
var petArrayFilter = new Array();
var shelterQuery;
var shelterArray = [];
var shelterQueryObj;
var petQuery;
var petQueryResult;
var petQueryResultArray = [];

var foobar;


//==========================================
//   AJAX SEARCH
//==========================================

var petArrayQuery = new Array();

//var queryURL = "https://api.petfinder.com/shelter.find?key=f2d74c99d5bc5124b40b57a6aaade29e&location=92110&format=json";



$( document ).ready(function() {
	


}); //$( document ).ready(function() {

$("#submit-button").on("click",function() {
	petQueryResultArray=[];
	console.log("clicked!");
	querySelectedQueryid(selection.id);
});