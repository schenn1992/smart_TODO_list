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

  // Add search item to database
  const addToMovieDatabase = (item) => {
    const queryString = `
    INSERT INTO movies (title, rating, synopsis)
    VALUES ($1, $2, $3)
    RETURNING *
    `;
    const values = [item.title, item.rating, item.plot];
    // console.log(item);
    return db.query(queryString, values)
      .then(res => res.rows[0])
      .catch(e => res.send(e));
  };

  // Post new item
  router.post("/", (req, res) => {
    const userInput = req.body.text;

    if (movieSearch(userInput.split(" "))) {
      const search = removeKeyword(userInput.split(" "), "movie");
      searchMovie(search)
        .then(movieJSON => {
          const description = JSON.parse(movieJSON);
          let { title, plot, rating } = description;
          rating = Number(rating);
          const data = { title, plot, rating };

          if (data.title && data.plot && data.rating) {
            addToMovieDatabase(data)
              .then(() => {

                res.redirect("/");
              })
              .catch(e => res.send("Cannot add, try again"));
          } else {
            return res.status(400).send("Cannot add item, try a different search!");
          }
        })
    }
  });

  return router;
}
