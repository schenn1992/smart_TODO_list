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

  const alert = function(message) {
    $('.error').slideDown('slow', 'swing', function() {
      $('.error')
        .text(`${message}`)
        .css('visibility', 'visible');
    });
  };

  //values that might be needed - from $('form')
  // //extract user id for AJAX call
  // const url = event.currentTarget.action;
  // const userId = url.substring(url.length - 1);

  // //extract user input
  // const username = $('#username').val();
  // const email = $('#email').val();
  // const password = $('#password').val();


});
