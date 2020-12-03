//takes in query result from route and category
//builds content to display within specific category
const createCategoryDisplay = function(queryResult, category) {

  if(queryResult.length === 0) {
    return '';
  }

  const item = $(`<article>`);

  switch(category) {
    case '.category-movies':
      item.append('<h2>Movies</h2>');

      for(const object of queryResult) {
        const header = $('<header>');
        const title = $('<h3>').text(`${object.title}`);
        const buttonsContainer = $('<div class="buttons">');
        const doneButton = $('<button type="button" class="done-button">').text('Done');
        const editButton = $('<button type="button" class="edit-button">').text('Edit');
        const deleteButton = $('<button type="button" class="delete-button">').text('Delete');
        const rating = $('<h5>').text(`Rating: ${object.rating}`);
        const synopsis = $('<p>').text(`${object.synopsis}`);

        header.append(title);
        buttonsContainer.append(doneButton);
        buttonsContainer.append(editButton);
        buttonsContainer.append(deleteButton);
        header.append(buttonsContainer);
        item.append(header);
        item.append(rating);
        item.append(synopsis);
      }
      break;
    case '.category-restaurants':
      item.append('<h2>Restaurants</h2>');

      for(const object of queryResult) {
        const header = $('<header>');
        const name = $('<h3>').text(`${object.name}`);
        const buttonsContainer = $('<div class="buttons">');
        const doneButton = $('<button type="button" class="done-button">').text('Done');
        const editButton = $('<button type="button" class="edit-button">').text('Edit');
        const deleteButton = $('<button type="button" class="delete-button">').text('Delete');
        const rating = $('<h5>').text(`Rating: ${object.rating}`);
        const address = $('<h6>').text(`${object.street}, ${object.city}, ${object.province}, ${object.post_code}, ${object.country}`);

        header.append(name);
        buttonsContainer.append(doneButton);
        buttonsContainer.append(editButton);
        buttonsContainer.append(deleteButton);
        header.append(buttonsContainer);
        item.append(header);
        item.append(rating);
        item.append(address);
      }
      break;
    case '.category-books':
      item.append('<h2>Books</h2>');

      for(const object of queryResult) {
        const header = $('<header>');
        const title = $('<h3>').text(`${object.title}`);
        const buttonsContainer = $('<div class="buttons">');
        const doneButton = $('<button type="button" class="done-button">').text('Done');
        const editButton = $('<button type="button" class="edit-button">').text('Edit');
        const deleteButton = $('<button type="button" class="delete-button">').text('Delete');
        const rating = $('<h5>').text(`Rating: ${object.rating}`);
        const synopsis = $('<h6>').text(`${object.synopsis}`);

        header.append(title);
        buttonsContainer.append(doneButton);
        buttonsContainer.append(editButton);
        buttonsContainer.append(deleteButton);
        header.append(buttonsContainer);
        item.append(header);
        item.append(rating);
        item.append(synopsis);
      }
      break;
    case '.category-products':
      item.append('<h2>Products</h2>');

      for(const object of queryResult) {
        const header = $('<header>');
        const name = $('<h3>').text(`${object.name}`);
        const buttonsContainer = $('<div class="buttons">');
        const doneButton = $('<button type="button" class="done-button">').text('Done');
        const editButton = $('<button type="button" class="edit-button">').text('Edit');
        const deleteButton = $('<button type="button" class="delete-button">').text('Delete');
        const rating = $('<h5>').text(`Rating: ${object.rating}`);
        const price = $('<h6>').text(`Price: $${object.price /100}`);

        header.append(name);
        buttonsContainer.append(doneButton);
        buttonsContainer.append(editButton);
        buttonsContainer.append(deleteButton);
        header.append(buttonsContainer);
        item.append(header);
        item.append(rating);
        item.append(price);
      }
    break;
  }
  return item;
}

//loads all existing content for specific user
const loadCategory = function(category) {
  console.log('AJAX call, loading category');

  //makes a request to the /category route, gets back an array of arrays
  $.ajax('/category', {method: 'GET'})
    .then(res => {
      //assign arrays in result to their own separate array
      const [movies, restaurants, books, products] = res;

      //object built for use in createCategoryDisplay function call below
      const catArrays = {
        '.category-movies': movies,
        '.category-restaurants': restaurants,
        '.category-books': books,
        '.category-products': products
      }

      $(`${category}`).append(createCategoryDisplay(catArrays[`${category}`], `${category}`))
    })
    .catch(err => console.log(err))
    .always(() => console.log('Ajax call successful'));
};

