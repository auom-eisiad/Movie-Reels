// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=1df82d2f
// example of how the api url http://www.omdbapi.com/?t=the+shining&plot=full

var movieForm = $('#movie-form');
var userInput = $('#movie-name');
var movieTitle = $('#title');
var moviePlot = $('.plot');
var movieRating = $('.rating');
var moviePic = $('.poster');
var movTrailerEl = $('iframe');
var watchIconEl = $('#watchIcon')
var favIconEl = $('#favIcon'); 
var goBack = $('.logo');
var inputValue = ''
var watchIteration = 0
var favIteration = 0
var LS = {
    list: []
}

if (!localStorage.getItem('favIteration')){
    favIteration = 0
} else {
    favIteration = localStorage.getItem('favIteration')
}

// When clicking on the logo, user is taken back to splash page
goBack.on("click", function(event) {
    event.preventDefault();

    document.location.replace('./moviereels.html');
});

if (!localStorage.getItem('watchIteration')){
    watchIteration = 0
} else {
    watchIteration = localStorage.getItem('watchIteration')
}

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
    // remove the "is-sr-only" tag
    var displayPoster = document.querySelector(".poster");
    displayPoster.classList.remove("is-sr-only");

    var apiUrl = 'https://www.omdbapi.com/?t=' + input + '&plot=full&apikey=1df82d2f';

    // fetching the apiUrl and then getting the data. 
    fetch(apiUrl, {
        referrer: "unsafe-url"
    })

        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

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
                    const valueColor = "#fcc200";
                    const ratingHTML = `<p>${source}: <span style="color: ${valueColor};">${value}</span></p>`;
                    ratingsHTML += ratingHTML;
                });

                // Display the ratings HTML in an element with the id rating
                document.getElementById('rating').innerHTML = ratingsHTML;
            }
        });
        
};

// function for movie poster
function moviePoster(input) {

    // remove the "is-sr-only" tag
    var movieTitle = document.querySelector("#title");
    movieTitle.classList.remove("is-sr-only");

    var displayPoster = document.querySelector(".poster");
    displayPoster.classList.remove("is-sr-only");

    var watchLaterIcon = document.querySelector(".watchLater");
    watchLaterIcon.classList.remove("is-sr-only");

    var favMovieIcon = document.querySelector(".love");
    favMovieIcon.classList.remove("is-sr-only");

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


        // Retrieve the poster image URL
        var posterURL = "https://image.tmdb.org/t/p/w500" + movie.poster_path;

        // display the movie poster in the img element
        moviePic.attr('src', posterURL);
        moviePic.removeClass('d-none')
        watchIconEl.removeClass('d-none')
        favIconEl.removeClass('d-none')

        // switches star button back to silohuette when a new search is clicked
        $('i.fa-star').removeClass('fa-solid');
        $('i.fa-star').addClass('fa-regular');

        // switches heart button back to silohuette when a new search is clicked
        $('i.fa-heart').removeClass('fa-solid');
        $('i.fa-heart').addClass('fa-regular');




    })
    .catch(function(error) {
        console.log(error);
    });

};

// youtube function for movie trailer
function movieTrailer(input) {

// grabbing and saving the movie year of the movie to add to the search result for a more narrowed down result
    movieAPI = 'https://www.omdbapi.com/?t=' + input + '&plot=full&apikey=1df82d2f';

    fetch(movieAPI, {
        referrer: "unsafe-url"
    })
    
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var movieYear = data.Year
        localStorage.setItem('movieYear', movieYear)

        // refence the youtube api. Also note that trailer and movieYear is part of the search result
        var trailerAPI = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=" + input + "+" + movieYear +"+trailer&key=AIzaSyCPwPkuOKdEBvPA0HbuhvkFs-xIAyb94Uc";
        return fetch(trailerAPI);
    })
    
    // fetch(trailerAPI)
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

