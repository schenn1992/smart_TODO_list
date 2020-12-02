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