const categories = ['.category-movies', '.category-restaurants', '.category-books', '.category-products'];

//loops through list of categories and toggles their visibility
const toggleCategoryDisplay = function(category) {
  for (const item of categories) {
    $(`${item}`).empty();
    if (item !== category) {
      $(`${item}`).css('display', 'none');
    } else {
      $(`${item}`).css('display', 'flex');
    }
  }
}

//functions to display specific category on nav bar click
const showMovies = function() {
  toggleCategoryDisplay('.category-movies');

  loadCategory('.category-movies');
};

const showRestaurants = function() {
  toggleCategoryDisplay('.category-restaurants');

  loadCategory('.category-restaurants');
};

const showBooks = function() {
  toggleCategoryDisplay('.category-books');

  loadCategory('.category-books');
};

const showProducts = function() {
  toggleCategoryDisplay('.category-products');

  loadCategory('.category-products');
};

//takes in query result from route and category
//builds content to display within specific category

const createCategoryDisplay = function(queryResult, category) {

  let itemsCount = 0;
  const item = $('<article>');

  if(queryResult.length !== 0) {
    itemsCount += queryResult.length;

  }

  //displays the number of items in each category
  const itemCounter = $('<p class="items-count">').text(`${itemsCount} items in the category`);

  switch(category) {
    case '.category-movies':
      item.append('<h2>Movies</h2>');
      item.append(itemCounter);

      for(const object of queryResult) {
        //needed to communicate to back-end
        const id = object.id;

        //create elements of category item
        const header = $('<header>');
        const title = $('<h3>').text(`${object.title}, ${id}`);
        const buttonsContainer = $('<div class="buttons">');
        const rating = $('<h5>').text(`Rating: ${object.rating}`);
        const synopsis = $('<p>').text(`${object.synopsis}`);

        //done button works its magic via CSS class '.gray-out'
        const doneButton =
        $('<button type="input" class="done-button">')
          .text('Done')
          .click(() => {
            console.log('Done clicked');
            // $("h3, h5, p").addClass("gray-out");
          });

        //edit button works its magic via AJAX post call
        const editButton =
        $('<button type="button" class="edit-button">')
          .text('Edit')
          .click(() => {
            $.post(`category/movies/${id}`) //{title: user input}) - second argument
              .then((response) => {console.log(response)})
          });

        //delete button will work its magic through AJAX delete call (once I figure out how to do that)
        const deleteButton =
        $('<button type="button" class="delete-button">')
          .text('Delete')
          .click(() => {
            $.ajax({url: `category/movies/${id}`, method: "DELETE"})
              .then((response) => {console.log(response)})
          });

        //put all HTML elements together
        header.append(title);
        buttonsContainer.append(doneButton);
        buttonsContainer.append(editButton);
        buttonsContainer.append(deleteButton);
        header.append(buttonsContainer);
        item.append(header);
        item.append(rating);
        item.append(synopsis);
        $('.category-movies').append(item);
      }
      break;

    case '.category-restaurants':
      item.append('<h2>Restaurants</h2>');
      item.append(itemCounter);

      for(const object of queryResult) {
        const id = object.id;
        const header = $('<header>');
        const name = $('<h3>').text(`${object.name}, ${id}`);
        const buttonsContainer = $('<div class="buttons">');
        const rating = $('<h5>').text(`Rating: ${object.rating}`);
        const address = $('<h6>').text(`${object.street}, ${object.city}, ${object.province}, ${object.post_code}, ${object.country}`);

        const doneButton =
        $('<button type="input" class="done-button">')
          .text('Done')
          .click(() => {console.log('Done clicked')});

        const editButton =
        $('<button type="button" class="edit-button">')
          .text('Edit')
          .click(() => {
            $.post(`category/restaurants/${id}`) //{title: user input}) - second argument
              .then((response) => {console.log(response)})
          });

        //need to implement AJAX delete call
        const deleteButton = $('<button type="button" class="delete-button">').text('Delete');

        header.append(name);
        buttonsContainer.append(doneButton);
        buttonsContainer.append(editButton);
        buttonsContainer.append(deleteButton);
        header.append(buttonsContainer);
        item.append(header);
        item.append(rating);
        item.append(address);
      }
      break;

    case '.category-books':
      item.append('<h2>Books</h2>');
      item.append(itemCounter);

      for(const object of queryResult) {
        const id = object.id;
        const header = $('<header>');
        const title = $('<h3>').text(`${object.title}, ${id}`);
        const buttonsContainer = $('<div class="buttons">');
        const rating = $('<h5>').text(`Rating: ${object.rating}`);
        const synopsis = $('<h6>').text(`${object.synopsis}`);

        const doneButton =
        $('<button type="input" class="done-button">')
          .text('Done')
          .click(() => {console.log('Done clicked')});

        const editButton =
        $('<button type="button" class="edit-button">')
          .text('Edit')
          .click(() => {
            $.post(`category/books/${id}`) //{title: user input}) - second argument
              .then((response) => {console.log(response)})
          });

        //need to implement AJAX delete call
        const deleteButton = $('<button type="button" class="delete-button">').text('Delete');


        header.append(title);
        buttonsContainer.append(doneButton);
        buttonsContainer.append(editButton);
        buttonsContainer.append(deleteButton);
        header.append(buttonsContainer);
        item.append(header);
        item.append(rating);
        item.append(synopsis);
      }
      break;

    case '.category-products':
      item.append('<h2>Products</h2>');
      item.append(itemCounter);

      for(const object of queryResult) {
        const id = object.id;
        const header = $('<header>');
        const name = $('<h3>').text(`${object.name}, ${id}`);
        const buttonsContainer = $('<div class="buttons">');
        const rating = $('<h5>').text(`Rating: ${object.rating}`);
        const price = $('<h6>').text(`Price: $${object.price /100}`);

        const doneButton =
        $('<button type="input" class="done-button">')
          .text('Done')
          .click(() => {console.log('Done clicked')});

        const editButton =
        $('<button type="button" class="edit-button">')
          .text('Edit')
          .click(() => {
            $.post(`category/products/${id}`) //{title: user input}) - second argument
              .then((response) => {console.log(response)})
          });

        //need to implement AJAX delete call
        const deleteButton = $('<button type="button" class="delete-button">').text('Delete');

        header.append(name);
        buttonsContainer.append(doneButton);
        buttonsContainer.append(editButton);
        buttonsContainer.append(deleteButton);
        header.append(buttonsContainer);
        item.append(header);
        item.append(rating);
        item.append(price);
      }
      break;
  }
  return item;
}

