// const { use } = require("bcrypt/lib/promises");
// const { helpers } = require('../../lib/helpers')

$(() => {
  $.ajax({
    method: "GET",
    url: "/users/api"
  }).done((users) => {
    for (user of users.users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });
});


$(document).ready(() => {

  //loads index with all available content for specific user - function in helpers.js
  loadCategory('.category-movies');
  loadCategory('.category-restaurants');
  loadCategory('.category-books');
  loadCategory('.category-products');

  //loads only clicked category(nav bar) - functions in helpers.js
  $("#show-movies").click(() => {
    showMovies();
  })

  $("#show-restaurants").click(() => {
    showRestaurants();
  })

  $("#show-books").click(() => {
    showBooks();
  })

  $("#show-products").click(() => {
    showProducts();
  })

  //below: posts to specific items in categories with content coming from modals
  $('#moviesModal').submit(function(event) {
    event.preventDefault();

    const userInput = getUserInput('#moviesModal');

    $.post(`category/movies/${userInput.id}`, userInput)
    .then((response) => {
      //comes from the server(res.send)
      console.log(response)
    })

  })

  $('#restaurantsModal').submit(function(event) {
    event.preventDefault();

    const userInput = getUserInput('#restaurantsModal');

    $.post(`category/restaurants/${userInput.id}`, userInput)
    .then((response) => {
      console.log(response)
    })

  })

  $('#booksModal').submit(function(event) {
    event.preventDefault();

    const userInput = getUserInput('#booksModal');

    $.post(`category/books/${userInput.id}`, userInput)
    .then((response) => {
      console.log(response)
    })
  })

    $('#productsModal').submit(function(event) {
      event.preventDefault();

      const userInput = getUserInput('#productsModal');

      $.post(`category/products/${userInput.id}`, userInput)
      .then((response) => {
        console.log(response)
      })

  })

});
