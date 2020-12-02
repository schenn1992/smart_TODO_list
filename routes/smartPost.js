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
    return db.query(queryString, values)
      .then(res => {
        console.log(res.rows[0]);
        return res.rows[0]
      })
      .catch(e => res.send(e));
  };

  // Post new item
  router.post("/", (req, res) => {
    const userInput = req.body.text;
    // let data;

    // const test = {
    //   title: 'The Dark Knight ',
    //   plot:
    //  'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    //   rating: '9.0'
    // };

    // addToMovieDatabase(test)
    // .then(res => {
    //   return res.redirect("/");
    // })
    // .catch(e => res.send(e));

    if (movieSearch(userInput.split(" "))) {
      const search = removeKeyword(userInput.split(" "), "movie");
      searchMovie(search)
        .then(movieJSON => {
          const description = JSON.parse(movieJSON);
          const { title, plot, rating } = description;
          data = { title, plot, rating };
          console.log(data);

          addToMovieDatabase(data)
            .then(res => {
              console.log(res);
              res.send("Adding new item OK!")
            })
            .catch(e => res.send(e));
        })
    }

    // return res.send("Adding new item OK!");
  });

  return router;
}
