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
    SELECT restaurants.name, restaurants.rating, restaurants.country, restaurants.street, restaurants.city, restaurants.province, restaurants.post_code
    FROM users
    JOIN users_restaurants ON users_restaurants.user_id = users.id
    JOIN restaurants ON users_restaurants.restaurant_id = restaurants.id
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
	  SELECT books.title, books.author, books.rating, books.synopsis
      FROM users
      JOIN users_books ON users_books.user_id = users.id
	  JOIN books ON users_books.book_id = books.id
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
    SELECT products.name, products.rating, products.price
    FROM users
    JOIN users_products ON users_products.user_id = users.id
  JOIN products ON users_products.product_id = products.id
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
    const userId = req.session.user_id;
    console.log('userId :', userId);

    const categories = ["movies", "restaurants", "books", "products"];
    let userList = [];

<<<<<<< HEAD
    selectUserItems(userId, categories[0])
      .then(res => {
        console.log(res);
        // res.forEach(element => userList.push(element))
        // console.log("userlist: ", userList);
      })
      .catch(e => res.send(e));
    console.log("user list: ", userList);

    // categories.forEach(category => {
    //   selectUserItems(userId, category)
    //   .then(res => userList.forEach(element => userList.push(element)))
    //   .catch(e => res.send(e));
    //   });
    // console.log(userList);
    const templateVars = {
      user
    };
    res.render("index", templateVars);
=======
    //sends all query results to the browser at the same time
    Promise.all([selectUserMovies(userId), selectUserRestaurants(userId), selectUserBooks(userId), selectUserProducts(userId)])
    .then(result => {

      //result is an array of arrays
      res.send(result);
    })
    .catch(e => res.send(e));


    //res.send("index",);
>>>>>>> 86b589704943fc0ba255ebb82d2499ebcb1e90a8
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
