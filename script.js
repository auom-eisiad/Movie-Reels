// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=1df82d2f
// when user input name, have it seperate by each space and then input the string individually. 
// when api response have it give error
// example of how the api url http://www.omdbapi.com/?t=the+shining&plot=full

var movieForm = $('#movie-form');
var userInput = $('#movie-name');
var movieTitle = $('#title');
var moviePlot = $('.plot');
var movieRating = $('.rating');
var moviePic = $('.poster');
var movTrailerEl = $('iframe');
var watchIconEl = $('#watchIcon')
var favIconEl = $('.fa-regular'); 
var inputValue = ''
var iteration = 0

// event listener that takes user input
movieForm.on('submit', function(event) {
    event.preventDefault();
    inputValue = userInput.val();

    // using .replace(/\s/g, "+") to replace the white space from the user input with "+" before adding to apiUrl
    var inputValueWS = inputValue.replace(/\s/g, "+");

    movieApi(inputValueWS);
    moviePoster(inputValueWS);
    movieTrailer(inputValueWS);
});

function validateForm() {
    var x = document.forms["movie-form"]["movie-name"].value;
    if (x == "" || x == null) {
      alert("Please type in a movie name :)");
      return false;
    }
  }

var movieApi = function(input) {
    var apiUrl = 'http://www.omdbapi.com/?t=' + input + '&plot=full&apikey=1df82d2f';

    // fetching the apiUrl and then getting the data. 
    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
             console.log(data)

            //if user inputs gibberish or text that doesn't match anything in omdbapi.com it displays the message 'Movie not found!'
            if(data.Error === 'Movie not found!') {
                alert(data.Error);
            }
            else {
                // updates the display title
                movieTitle.text(data.Title);

                // updates the movie plot element
                moviePlot.text(data.Plot);

                // updates the critic review scores by going through the ratings object.     
                const ratings = data.Ratings;
                    let ratingsHTML = '';
                    ratings.forEach(rating => {
                    const source = rating.Source;
                    const value = rating.Value;
                    const ratingHTML = `<p>${source}</p><p>Rating: ${value}</p>`;
                    ratingsHTML += ratingHTML;
                });

                // Display the ratings HTML in an element with the id rating
                document.getElementById('rating').innerHTML = ratingsHTML;
            }
        });
};

// function for movie poster
function moviePoster(input) {
    // the api url for the poster 
    var posterAPI = "https://api.themoviedb.org/3/search/movie?query=" + input + "&api_key=b935e23b4ae8daff658903f94d9e2c61";

    // api request for the movie poster
    fetch(posterAPI)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        // Access the first movie in the response
        var movie = data.results[0];

        // console.log(movie);

        // Retrieve the poster image URL
        var posterURL = "https://image.tmdb.org/t/p/w500" + movie.poster_path;

        // display the movie poster in the img element
        moviePic.attr('src', posterURL);
        moviePic.removeClass('d-none')
        watchIconEl.removeClass('d-none')
        favIconEl.removeClass('d-none')
    })
    .catch(function(error) {
        console.log(error);
    });

};

// youtube function for movie trailer
function movieTrailer(input) {

    // refence the youtube api. Also note that trailer is part of the search result
    var trailerAPI = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=" + input + "+trailer&key=AIzaSyCPwPkuOKdEBvPA0HbuhvkFs-xIAyb94Uc";

    fetch(trailerAPI)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {

        // takes the first result and then update the iframe src with it
        trailerId = data.items[0].id.videoId
        trailerURL = 'https://www.youtube.com/embed/'+ trailerId + '?rel=0'
        movTrailerEl.attr('src', trailerURL)
    });
};

$( function() {
    $( "#sortable" ).sortable();
  } );
  
//   on clicking the watchIcon it will generate a new li in the watch list ul. Along with that it will create a unique id with the 'i' variable for saving locally
  watchIconEl.on('click', function() {
    
    //   creates the li element for the watch list
    var liElement = $('<li>').attr('id', 'list-' +iteration).addClass('ui-state-default border border-2 rounded hover-element').text(inputValue)
    
    localStorage.setItem('list-' +iteration, inputValue)

    $('#sortable').append(liElement)

    liElement.on('click', function() {
    var textContent = $(this).text();
    textContentWS = textContent.replace(/\s/g, "+");
    movieApi(textContentWS);
    moviePoster(textContentWS);
    movieTrailer(textContentWS);
    })
    iteration++
    } )

    // for loop that on page load iterates through the localStorage and then adds the list items to the watch list. 
for (var i = 0; i < localStorage.length;i++) {
    movieName = localStorage.getItem('list-' + i)
    var liElement = $('<li>').attr('id', 'list-' +i).addClass('ui-state-default border border-2 rounded hover-element').text(movieName)
    $('#sortable').append(liElement)
    liElement.on('click', function() {
        var textContent = $(this).text();
        textContentWS = textContent.replace(/\s/g, "+");
        movieApi(textContentWS);
        moviePoster(textContentWS);
        movieTrailer(textContentWS);
        })
    
}

$( function() {
    $( "#favSortable" ).sortable();
});
  
//   on clicking the favIcon it will generate a new li in the fav list ul. Along with that it will create a unique id with the 'i' variable for saving locally
favIconEl.on('click', function() {

    // removes outline of heart button and replaces with solid  heart on
    $('i.fa-heart').removeClass('fa-regular');
    $('i.fa-heart').addClass('fa-solid');

    //   creates the li element for the fav list
    var liElement = $('<li>').attr('id', 'fav-' +iteration).addClass('ui-state-default border border-2 rounded hover-element').text(inputValue)

    localStorage.setItem('fav-' +iteration, inputValue)

    $('#favSortable').append(liElement)

    liElement.on('click', function() {
    var textContent = $(this).text();
    textContentWS = textContent.replace(/\s/g, "+");
    movieApi(textContentWS);
    moviePoster(textContentWS);
    movieTrailer(textContentWS);
    })
    iteration++ 
    // console.log(iteration);
    // localStorage.setItem('iteration', iteration)

} )

// for loop that on page load iterates through the localStorage and then adds the fav items to the fav list. 
for (var i = 0; i < localStorage.length; i++) {
    
    if(localStorage.key(i).startsWith('fav')) {
        movieName = localStorage.getItem(localStorage.key(i));
       
        if (movieName) {
            var liElement = $('<li>').attr('id', 'fav-' +i).addClass('ui-state-default border border-2 rounded hover-element').text(movieName)
            $('#favSortable').append(liElement);

            liElement.on('click', function() {
                var textContent = $(this).text();
                textContentWS = textContent.replace(/\s/g, "+");
                movieApi(textContentWS);
                moviePoster(textContentWS);
                movieTrailer(textContentWS);
            })
        }; 
    }
}