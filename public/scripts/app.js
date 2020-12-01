// const { use } = require("bcrypt/lib/promises");
// const { helpers } = require('../../lib/helpers')

$(() => {
  $.ajax({
    method: "GET",
    url: "/users/api"
  }).done((users) => {
    for(user of users.users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;
});


$(document).ready(() => {

  //handles form submission
  $('form').submit((event) => {

    //prevent page refresh
    event.preventDefault();

    //extract user id for AJAX call
    const url = event.currentTarget.action;
    const userId = url.substring(url.length - 1);

    //extract user input
    const username = $('#username').val();
    const email = $('#email').val();
    const password = $('#password').val();

    //to be moved to helper file once I figure out how to import/export
    //checks that all fields have input, so there are no NULL values sent to db
    const verifyNoUserInput = function(input1, input2, input3) {
      if(!input1 || !input2 || !input3) {
        return false;
      }
      return true;
    }

    if(verifyNoUserInput(username, email, password)) {

      console.log('AJAX POST call');

      $.ajax({
        url:`/users/${userId}`,
        method: 'POST',
        data: $('form').serialize()
      })
      .then(res => {
        //display updated values on form after POST
        // $('#username').val('')
        // $('#email').val('')
        // $('#password').val('')

        location.reload();
      })
      .catch(err => console.log(err))
      .always(() => console.log('AJAX POST successful'))
    } else {
      return alert('Fields cannot be empty!');
    }

  });

});