// on clicking the watchIcon it will generate a new li in the watch list ul. Along with that it will create a unique id with the 'i' variable for saving locally
watchIconEl.on('click', function() {

    // removes outline of star button and replaces with solid one
    $('i.fa-star').removeClass('fa-regular');
    $('i.fa-star').addClass('fa-solid');

    if (fetchedList.list.length == 0) {

        //   creates the li element for the watch list
        var liElement = $('<li>').attr('id', 'list-' +watchIteration).addClass('ui-state-default border border-2 rounded hover-element').text(inputValue)
        var removeButton = $('<button>').attr('id', 'btn-item-' +i).addClass('remove-btn hover-button').text('X')

        removeButton.css({
            padding: '0.3rem 0.7rem',
            position: 'absolute',
            top: '0rem',
            left: '12rem',
            backgroundColor: '#b40404'
        });

        //  fetches from local storage if the movie list exists
    
        //  creating new object with key/value equal to the list iterator and movie name to set to local storage
        var objKey = 'list-' + watchIteration
        var newObj = {}
        newObj[objKey] = inputValue
        
        //  pushes the new movie object into the array within fetchedList
        fetchedList.list.push(newObj)
        localStorage.setItem('watchList', JSON.stringify(fetchedList))
    
        $('#sortable').append(liElement)
        $('#sortable').append(removeButton)

        liElement.on('click', function() {
            inputValue = $(this).text();
            var textContent = $(this).text();
            textContentWS = textContent.replace(/\s/g, "+");
            movieApi(textContentWS);
            moviePoster(textContentWS);
            movieTrailer(textContentWS);
            })
    
        watchIteration++
        localStorage.setItem('watchIteration', watchIteration)

    } else {

        // creating a blank array to push the local saved items into
        var movieArray = [];
        
        for (var i = 0; i < fetchedList.list.length ;i++) {

            var listObj = fetchedList.list[i]
            key = Object.keys(listObj)[0]
            movieName = fetchedList.list[i][key]
            movieArray.push(movieName)
            
        }
        // checking the movieArray to see if the input value matches.
        if (!movieArray.includes(inputValue)) {
            
            // creating an empty fetched list if no locally saved data
            if (!JSON.parse(localStorage.getItem('watchList')))
            {
                fetchedList = {
                    list: []
                }

            }

            // updating the fetchedlist if there is
            else {
                fetchedList = JSON.parse(localStorage.getItem('watchList'))
            }
            
            //   creates the li element for the watch list
            var liElement = $('<li>').attr('id', 'list-' +watchIteration).addClass('ui-state-default border border-2 rounded hover-element').text(inputValue)
            var removeButton = $('<button>').attr('id', 'btn-item-' +i).addClass('remove-btn hover-button').text('X')

            removeButton.css({
                padding: '0.3rem 0.7rem',
                position: 'absolute',
                top: '0rem',
                left: '12rem',
                backgroundColor: '#b40404'
            });

            //  fetches from local storage if the movie list exists
        
            //  creating new object with key/value equal to the list iterator and movie name to set to local storage
            var objKey = 'list-' + watchIteration
            var newObj = {}
            newObj[objKey] = inputValue
            
            //  pushes the new movie object into the array within fetchedList
            fetchedList.list.push(newObj)
            localStorage.setItem('watchList', JSON.stringify(fetchedList))
        
            $('#sortable').append(liElement)
            $('#sortable').append(removeButton)
        
            watchIteration++
            localStorage.setItem('watchIteration', watchIteration)    
        }

    } 
    
});

// fetching saved fav movies when page loads
if (!JSON.parse(localStorage.getItem('watchList')))
{
    fetchedList = {
        list: []
    }
}
else {
    fetchedList = JSON.parse(localStorage.getItem('watchList'))
}

// for loop that on page load iterates through the localStorage and then adds the list items to the favorites list. 
for (var i = 0; i < fetchedList.list.length ;i++) {
    var listObj = fetchedList.list[i]
    key = Object.keys(listObj)[0]

    movieName = fetchedList.list[i][key]
    var liElement = $('<li>').attr('id', key).addClass('ui-state-default border border-2 rounded hover-element me-1 m-1 d-inline-block w-75').text(movieName)
    var removeButton = $('<button>').attr('id', 'btn-item-' +i).addClass('remove-btn').text('X')


    // append the remove button to the liEliment
    // liElement.append(removeButton)

    $('#sortable').append(liElement)
    $('#sortable').append(removeButton)
    liElement.on('click', function() {
        inputValue = $(this).text();
        var textContent = $(this).text();
        textContentWS = textContent.replace(/\s/g, "+");
        movieApi(textContentWS);
        moviePoster(textContentWS);
        movieTrailer(textContentWS);
        })

}
    
// function to add on click search on the watch list buttons
$('#sortable').on('click', '.remove-btn', function() {
    var listItem = $(this).prev(); // Select the previous sibling (li element)
    var listItemId = $(this).prev().attr('id') // gets the id of the list element
    
    fetchedList.list = fetchedList.list.filter(item => !item.hasOwnProperty(listItemId))
        
    listItem.remove();
    $(this).remove(); // Remove the clicked remove button
    localStorage.setItem('watchList', JSON.stringify(fetchedList));
  });

$( function() {
    $( "#favSortable" ).sortable();
});

