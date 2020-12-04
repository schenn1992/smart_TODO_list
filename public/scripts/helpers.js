//takes in query result from route and category
//builds content to display within specific category
const createDoneButton = function(itemId) {
  return $('<button type="input" class="done-button">')
  .text('Done')
  .click(() => {
    console.log('Done clicked on ', itemId);
    $(`${itemId}`).addClass("gray-out");
  });
}
const createEditButton = function(modalHTMLId, itemName, itemId) {
  return $(`<button type="button" class="edit-button" data-toggle="modal" data-target="${modalHTMLId}">`)
  .text('Edit')
  .click(() => {
      $(`${modalHTMLId} .item-name`).val(itemName)
      $(`${modalHTMLId} .item-id`).val(itemId);
      console.log(`Edit button clicked for ${modalHTMLId} ${itemId}`)
  });
}
const createCategoryDisplay = function(queryResult, category) {
  let itemsCount = 0;
  const categoryContainer = $(`${category}`);
  if(queryResult.length !== 0) {
    itemsCount += queryResult.length;
  }
  //displays the number of items in each category
  const itemCounter = $('<p class="items-count">').text(`${itemsCount} items in the category`);
  switch(category) {
    case '.category-movies':
    {
      categoryContainer.append('<h2>Movies</h2>');
      categoryContainer.append(itemCounter);
      let movieId = 0;
      for(const object of queryResult) {
        const item = $(`<article id="movie-${movieId}">`)
        const myId = "#movie-" + `${movieId}`
        //needed to communicate to back-end
        const id = object.id;
        //create elements of category item
        const header = $('<header>');
        const title = $('<h3>').text(`${object.title}`);
        const buttonsContainer = $('<div class="buttons">');
        const rating = $('<h5>').text(`Rating: ${object.rating}`);
        const synopsis = $('<p>').text(`${object.synopsis}`);
        //done button works its magic via CSS class '.gray-out'
        const doneButton = createDoneButton(myId);

        //edit button works its magic through a modal popup form
        const editButton = createEditButton("#moviesModal", object.title, id);

        //put all HTML elements together
        header.append(title);
        buttonsContainer.append(doneButton);
        buttonsContainer.append(editButton);
        header.append(buttonsContainer);
        item.append(header);
        item.append(rating);
        item.append(synopsis);
        categoryContainer.append(item);
        movieId ++;
      }
    }
      break;
    case '.category-restaurants':
    {
      categoryContainer.append('<h2>Restaurants</h2>');
      categoryContainer.append(itemCounter);
      let restaurantId = 0;
      for(const object of queryResult) {
        const item = $(`<article id=restaurant-${restaurantId}>`)
        const myId = "#restaurant-" + `${restaurantId}`
        const id = object.id;
        const header = $('<header>');
        const name = $('<h3>').text(`${object.name}`);
        const buttonsContainer = $('<div class="buttons">');
        const rating = $('<h5>').text(`Rating: ${object.rating}`);
        const address = $('<h6>').text(`${object.street}, ${object.city}, ${object.province}, ${object.post_code}, ${object.country}`);
        const doneButton = createDoneButton(myId);
        const editButton = createEditButton("#restaurantsModal", object.name, id);
        header.append(name);
        buttonsContainer.append(doneButton);
        buttonsContainer.append(editButton);
        header.append(buttonsContainer);
        item.append(header);
        item.append(rating);
        item.append(address);
        categoryContainer.append(item);
        restaurantId ++;
      }
    }
      break;
    case '.category-books':
    {
      categoryContainer.append('<h2>Books</h2>');
      categoryContainer.append(itemCounter);
      let bookId = 0;
      for(const object of queryResult) {
        const item = $(`<article id=book-${bookId}>`)
        const myId = "#book-" + `${bookId}`
        const id = object.id;
        const header = $('<header>');
        const title = $('<h3>').text(`${object.title}`);
        const buttonsContainer = $('<div class="buttons">');
        const rating = $('<h5>').text(`Rating: ${object.rating}`);
        const synopsis = $('<h6>').text(`${object.synopsis}`);
        const doneButton = createDoneButton(myId);
        const editButton = createEditButton("#booksModal", object.title, id);
        header.append(title);
        buttonsContainer.append(doneButton);
        buttonsContainer.append(editButton);
        header.append(buttonsContainer);
        item.append(header);
        item.append(rating);
        item.append(synopsis);
        categoryContainer.append(item);
        bookId ++;
      }
    }
      break;
    case '.category-products':
    {
      categoryContainer.append('<h2>Products</h2>');
      categoryContainer.append(itemCounter);
      let productId = 0;
      for(const object of queryResult) {
        const item = $(`<article id=product-${productId}>`)
        const myId = "#product-" + `${productId}`
        const id = object.id;
        const header = $('<header>');
        const name = $('<h3>').text(`${object.name}`);
        const buttonsContainer = $('<div class="buttons">');
        const rating = $('<h5>').text(`Rating: ${object.rating}`);
        const price = $('<h6>').text(`Price: $${object.price /100}`);
        const doneButton = createDoneButton(myId);
        const editButton = createEditButton("#productsModal", object.name, id);
        header.append(name);
        buttonsContainer.append(doneButton);
        buttonsContainer.append(editButton);
        header.append(buttonsContainer);
        item.append(header);
        item.append(rating);
        item.append(price);
        categoryContainer.append(item);
        productId ++;
      }
    }
      break;
  }
  return categoryContainer;
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

//get user input from modal form
const getUserInput = function(modalHTMLId) {

  const formInput = $(`${modalHTMLId} .modalInput`).serializeArray();
  console.log('formInput :', formInput);
  const id = formInput[0].value;
  const name = formInput[1].value;
  const category = formInput[2].value;
  return {id, name, category};
};
