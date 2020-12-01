const express = require('express');
const router  = express.Router();

const {
  movieSearch,
  restaurantSearch,
  bookSearch,
  productSearch,
  removeKeyword,
  searchMovie
  } = require('../lib/helpers');

module.exports = (db) => {
  // Gets form to add new item
  router.get("/", (req, res) => {
    res.send("Add new item page OK!");
  });

  // Post new item
  router.post("/", (req, res) => {
    const userInput = req.body.text;
    let params;

    if (movieSearch(userInput.split(" "))) {
      const search = removeKeyword(userInput.split(" "), "movie");
      console.log("post api search: ", searchMovie(search));
      // searchMovie(search)
      //   .then(data => data)
      //   .catch(e => res.send(e));
    }

    // console.log("params: ", params);
    // console.log("searchMovie: ", searchMovie(userInput));

    res.send("Adding new item OK!");
    // console.log("movie search: ", movieSearch(userInput.split(" ")));
    // console.log("restaurant search: ", restaurantSearch(userInput.split(" ")));
    // console.log("book search: ", bookSearch(userInput.split(" ")));
    // console.log("product search: ", productSearch(userInput.split(" ")));
  });

  return router;
}
