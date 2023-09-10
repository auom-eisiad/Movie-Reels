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
var favIconEl = $('#favIcon'); 
var inputValue = ''
var watchIteration = 0
var favIteration = 0
var LS = {
    list: []
}

// WIP
if (!localStorage.getItem('favIteration')){
    favIteration = 0
} else {
    favIteration = localStorage.getItem('favIteration')
}

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
    // movieTrailer(inputValueWS);
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

    var apiUrl = 'http://www.omdbapi.com/?t=' + input + '&plot=full&apikey=1df82d2f';

    // fetching the apiUrl and then getting the data. 
    fetch(apiUrl)

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

        // console.log(movie);

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
    movieAPI = 'http://www.omdbapi.com/?t=' + input + '&plot=full&apikey=1df82d2f';

    fetch(movieAPI)
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
        // trailerURL = 'https://www.youtube.com/embed/'+ trailerId + '?rel=0'
        // movTrailerEl.attr('src', trailerURL)
    });
};


$( function() {
    $( "#sortable" ).sortable();
} );

//   on clicking the watchIcon it will generate a new li in the watch list ul. Along with that it will create a unique id with the 'i' variable for saving locally
watchIconEl.on('click', function() {

    // removes outline of star button and replaces with solid one
    $('i.fa-star').removeClass('fa-regular');
    $('i.fa-star').addClass('fa-solid');

    if (fetchedList.list.length == 0) {

        //   creates the li element for the watch list
        var liElement = $('<li>').attr('id', 'list-' +watchIteration).addClass('ui-state-default border border-2 rounded hover-element').text(inputValue)

        //  fetches from local storage if the movie list exists
    
        //  creating new object with key/value equal to the list iterator and movie name to set to local storage
        var objKey = 'list-' + watchIteration
        var newObj = {}
        newObj[objKey] = inputValue
        
        //  pushes the new movie object into the array within fetchedList
        fetchedList.list.push(newObj)
        localStorage.setItem('watchList', JSON.stringify(fetchedList))
    
        $('#sortable').append(liElement)
    
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
            console.log(movieName)
            
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
            
            //  fetches from local storage if the movie list exists
        
            //  creating new object with key/value equal to the list iterator and movie name to set to local storage
            var objKey = 'list-' + watchIteration
            var newObj = {}
            newObj[objKey] = inputValue
            
            //  pushes the new movie object into the array within fetchedList
            fetchedList.list.push(newObj)
            localStorage.setItem('watchList', JSON.stringify(fetchedList))
        
            $('#sortable').append(liElement)
        
            watchIteration++
            localStorage.setItem('watchIteration', watchIteration)
    
        }
    } 
    
});

//  fetching saved fav movies when page loads
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
        // movieTrailer(textContentWS);
        })

}


// function to add on click search on the watch list buttons
// $('#sortable').on('click', function() {
//     inputValue = $(this).text();
//     var textContent = $(this).text();
//     textContentWS = textContent.replace(/\s/g, "+");
//     movieApi(textContentWS);dd
//     moviePoster(textContentWS);
//     // movieTrailer(textContentWS);
//     })


$('#sortable').on('click', '.remove-btn', function() {
    var listItem = $(this).prev(); // Select the previous sibling (li element)
    var buttonId = $(this).attr('id');
    var listItemId = $(this).prev().attr('id') // gets the id of the list element
    // var index = buttonId.split('-')[2];
    
    fetchedList.list = fetchedList.list.filter(item => !item.hasOwnProperty(listItemId))
    
    console.log("updated fetechedList", fetchedList)
    
    listItem.remove();
    $(this).remove(); // Remove the clicked remove button
    localStorage.setItem('watchList', JSON.stringify(fetchedList));
  });

$( function() {
    $( "#favSortable" ).sortable();
});

