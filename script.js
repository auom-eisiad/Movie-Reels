// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=1df82d2f
// when user input name, have it seperate by each space and then input the string individually. 
// when api response have it give error
// example of how the api url http://www.omdbapi.com/?t=the+shining&plot=full

var movieForm = $('#movie-form');
var userInput = $('#movie-name');
var movieTitle = $('#title');

// event listener that takes user input
movieForm.on('submit', function(event) {
    event.preventDefault();
    var inputValue = userInput.val();
    // using .replace(/\s/g, "+") to replace the white space from the user input with "+" before adding to apiUrl
    var inputValue = inputValue.replace(/\s/g, "+");

    movieApi(inputValue)
});

var movieApi = function(input) {
    var apiUrl = 'http://www.omdbapi.com/?t=' + input + '&plot=full&apikey=1df82d2f';

    // fetching the apiUrl and then getting the data. 
    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
        
        // updates the display title
        movieTitle.text(data.Title);

    });
};