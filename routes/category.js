const express = require('express');
const cookieSession = require('cookie-session');
const router  = express.Router();

router.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
  })
);

module.exports = (db) => {
  //queries db for all movies of given user
  const selectUserMovies = (userId) => {
    const queryString = `
    SELECT movies.title, movies.rating, movies.synopsis
    FROM users
    JOIN users_movies ON users_movies.user_id = users.id
    JOIN movies ON users_movies.movie_id = movies.id
    WHERE users.id = $1
    `;
    const values = [userId];
    return db.query(queryString, values)
      .then(res => {
        // console.log(res.rows);
        return res.rows;
      })
      .catch(e => res.send(e));
  }

  //queries db for all restaurants of given user
  const selectUserRestaurants = (userId) => {
    const queryString = `
    SELECT restaurants.name, restaurants.rating, restaurants.country, restaurants.street, restaurants.city, restaurants.province, restaurants.post_code
    FROM users
    JOIN users_restaurants ON users_restaurants.user_id = users.id
    JOIN restaurants ON users_restaurants.restaurant_id = restaurants.id
    WHERE users.id = $1
    `;
    const values = [userId];
    return db.query(queryString, values)
      .then(res => {
        // console.log(res.rows);
        return res.rows;
      })
      .catch(e => res.send(e));
  }

  //queries db for all books of given user
  const selectUserBooks = (userId) => {
    const queryString = `
	  SELECT books.title, books.author, books.rating, books.synopsis
      FROM users
      JOIN users_books ON users_books.user_id = users.id
	  JOIN books ON users_books.book_id = books.id
      WHERE users.id = $1
    `;
    const values = [userId];
    return db.query(queryString, values)
      .then(res => {
        // console.log(res.rows);
        return res.rows;
      })
      .catch(e => res.send(e));
  }

  //queries db for all products of given user
  const selectUserProducts = (userId) => {
    const queryString = `
    SELECT products.name, products.rating, products.price
    FROM users
    JOIN users_products ON users_products.user_id = users.id
  JOIN products ON users_products.product_id = products.id
    WHERE users.id = $1
    `;
    const values = [userId];
    return db.query(queryString, values)
      .then(res => {
        // console.log(res.rows);
        return res.rows;
      })
      .catch(e => res.send(e));
  }

  // Gets all categories list
  router.get("/", (req, res) => {
    //get user id from cookie
    const userId = req.session.user_id;
    // console.log('userId :', userId);

    const categories = ["movies", "restaurants", "books", "products"];
    let userList = [];
    // console.log('userId :', userId);

    //sends all query results to the browser at the same time
    Promise.all([selectUserMovies(userId), selectUserRestaurants(userId), selectUserBooks(userId), selectUserProducts(userId)])
    .then(result => {

      //result is an array of arrays that gets sent to AJAX call
      res.send(result);
    })
    .catch(e => res.send(e));


  });

  // Gets specific item page
  router.get("/:id", (req, res) => {
    res.send("Get Specific Item Page OK!");
  });

  // Gets specific edit item page
  router.get("/:id/edit", (req, res) => {
    res.send("Get Edit Page for Specific Item OK!");
  });

  // Updates specific item after editing
  router.put("/:id", (req, res) => {
    res.send("Update Item OK!");
  });

  // Delets specific item
  router.delete("/:id", (req, res) => {
    res.send("Delete Item OK!");
  });

  return router;
}