// WIP
//   on clicking the favIcon it will generate a new li in the fav list ul. Along with that it will create a unique id with the 'i' variable for saving locally
favIconEl.on('click', function() {

    // removes outline of heart button and replaces with solid  heart on
    $('i.fa-heart').removeClass('fa-regular');
    $('i.fa-heart').addClass('fa-solid');
    
    //   creates the li element for the fav list
    var liElement = $('<li>').attr('id', 'fav-' +favIteration).addClass('ui-state-default border border-2 rounded hover-element').text(inputValue)
    
    // fetches from local storage if the movie list exsits
    
    if (!JSON.parse(localStorage.getItem('favList')))
    {
        favList = {
            list: []
        }
    }
    else {
        favList = JSON.parse(localStorage.getItem('favList'))
    }

    //  creating new object with key/value equal to the list iterator and movie name to set to local storage
    var objKey = 'list-' + favIteration
    var newObj = {}
    newObj[objKey] = inputValue
    
    //  pushes the new movie object into the array within fetchedList
    favList.list.push(newObj)
    localStorage.setItem('favList', JSON.stringify(favList))
    
    $('#favSortable').append(liElement)
    
    favIteration++
    localStorage.setItem('favIteration', favIteration)
});

// fetches favorite list from local storage and displays on page load
if (!JSON.parse(localStorage.getItem('favList')))
{
    favList = {
        list: []
    }
}
else {
    favList = JSON.parse(localStorage.getItem('favList'))
}

for (var i = 0; i < favList.list.length ;i++) {
    var listObj = favList.list[i]
    key = Object.keys(listObj)[0]

    movieName = favList.list[i][key]
    var liElement = $('<li>').attr('id', key).addClass('ui-state-default border border-2 rounded hover-element me-1 m-1 d-inline-block w-75').text(movieName)
    var removeButton = $('<button>').attr('id', 'btn-item-' +i).addClass('remove-btn').text('X')

    // append the remove button to the liEliment
    // liElement.append(removeButton)

    $('#favSortable').append(liElement)
    $('#favSortable').append(removeButton)

    liElement.on('click', function() {
        var textContent = $(this).text();
        textContentWS = textContent.replace(/\s/g, "+");
        movieApi(textContentWS);
        moviePoster(textContentWS);
        // movieTrailer(textContentWS);
        })

}

$('#favSortable').on('click', '.remove-btn', function() {
     var listItem = $(this).prev(); // Select the previous sibling (li element)
    var buttonId = $(this).attr('id');
    var listItemId = $(this).prev().attr('id') // gets the id of the list element
    // var index = buttonId.split('-')[2];
    
    fetchedList.list = fetchedList.list.filter(item => !item.hasOwnProperty(listItemId))
    
    console.log("updated fetechedList", fetchedList)
    
    listItem.remove();
    $(this).remove(); // Remove the clicked remove button
    localStorage.setItem('watchList', JSON.stringify(fetchedList));
  
});


// for loop that on page load iterates through the localStorage and then adds the fav items to the fav list. 
for (var i = 0; i < localStorage.list.length; i++) {
    
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




// working on code for using remove button on favorite with out refreshing screen
// -------------------------------------------------------------------------------
// $('#btn-item-' +iteration).on('click', function() {
//     var listItem = $(this).prev(); // Select the previous sibling (li element)
//     var buttonId = $(this).attr('id');
//     var listItemId = listItem.attr('id');

//     for (var movie of fetchedList.list) {
//         console.log(fetchedList)
//         var key = Object.keys(movie)[0];
//         console.log(key, listItemId)
//         if (listItemId == key) {
//             console.log(movie)
//             var removeIndex = fetchedList.list.indexOf(movie);
//             console.log(removeIndex);
//             fetchedList.list.splice(removeIndex, 1);
//             console.log('if: ' + fetchedList.list);
//             localStorage.setItem('watchList', JSON.stringify(fetchedList));
//             console.log(JSON.parse(localStorage.getItem('watchList')));
//         }
//         else console.log('else: ' + fetchedList.list)
//     }

// })


   
    // var index = listItemId.split('-')[1];

    // if (iteration == index){
    //     var removeIndex = fetchedList.list.indexOf()
    //     fetchedList.list.splice(removeIndex, 1)
    // }

    // for (i = 0; i<fetchedList.list.length; i++) {
    //     if (buttonId == i)
    // }
    // for (var i = 0; i < fetchedList.list.length; i++)
    // {
    //     var keys = Object.keys(fetchedList.list[i]);
    //     for (var t = 0; t < keys.length; t++){
    //         var keyNum = keys[t].split('-')[1];
    //         console.log(keyNum, index)
    //         if (index == keyNum)
    //         {
    //             var removeIndex = fetchedList.list.indexOf(keys[t])
    //             console.log(removeIndex)
    //             fetchedList.list.splice(removeIndex, 1)
    //         }

    //     }
    // }