const express = require('express');
const router  = express.Router();

const {
  movieSearch,
  restaurantSearch,
  bookSearch,
  productSearch,
  searchMovie} = require('../lib/helpers');

module.exports = (db) => {
  // Gets form to add new item
  router.get("/", (req, res) => {
    res.send("Add new item page OK!");
  });

  // Post new item
  router.post("/", (req, res) => {
    const userInput = req.body.text;

    if (movieSearch(userInput.split(" "))) {
      console.log("searchMovie: ", searchMovie(userInput));
    }
    console.log("searchMovie: ", searchMovie(userInput));
    searchMovie(userInput);


    res.send("Adding new item OK!");
    // console.log("movie search: ", movieSearch(userInput.split(" ")));
    // console.log("restaurant search: ", restaurantSearch(userInput.split(" ")));
    // console.log("book search: ", bookSearch(userInput.split(" ")));
    // console.log("product search: ", productSearch(userInput.split(" ")));
  });

  return router;
}
