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
    console.log(item);
    return db.query(queryString, values)
      .then(res => {
        console.log("query: ", res.rows[0]);
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
          let { title, plot, rating } = description;
          //see if this conversion still applies(changed the db type)
          rating = Number(rating);
          const data = { title, plot, rating };

          if (data.title && data.plot && data.rating) {
            // console.log("data inside if: ", data);
            addToMovieDatabase(data)
              .then(data => {
                console.log("res: ", res);
                res.send("Adding new item OK inside promise!")
              })
              .catch(e => res.send(e));
          } else {
            return res.status(400).send("Cannot add item, try a different search!");
          }


          // return res.send("Adding new item OK!");
        })
    }

    // return res.send("Adding new item OK!");
  });

  return router;
}
