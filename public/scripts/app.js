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
    const urlId = url.substring(url.length - 1);

    //extract user input
    const username = $('#username').val();
    const email = $('#email').val();

    console.log('AJAX POST call');

    $.ajax({
      url:`/users/${urlId}`,
      method: 'POST',
      data: $('form').serialize()
    })
    .then(res => {
      //display updated values on form after POST
      $('#username').val(username)
      $('#email').val(email)
      return res
    })
    .catch(err => console.log(err))
    .always(() => console.log('AJAX POST successful'))
  });
});