//   on clicking the favIcon it will generate a new li in the fav list ul. Along with that it will create a unique id with the 'i' variable for saving locally
favIconEl.on('click', function() {

    // removes outline of heart button and replaces with solid  heart on
    $('i.fa-heart').removeClass('fa-regular');
    $('i.fa-heart').addClass('fa-solid');

    if (fetchedFav.list.length == 0) {

        //   creates the li element for the watch list
        var liElement = $('<li>').attr('id', 'fav-' +favIteration).addClass('ui-state-default border border-2 rounded hover-element').text(inputValue)
        var removeButton = $('<button>').attr('id', 'btn-item-' +i).addClass('remove-btn hover-button').text('X')

        removeButton.css({
            padding: '0.3rem 0.7rem',
            position: 'absolute',
            top: '0rem',
            left: '12rem',
            backgroundColor: '#b40404'
        });

        //  fetches from local storage if the movie list exists
    
        //  creating new object with key/value equal to the list iterator and movie name to set to local storage
        var objKey = 'fav-' + favIteration
        var newObj = {}
        newObj[objKey] = inputValue
        
        //  pushes the new movie object into the array within fetchedList
        fetchedFav.list.push(newObj)
        localStorage.setItem('favList', JSON.stringify(fetchedFav))
    
        $('#favSortable').append(liElement)
        $('#favSortable').append(removeButton)

        liElement.on('click', function() {
            inputValue = $(this).text();
            var textContent = $(this).text();
            textContentWS = textContent.replace(/\s/g, "+");
            movieApi(textContentWS);
            moviePoster(textContentWS);
            movieTrailer(textContentWS);
            })
    
        favIteration++
        localStorage.setItem('favIteration', favIteration)

    } else {

        // creating a blank array to push the local saved items into
        var movieArray = [];
        
        for (var i = 0; i < fetchedFav.list.length ;i++) {

            var listObj = fetchedFav.list[i]
            key = Object.keys(listObj)[0]
            movieName = fetchedFav.list[i][key]
            movieArray.push(movieName)
            
        }
        // checking the movieArray to see if the input value matches.
        if (!movieArray.includes(inputValue)) {

            // fetches from local storage if the movie list exsits
            if (!JSON.parse(localStorage.getItem('favList')))
            {
                fetchedFav = {
                    list: []
                }
            }

            // updating the fav list if there is
            else {
                fetchedFav = JSON.parse(localStorage.getItem('favList'))
            }

            //   creates the li element for the fav list
            var liElement = $('<li>').attr('id', 'fav-' +favIteration).addClass('ui-state-default border border-2 rounded hover-element').text(inputValue)
            var removeButton = $('<button>').attr('id', 'btn-item-' +i).addClass('remove-btn').text('X')
            
            //  creating new object with key/value equal to the list iterator and movie name to set to local storage
            var objKey = 'fav-' + favIteration
            var newObj = {}
            newObj[objKey] = inputValue
            
            //  pushes the new movie object into the array within fetchedList
            fetchedFav.list.push(newObj)
            localStorage.setItem('favList', JSON.stringify(fetchedFav))
            
            $('#favSortable').append(liElement)
            $('#favSortable').append(removeButton)
            
            favIteration++
            localStorage.setItem('favIteration', favIteration)

        }  
    }
});

// fetches favorite list from local storage and displays on page load
if (!JSON.parse(localStorage.getItem('favList')))
{
    fetchedFav = {
        list: []
    }
}
else {
    fetchedFav = JSON.parse(localStorage.getItem('favList'))
}

for (var i = 0; i < fetchedFav.list.length ;i++) {
    var listObj = fetchedFav.list[i]
    key = Object.keys(listObj)[0]

    movieName = fetchedFav.list[i][key]
    var liElement = $('<li>').attr('id', key).addClass('ui-state-default border border-2 rounded hover-element me-1 m-1 d-inline-block w-75').text(movieName)
    var removeButton = $('<button>').attr('id', 'btn-item-' +i).addClass('remove-btn hover-button').text('X')

    removeButton.css({
        padding: '0.3rem 0.7rem',
        position: 'absolute',
        top: '0rem',
        left: '12rem',
        backgroundColor: '#b40404'
    });

    // append the remove button to the liEliment
    // liElement.append(removeButton)

    $('#favSortable').append(liElement)
    $('#favSortable').append(removeButton)

    liElement.on('click', function() {
        var textContent = $(this).text();
        textContentWS = textContent.replace(/\s/g, "+");
        movieApi(textContentWS);
        moviePoster(textContentWS);
        movieTrailer(textContentWS);
        })

}

$('#favSortable').on('click', '.remove-btn', function() {
    var listItem = $(this).prev(); // Select the previous sibling (li element)
    var listItemId = $(this).prev().attr('id') // gets the id of the list element
    
    fetchedFav.list = fetchedFav.list.filter(item => !item.hasOwnProperty(listItemId))
        
    listItem.remove();
    $(this).remove(); // Remove the clicked remove button
    localStorage.setItem('favList', JSON.stringify(fetchedFav));
  
});