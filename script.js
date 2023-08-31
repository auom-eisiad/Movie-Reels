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

// event listener that takes user input
movieForm.on('submit', function(event) {
    event.preventDefault();
    var inputValue = userInput.val();

    // using .replace(/\s/g, "+") to replace the white space from the user input with "+" before adding to apiUrl
    var inputValue = inputValue.replace(/\s/g, "+");

    movieApi(inputValue);
    moviePoster(inputValue);
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
        });
};

function moviePoster(input) {
    // https://api.themoviedb.org/3/discover/movie?api_key=b935e23b4ae8daff658903f94d9e2c61
    var posterAPI = "https://api.themoviedb.org/3/discover/movie?t=" + input + "&api_key=b935e23b4ae8daff658903f94d9e2c61";

    

    // https://api.themoviedb.org/3/movie/157336?api_key=b935e23b4ae8daff658903f94d9e2c61&append_to_response=videos,images
    // https://api.themoviedb.org/3/movie/157336?api_key=b935e23b4ae8daff658903f94d9e2c61&append_to_response=videos

//     fetch(posterAPI)
//     .then(function(response) {
//         return response.json();
//     })
//     .then(function(data) {
//         // Access the first movie in the response
//         var movie = data.results[0];

//         console.log(movie);

//         // Retrieve the poster image URL
//         var posterURL = "https://image.tmdb.org/t/p/w500" + movie.poster_path;

//         // Use the posterURL to display the movie poster
//         console.log(posterURL);
//     })
//     .catch(function(error) {
//         console.log(error);
//   });

    // fetch(posterAPI)
    // .then(function(response) {
    // return response.json();
    // })
    // .then(function(data) {
    // // Extract the movie poster URL from the response data
    // var posterURL = data.results[0].poster_path;

    // // Display the movie poster on your webpage or application
    // var posterImage = document.createElement("img");
    // posterImage.src = "https://image.tmdb.org/t/p/w500" + posterURL;
    // document.body.appendChild(posterImage);
    // })
    // .catch(function(error) {
    // console.log(error);
    // });
};
