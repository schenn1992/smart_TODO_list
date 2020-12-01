
const createCategoryDisplay = function(queryResult, category) {
  const item = $('<article class="item">');

  switch(category) {
    case '.category-movies':
      for(const object of queryResult) {
        const title = $('<h2>').text(`${object.title}`);
        const rating = $('<h3>').text(`${object.rating}`);
        const synopsis = $('<p>').text(`${object.synopsis}`);

        item.append(title);
        item.append(rating);
        item.append(synopsis);
      }
      break;
    // case '.category-restaurants':
    //   //const content = queryResult.title;
    //   break;
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

  // const title = $('<article class="item">').text(`${queryResult[0].title}`);
  return item;
}

const loadCategory = function(category) {
  console.log('AJAX call, loading category');
  // $('.category-movies').empty();

  //makes a request to the /category route, gets back an array of objects
  $
    .ajax('/category', {method: 'GET'})
    .then(res => $(`${category}`).append(createCategoryDisplay(res, `${category}`)))
    // .then(res => $('.category-movies').append(createCategoryDisplay(res)))
    // .then(res => console.log(res))
    .catch(err => console.log(err))
    .always(() => console.log('Ajax call successful'));
};
