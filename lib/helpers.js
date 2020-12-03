const request = require('request-promise-native');

const movieKeywords = ["watch", "movie", "film", "tv", "show"];
const restaurantKeywords = ["food", "eat", "drink"];
const bookKeywords = ["book", "read"];
const productKeywords = ["buy", "gift", "shop"];

// Determines if the smart search is doing a movie search
const movieSearch = (input) => {
  let output = false;
  movieKeywords.forEach(word => {
    if (input.includes(word)) {
      output = true;
    }
  })
  return output;
};

// Determines if the smart search is doing a restaurant search
const restaurantSearch = (input) => {
  let output = false;
  restaurantKeywords.forEach(word => {
    if (input.includes(word)) {
      output = true;
    }
  })
  return output;
};

// Determines if the smar search is doing a book search
const bookSearch = (input) => {
  let output = false;
  bookKeywords.forEach(word => {
    if (input.includes(word)) {
      output = true;
    }
  })
  return output;
};

// Determines if the smart serach is doing a product search
const productSearch = (input) => {
  let output = false;
  productKeywords.forEach(word => {
    if (input.includes(word)) {
      output = true;
    }
  })
  return output;
};

// Removes keyword from the user input
const removeKeyword = (input, category) => {
  let output = [];
  let outputString = "";
  if (category === "movie") {
    input.forEach(word => {
      if (!movieKeywords.includes(word)) {
        output.push(word);
      }
    })
  }
  if (category === "restaurant") {
    input.forEach(word => {
      if (!restaurantKeywords.includes(word)) {
        output.push(word);
      }
    })
  }
  if (category === "book") {
    input.forEach(word => {
      if (!bookKeywords.includes(word)) {
        output.push(word);
      }
    })
  }
  if (category === "product") {
    input.forEach(word => {
      if (!productKeywords.includes(word)) {
        output.push(word);
      }
    })
  }
  outputString = output.join(" ");
  return outputString;
};

// Search for movie from rapidapi
const searchMovie = (movie) => {
    const options = {
      method: 'GET',
      url: `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/film/${movie}`,
      headers: {
        'x-rapidapi-key': 'e2bc5e53b9mshb05e698863df78ap1bf2d2jsn54b279d41e83',
        'x-rapidapi-host': 'imdb-internet-movie-database-unofficial.p.rapidapi.com',
        useQueryString: true
      }
    };
    return request(options, function (error, response, body) {
      if (error) throw new Error(error);
      // const description = JSON.parse(body);
      // const { title, plot, rating } = description;
      // const data = { title, plot, rating };
      // return data;
  });
};

// Search for product from rapidapi
const searchProduct = (product) => {
  const options = {
    method: 'GET',
    url: 'https://amazon-product-reviews-keywords.p.rapidapi.com/product/search',
    qs: {keyword: `${product}`, category: 'aps', country: 'CA'},
    headers: {
      'x-rapidapi-key': 'e2bc5e53b9mshb05e698863df78ap1bf2d2jsn54b279d41e83',
      'x-rapidapi-host': 'amazon-product-reviews-keywords.p.rapidapi.com',
      useQueryString: true
    }
  };

  return request(options, function (error, response, body) {
    if (error) throw new Error(error);
    // const results = JSON.parse(body);
    // const description = results.products[0];
    // const title = description.title;
    // const price = description.price.current_price;
    // const rating = description.reviews.rating;
    // const data = { title, price, rating };
    // return data;
  });
};

module.exports = {
  movieSearch,
  restaurantSearch,
  bookSearch,
  productSearch,
  removeKeyword,
  searchMovie,
  searchProduct
};