//loads all existing content for specific user
const loadCategory = function(category) {
  console.log('AJAX call, loading category');

  //makes a request to the /category route, gets back an array of arrays
  $.ajax('/category', {method: 'GET'})
    .then(res => {
      //assign arrays in result to their own separate array
      const [movies, restaurants, books, products] = res;

      //object built for use in createCategoryDisplay function call below
      const catArrays = {
        '.category-movies': movies,
        '.category-restaurants': restaurants,
        '.category-books': books,
        '.category-products': products
      }

      $(`${category}`).append(createCategoryDisplay(catArrays[`${category}`], `${category}`))
    })
    .catch(err => console.log(err))
    .always(() => console.log('Ajax call successful'));

};

const categories = ['.category-movies', '.category-restaurants', '.category-books', '.category-products'];

//loops through list of categories and toggles their visibility
const toggleCategoryDisplay = function(category) {
  for (const item of categories) {
    $(`${item}`).empty();
    if (item !== category) {
      $(`${item}`).css('display', 'none');
    } else {
      $(`${item}`).css('display', 'flex');
    }
  }
}

//functions to display specific category on nav bar click
const showMovies = function() {
  toggleCategoryDisplay('.category-movies');

  loadCategory('.category-movies');
};

const showRestaurants = function() {
  toggleCategoryDisplay('.category-restaurants');

  loadCategory('.category-restaurants');
};

const showBooks = function() {
  toggleCategoryDisplay('.category-books');

  loadCategory('.category-books');
};

const showProducts = function() {
  toggleCategoryDisplay('.category-products');

  loadCategory('.category-products');
};

