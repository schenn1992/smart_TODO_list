//takes in query result from route and category
//builds content to display within specific category
const createCategoryDisplay = function(queryResult, category) {
  const item = $(`<article class="${category}">`);

  switch(category) {
    case '.category-movies':
      for(const object of queryResult) {
        const title = $('<h3>').text(`${object.title}`);
        const rating = $('<h5>').text(`Rating: ${object.rating}`);
        const synopsis = $('<h6>').text(`${object.synopsis}`);

        item.append(title);
        item.append(rating);
        item.append(synopsis);
      }
      break;
    case '.category-restaurants':
      for(const object of queryResult) {
        const name = $('<h3>').text(`${object.name}`);
        const rating = $('<h5>').text(`Rating: ${object.rating}`);
        const address = $('<h6>').text(`${object.street}, ${object.city}, ${object.province}, ${object.post_code}, ${object.country}`);

        item.append(name);
        item.append(rating);
        item.append(address);
      }
      break;
    case '.category-books':
      for(const object of queryResult) {
        const title = $('<h3>').text(`${object.title}`);
        const rating = $('<h5>').text(`Rating: ${object.rating}`);
        const synopsis = $('<h6>').text(`${object.synopsis}`);

        item.append(title);
        item.append(rating);
        item.append(synopsis);
      }
      break;
    case '.category-products':
      for(const object of queryResult) {
        const name = $('<h3>').text(`${object.name}`);
        const rating = $('<h5>').text(`Rating: ${object.rating}`);
        const price = $('<h6>').text(`Price: $${object.price /100}`);

        item.append(name);
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
