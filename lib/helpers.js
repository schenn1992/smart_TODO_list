const request = require('request');

const movieSearch = (input) => {
  const movieKeywords = ["watch", "movie", "film", "tv", "show"];
  let output = false;
  movieKeywords.forEach(word => {
    if (input.includes(word)) {
      output = true;
    }
  })
  return output;
};

const restaurantSearch = (input) => {
  const restaurantKeywords = ["food", "eat", "drink"];
  let output = false;
  restaurantKeywords.forEach(word => {
    if (input.includes(word)) {
      output = true;
    }
  })
  return output;
};

const bookSearch = (input) => {
  const bookKeywords = ["book", "read"];
  let output = false;
  bookKeywords.forEach(word => {
    if (input.includes(word)) {
      output = true;
    }
  })
  return output;
};

const productSearch = (input) => {
  const productKeywords = ["buy", "gift", "shop"];
  let output = false;
  productKeywords.forEach(word => {
    if (input.includes(word)) {
      output = true;
    }
  })
  return output;
};

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

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    const description = JSON.parse(body);
    const { title, plot, rating } = description;
    const data = { title, plot, rating };
    return data;
  });
}

module.exports = {
  movieSearch,
  restaurantSearch,
  bookSearch,
  productSearch,
  searchMovie
};
