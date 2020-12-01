const request = require('request');
const category = require('../routes/category');

const movieKeywords = ["watch", "movie", "film", "tv", "show"];
const restaurantKeywords = ["food", "eat", "drink"];
const bookKeywords = ["book", "read"];
const productKeywords = ["buy", "gift", "shop"];

const movieSearch = (input) => {

  let output = false;
  movieKeywords.forEach(word => {
    if (input.includes(word)) {
      output = true;
    }
  })
  return output;
};

const restaurantSearch = (input) => {

  let output = false;
  restaurantKeywords.forEach(word => {
    if (input.includes(word)) {
      output = true;
    }
  })
  return output;
};

const bookSearch = (input) => {

  let output = false;
  bookKeywords.forEach(word => {
    if (input.includes(word)) {
      output = true;
    }
  })
  return output;
};

const productSearch = (input) => {

  let output = false;
  productKeywords.forEach(word => {
    if (input.includes(word)) {
      output = true;
    }
  })
  return output;
};

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

const searchMovie = (movie, callback) => {
  // return new Promise ((resolve, reject) => {
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
      console.log(data);

      // resolve(data);
      return data;
    //})
  });
}

module.exports = {
  movieSearch,
  restaurantSearch,
  bookSearch,
  productSearch,
  removeKeyword,
  searchMovie
};
