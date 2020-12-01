const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // gives a list of the user's category
  // category must be movies, restaurants, books, or products for query to work
  // const selectUserItems = (userId) => {
  //   const queryString = `
  //     SELECT users.id, users_movies.movie_id, users_restaurants.restaurant_id, users_books.book_id, users_products.product_id
  //     FROM users
  //     LEFT JOIN users_movies ON users_movies.user_id = users.id
  //     LEFT JOIN users_restaurants ON users_restaurants.user_id = users.id
  //     LEFT JOIN users_books ON users_books.user_id = users.id
  //     LEFT JOIN users_products ON users_products.user_id = users.id
  //     WHERE users.id = $1
  //   `;
  //   const values = [userId];
  //   return db.query(queryString, values)
  //     .then(res => {
  //       console.log(res.rows);
  //       return res.rows;
  //     })
  //     .catch(e => res.send(e));
  // }

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
        console.log(res.rows);
        return res.rows;
      })
      .catch(e => res.send(e));
  }

  const selectUserRestaurants = (userId) => {
    const queryString = `
      SELECT users.id, users_restaurants.restaurant_id
      FROM users
      JOIN users_restaurants ON users_restaurants.user_id = users.id
      WHERE users.id = $1
    `;
    const values = [userId];
    return db.query(queryString, values)
      .then(res => {
        console.log(res.rows);
        return res.rows;
      })
      .catch(e => res.send(e));
  }

  const selectUserBooks = (userId) => {
    const queryString = `
      SELECT users.id, users_books.book_id
      FROM users
      JOIN users_books ON users_books.user_id = users.id
      WHERE users.id = $1
    `;
    const values = [userId];
    return db.query(queryString, values)
      .then(res => {
        console.log(res.rows);
        return res.rows;
      })
      .catch(e => res.send(e));
  }

  const selectUserProducts = (userId) => {
    const queryString = `
      SELECT users.id, users_products.product_id
      FROM users
      JOIN users_products ON users_products.user_id = users.id
      WHERE users.id = $1
    `;
    const values = [userId];
    return db.query(queryString, values)
      .then(res => {
        console.log(res.rows);
        return res.rows;
      })
      .catch(e => res.send(e));
  }

  // Gets all categories list
  router.get("/", (req, res) => {
    // user req.session once user can login
    // const userId = req.session["user_id"];
    // temp setting user to 1
    const userId = 1;
    const categories = ["movies", "restaurants", "books", "products"];
    let userList = [];

    //sends all query results to the browser at the same time
    Promise.all([selectUserMovies(userId), selectUserRestaurants(userId), selectUserBooks(userId), selectUserProducts(userId)])
    .then(result => {

      //result is an array of arrays
      res.send(result);
    })
    .catch(e => res.send(e));

    //sends results to the browser(accessed in helpers.js)
    // selectUserMovies(userId)
    //   .then(result => {
    //     res.send(result);
    //   })
    //   .catch(e => res.send(e));

    // // Testing select all restaurants for a user
    // selectUserRestaurants(userId)
    //   .then(res => {
    //     console.log(res);
    //     // res.forEach(element => userList.push(element))
    //     // console.log("userlist: ", userList);
    //   })
    //   .catch(e => res.send(e));

    // // Testing select all books for a user
    // selectUserBooks(userId)
    //   .then(res => {
    //     console.log(res);
    //     // res.forEach(element => userList.push(element))
    //     // console.log("userlist: ", userList);
    //   })
    //   .catch(e => res.send(e));

    // // Testing select all products for a user
    // selectUserProducts(userId)
    //   .then(res => {
    //     console.log(res);
    //     // res.forEach(element => userList.push(element))
    //     // console.log("userlist: ", userList);
    //   })
    //   .catch(e => res.send(e));


    const templateVars = {

    };

    //res.send("index",);
    // res.send("All Categories Page OK!");
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
