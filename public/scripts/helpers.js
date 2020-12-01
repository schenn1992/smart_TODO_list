//takes in query result from route and category
//builds content to display within specific category
const createCategoryDisplay = function(queryResult, category) {
  const item = $('<article class="item">');

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
      //const content = queryResult.title;
      break;
    // case '.category-books':
    //   //do const content = queryResult.title;
    //   break;
    // case '.category-products':
    // //do const content = queryResult.title;
    // break;
    // default:
    //   // const content = 'abc';
    //   break;
  }
  return item;
}

const loadCategory = function(category) {
  console.log('AJAX call, loading category');
  // $('.category-movies').empty();

  //makes a request to the /category route, gets back an array of objects
  $
    .ajax('/category', {method: 'GET'})
    .then(res => {
      const [movies, restaurants, books, products] = res;
      $('.category-movies').append(createCategoryDisplay(movies, '.category-movies'))
      $('.category-restaurants').append(createCategoryDisplay(restaurants, '.category-restaurants'))
      $('.category-books').append(createCategoryDisplay(restaurants, '.category-books'))
      $('.category-products').append(createCategoryDisplay(restaurants, '.category-products'))
    })
    // .then(res => $('.category-movies').append(createCategoryDisplay(res)))
    // .then(res => console.log(res))
    .catch(err => console.log(err))
    .always(() => console.log('Ajax call successful'));
};
