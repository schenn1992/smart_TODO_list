
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
    // event.preventDefault();

    const userInput = getUserInput('#moviesModal');


    $.when(
      $.post(`category/movies/${userInput.id}`, userInput)
        .then((response) => {
      //comes from the server(res.send)
      // console.log(response)
      }),
      $.ajax({
        url: `category/movies/${userInput.id}`,
        method: 'DELETE',
        success: (response) => console.log(response),
        error: (e) => console.log(e)
      })
    )
    window.location.reload();
  })

  $('#restaurantsModal').submit(function(event) {
    // event.preventDefault();

    const userInput = getUserInput('#restaurantsModal');

    $.when(
      $.post(`category/restaurants/${userInput.id}`, userInput)
        .then((response) => {
      //comes from the server(res.send)
      // console.log(response)
      }),
      $.ajax({
        url: `category/restaurants/${userInput.id}`,
        method: 'DELETE',
        success: (response) => console.log(response),
        error: (e) => console.log(e)
      })
    )
    window.location.reload();
  })

  $('#booksModal').submit(function(event) {
    // event.preventDefault();

    const userInput = getUserInput('#booksModal');

    $.when(
      $.post(`category/books/${userInput.id}`, userInput)
        .then((response) => {
      //comes from the server(res.send)
      // console.log(response)
      }),
      $.ajax({
        url: `category/books/${userInput.id}`,
        method: 'DELETE',
        success: (response) => console.log(response),
        error: (e) => console.log(e)
      })
    )
    window.location.reload();
  })

    $('#productsModal').submit(function(event) {
      // event.preventDefault();

      const userInput = getUserInput('#productsModal');

      $.when(
        $.post(`category/products/${userInput.id}`, userInput)
          .then((response) => {
        //comes from the server(res.send)
        // console.log(response)
        }),
        $.ajax({
          url: `category/products/${userInput.id}`,
          method: 'DELETE',
          success: (response) => console.log(response),
          error: (e) => console.log(e)
        })
      )
      window.location.reload();
  })
});
