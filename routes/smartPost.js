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

  // add user id and category id to the users and categories many to many table
  const addToUsersAndCategoriesDatabase = (category, userId, itemId) => {
    const queryString = `
    INSERT INTO users_${category[0]} (user_id, ${category[1]})
    VALUES ($1, $2)
    RETURNING *
    `;
    const values = [userId, itemId];
    return db.query(queryString, values)
      .then(res => res.rows[0])
      .catch(e => res.send(`Error: ${e}`));
  }

  const getCategoryLength = (category) => {
    const queryString = `
    SELECT count(*)
    FROM ${category}
    `;
    return db.query(queryString)
      .then(res => res.rows[0].count)
      .catch(e => res.send(e));
  };

  // Post new item
  router.post("/", (req, res) => {
    // user input from the smart post form
    const userInput = req.body.text;
    // gets the user id
    const userId = req.session.user_id;
    // const movieLength = Number(getCategoryLength("movies"));
    // console.log("movie length: ", movieLength);

    if (movieSearch(userInput.split(" "))) {
      const search = removeKeyword(userInput.split(" "), "movie");
      searchMovie(search)
        .then(movieJSON => {
          const description = JSON.parse(movieJSON);
          let { title, plot, rating } = description;
          rating = Number(rating);
          const data = { title, plot, rating};

          if (data.title && data.plot && data.rating) {
            addToMovieDatabase(data)
              .then(() => {
                // console.log("add to movie db data: ", data);

                getCategoryLength("movies")
                  .then(count => {
                    console.log(data);
                    console.log("get cat: ", count);
                    // res.redirect("/");
                    const movieId = Number(count);

                    addToUsersAndCategoriesDatabase(["movies", "movie_id"], userId, movieId)
                      .then(() => res.redirect("/"))
                      .catch(e => res.send(`Many to many table error`));
                      //res.redirect("/");
                  })
                  .catch(e => res.send(`Error in getCategeoryLength: ${e}`));


              })
              .catch(e => res.send("Cannot find movie, try again"));
          } else {
            return res.status(400).send("Cannot add item, try a different search!");
          }
        });
    }

  });

  return router;
};
