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

  $('#moviesModal').submit(function(event) {
    event.preventDefault();

    //extract user inputs to update db
    const formInput = $('#moviesModal .modalInput').serializeArray();
    console.log('formInput :', formInput);
    const id = formInput[0].value;
    const name = formInput[1].value;
    const category = formInput[2].value;

    $.post(`category/movies/${id}`, {id, name, category})
    .then((response) => {
      //this goes into the browser console log - comes from the server(res.send)
      //this is what the browser will display on the page
      console.log(response)

    })

  })

  $('#restaurantsModal').submit(function(event) {
    event.preventDefault();

    //extract user inputs to update db
    const formInput = $('#restaurantsModal .modalInput').serializeArray();
    console.log('formInput :', formInput);
    const id = formInput[0].value;
    const name = formInput[1].value;
    const category = formInput[2].value;

    $.post(`category/restaurants/${id}`, {id, name, category})
    .then((response) => {
      //this goes into the browser console log - comes from the server(res.send)
      //this is what the browser will display on the page
      console.log(response)

    })

  })

  $('#booksModal').submit(function(event) {
    event.preventDefault();

    //extract user inputs to update db
    const formInput = $('#booksModal .modalInput').serializeArray();
    console.log('formInput :', formInput);
    const id = formInput[0].value;
    const name = formInput[1].value;
    const category = formInput[2].value;

    $.post(`category/books/${id}`, {id, name, category})
    .then((response) => {
      //this goes into the browser console log - comes from the server(res.send)
      //this is what the browser will display on the page
      console.log(response)

    })
  })

    $('#productsModal').submit(function(event) {
      event.preventDefault();

      //extract user inputs to update db
      const formInput = $('#productsModal .modalInput').serializeArray();
      console.log('formInput :', formInput);
      const id = formInput[0].value;
      const name = formInput[1].value;
      const category = formInput[2].value;

      $.post(`category/products/${id}`, {id, name, category})
      .then((response) => {
        //this goes into the browser console log - comes from the server(res.send)
        //this is what the browser will display on the page
        console.log(response)

      })

  })

});
