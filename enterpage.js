var homePage = $('#home');

homePage.on("click", function(event) {
    event.preventDefault();

    document.location.replace('./index.html');
});