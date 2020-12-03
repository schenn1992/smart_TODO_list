const { json } = require('body-parser');
const request = require('request-promise-native');
// const zomato = require('zomato');

const movieKeywords = ["watch", "movie", "film", "tv", "show"];
const restaurantKeywords = ["food", "eat", "drink", "restaurant"];
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
  });
}

  // search for books from rapidapi
  const searchBook = (book) => {
      const options = {
    method: 'GET',
    url: 'https://amazon-product-reviews-keywords.p.rapidapi.com/product/search',
    qs: {keyword: `${book}`, category: 'books', country: 'CA'},
    headers: {
      'x-rapidapi-key': 'e2bc5e53b9mshb05e698863df78ap1bf2d2jsn54b279d41e83',
      'x-rapidapi-host': 'amazon-product-reviews-keywords.p.rapidapi.com',
      useQueryString: true
    }
  };

  return request(options, function (error, response, body) {
    if (error) throw new Error(error);
  });
};

// fetch user's current IP address
const IPurl = 'https://api.ipify.org?format=json';

const fetchMyIP = () => {
  return request(IPurl);
};

// fetch latitude and longitude of user
const fetchCoordsByIP = (body) => {
  const ip = JSON.parse(body).ip;
  return request(`http://ip-api.com/json/${ip}`);
};

// fetch nearby restaurants for user using zomato
const searchRestaurant = (restaurant, coordinates) => {
  const options = {
    method: 'GET',
    url: `https://developers.zomato.com/api/v2.1/search?q=${restaurant}&count=1&lat=${coordinates.lat}&lon=${coordinates.lon}&radius=10000&sort=real_distance`,
    headers: {
      'accept': 'application/json',
      'user-key': '75f7f0faf39cd252dc9fe14ee0802056'
    }
  }

  return request(options, function(error, response, body) {
    if (error) throw new Error(error);
  });
};

module.exports = {
  movieSearch,
  restaurantSearch,
  bookSearch,
  productSearch,
  removeKeyword,
  searchMovie,
  searchProduct,
  searchBook,
  searchRestaurant,
  fetchMyIP,
  fetchCoordsByIP
};
