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

  $(".buttons").click((event) => {
    event.preventDefault()
    console.log(event);
  })

});

  //values that might be needed - from $('form')
  // //extract user id for AJAX call
  // const url = event.currentTarget.action;
  // const userId = url.substring(url.length - 1);

  // //extract user input
  // const username = $('#username').val();
  // const email = $('#email').val();
  // const password = $('#password').val();
