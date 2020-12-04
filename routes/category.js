const express = require('express');
const cookieSession = require('cookie-session');
const router  = express.Router();
const {
  searchMovie,
  searchProduct,
  searchBook,
  searchRestaurant,
  fetchMyIP,
  fetchCoordsByIP
} = require('../lib/helpers');

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
    SELECT movies.id, movies.title, movies.rating, movies.synopsis
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
  };

  //queries db for all restaurants of given user
  const selectUserRestaurants = (userId) => {
    const queryString = `
    SELECT restaurants.id, restaurants.name, restaurants.rating, restaurants.country, restaurants.street, restaurants.city, restaurants.province, restaurants.post_code
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
  };

  //queries db for all books of given user
  const selectUserBooks = (userId) => {
    const queryString = `
	  SELECT books.id, books.title, books.author, books.rating, books.synopsis
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
  };

  //queries db for all products of given user
  const selectUserProducts = (userId) => {
    const queryString = `
    SELECT products.id, products.name, products.rating, products.price
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
  };

  // Gets all categories list
  router.get("/", (req, res) => {
    //get user id from cookie
    const userId = req.session.user_id;

    //sends all query results to the browser at the same time
    Promise.all([selectUserMovies(userId), selectUserRestaurants(userId), selectUserBooks(userId), selectUserProducts(userId)])
      .then(result => {

        //result is an array of arrays that gets sent to AJAX call
        res.send(result);
      })
      .catch(e => res.send(e));

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
      .then(res => res.rows[0])
      .catch(e => res.send(`Adding to movie database error: ${e}`));
  };

  const addToProductDatabase = (item) => {
    const queryString = `
    INSERT INTO products (name, rating, price)
    VALUES ($1, $2, $3)
    RETURNING *
    `;
    const values = [item.title, item.rating, item.price];
    return db.query(queryString, values)
      .then(res => res.rows[0])
      .catch(e => res.send(`Adding to product database error: ${e}`));
  };

  const addToBookDatabase = (item) => {
    const queryString = `
    INSERT INTO books (title, author, rating, synopsis)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `;
    const values = [item.title, item.author, item.rating, item.synopsis];
    return db.query(queryString, values)
      .then(res => res.rows[0])
      .catch(e => res.send(`Adding to books database error: ${e}`));
  };

  const addToRestaurantDatabase = (item) => {
    const queryString = `
    INSERT INTO restaurants (name, rating, country, street, city, province, post_code)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `;
    const values = [item.name, item.rating, item.country, item.street, item.city, item.province, item.post_code];
    return db.query(queryString, values)
      .then(res => res.rows[0])
      .catch(e => res.send(`Adding to restaurants database error: ${e}`));
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
  };

  // Gets the length of the category table to use as the new category id for INSERTing
  const getCategoryLength = (category) => {
    const queryString = `
    SELECT count(*)
    FROM ${category}
    `;
    return db.query(queryString)
      .then(res => res.rows[0].count)
      .catch(e => res.send(e));
  };

  const deleteCategoryItem = (category, itemId) => {
    const queryString = `
    DELETE FROM users_${category[0]}
    WHERE  ${category[1]} = ${itemId}
    RETURNING *
    `;
    return db.query(queryString)
      .then(res => res.rows)
      .catch(e => res.send(`Error: ${e}`));
  }

  //edit specific movie
  router.post("/movies/:id", (req, res) => {

    const {id, name, category} = req.body;

    // deleteMovieFromDb(id);

    //req params gets id from link
    const search = req.body.name;
    console.log(req.params);
    const categoryChange = req.body.category.toLowerCase();
    const userId = req.session.user_id;
    const templateVars = { user: userId };

    switch (categoryChange) {
    case ("movies"):
      // search for the movie through an api
      searchMovie(search)
        .then(movieJSON => {
        // Extract required parameters from API to user's search
          const description = JSON.parse(movieJSON);
          let { title, plot, rating } = description;
          rating = Number(rating);
          const data = { title, plot, rating};
          // Check if the API returns a title, plot and rating
          if (data.title && data.plot && data.rating) {
          // Query to add the search to the database
            addToMovieDatabase(data)
              .then(() => {
              // Gets the table length to use as the new movies_id
                getCategoryLength("movies")
                  .then(count => {
                    const movieId = Number(count);
                    // Adds the users.id and movies.id to the many to many table
                    addToUsersAndCategoriesDatabase(["movies", "movie_id"], movieId)
                    // .then(() => {
                    //   deleteCategoryItem(["movies", "movie_id"], movieId)
                    //     .then(() => res.redirect("/"))
                    //     .catch((e) => res.send(`Delete from category error: ${e}`));
                    // })
                    .catch(e => res.send(`Many to many table error`));
                  })
                  .catch(e => res.send(`Error in getCategeoryLength: ${e}`));
              })
              .catch(e => res.send("Invalid movie, try again"));
          } else {
            return res.status(400).send("Cannot add item, try a different search!");
          }
        });
      break;
    case ("books"):
      // searches for book through an api
      searchBook(search)
        .then(bookJSON => {
          const result = JSON.parse(bookJSON);
          const description = result.products[0];
          const title = description.title;
          const rating = description.reviews.rating;
          const author = "Author";
          const synopsis = "API does not provide a synopsis.";
          const data = { title, author, rating, synopsis };

          if (data) {
          // adds search to book database
            addToBookDatabase(data)
              .then(() => {
              // Gets the table length to use as the new book_id
                getCategoryLength("books")
                  .then(count => {
                    const bookId = Number(count);
                    // Adds the users.id and products.id to the many to many table
                    addToUsersAndCategoriesDatabase(["books", "book_id"], userId, bookId)
                    .then(() => res.redirect("/"))
                    .catch(e => res.send(`Many to many table error`));
                  })
                  .catch(e => res.send(`Error in getCategeoryLength: ${e}`));
              })
              .catch(e => res.send("Invalid book, try again"));
          } else {
            return res.status(400).send("Cannot add item, try a different search!");
          }
        });
      break;
    case ("restaurants"):
      // fetch ip of user
      fetchMyIP()
        .then(body => {
        // fetch longitude and latitude of user
          fetchCoordsByIP(body)
            .then(coordinates => {
              const { lat, lon } = JSON.parse(coordinates);
              const coords = { lat, lon };
              // search for restaurant near user using an api
              // API not configured to search for restaurants with multiple words
              searchRestaurant(search, coords)
                .then(restaurantJSON => {
                  const result = JSON.parse(restaurantJSON).restaurants[0].restaurant;
                  // console.log(result);
                  const data = {
                    name: result.name,
                    street: result.location.address,
                    //city: result.location.city,
                    //post_code: result.location.zipcode,
                    city: '',
                    post_code: '',
                    rating: result.user_rating.aggregate_rating,
                    country: '',
                    province: ''
                  };

                  if (data) {
                  // add user's search to database
                    addToRestaurantDatabase(data)
                      .then(() => {
                      // Gets the table length to use as the new restaurant_id
                        getCategoryLength("restaurants")
                          .then(count => {
                            const restaurantId = Number(count);
                            // Adds the users.id and restaurant.id to the many to many table
                            addToUsersAndCategoriesDatabase(["restaurants", "restaurant_id"], userId, restaurantId)
                              .then(() => res.redirect("/"))
                              .catch(e => res.send(`Many to many table error`));
                          })
                          .catch(e => res.send(`Error in getCategeoryLength: ${e}`));
                      })
                      .catch(e => res.send("Invalid restaurant, try again"));
                  } else {
                    return res.status(400).send("Cannot add item, try a different search!");
                  }

                });
            });
        });
      break;
    case ("products"):
      // search for the product through an api
      searchProduct(search)
        .then(productJSON => {
          const results = JSON.parse(productJSON);
          // extract the first product
          const description = results.products[0];
          const title = description.title;
          const price = description.price["current_price"] * 100;
          const rating = description.reviews.rating;
          const data = { title, price, rating };
          // Check if the API returns a title, rating, and price
          if (data.title && data.price && data.rating) {
            addToProductDatabase(data)
              .then(() => {
              // Gets the table length to use as the new product_id
                getCategoryLength("products")
                  .then(count => {
                    const productId = Number(count);
                    // Adds the users.id and products.id to the many to many table
                    addToUsersAndCategoriesDatabase(["products", "product_id"], userId, productId)
                      .then(() => res.redirect("/"))
                      .catch(e => res.send(`Many to many table error`));
                  })
                  .catch(e => res.send(`Error in getCategeoryLength: ${e}`));
              })
              .catch(e => res.send("Invalid product, try again"));
          } else {
            return res.status(400).send("Cannot add item, try a different search!");
          }
        });
      break;
    }
  });

  //edit specific restaurant
  router.post("/restaurants/:id", (req, res) => {
    const search = req.body.name;
    const categoryChange = req.body.category.toLowerCase();
    const userId = req.session.user_id;
    const templateVars = { user: userId };

    switch (categoryChange) {
    case ("movies"):
      // search for the movie through an api
      searchMovie(search)
        .then(movieJSON => {
        // Extract required parameters from API to user's search
          const description = JSON.parse(movieJSON);
          let { title, plot, rating } = description;
          rating = Number(rating);
          const data = { title, plot, rating};
          // Check if the API returns a title, plot and rating
          if (data.title && data.plot && data.rating) {
          // Query to add the search to the database
            addToMovieDatabase(data)
              .then(() => {
              // Gets the table length to use as the new movies_id
                getCategoryLength("movies")
                  .then(count => {
                    console.log("test");
                    const movieId = Number(count);
                    console.log("movie id: ", movieId);
                    console.log("user id: ", userId);
                    // Adds the users.id and movies.id to the many to many table
                    addToUsersAndCategoriesDatabase(["movies", "movie_id"], userId, movieId)
                      .then(() => res.redirect("/"))
                      .catch(e => res.send(`Many to many table error`));
                  })
                  .catch(e => res.send(`Error in getCategeoryLength: ${e}`));
              })
              .catch(e => res.send("Invalid movie, try again"));
          } else {
            return res.status(400).send("Cannot add item, try a different search!");
          }
        });
      break;
    case ("books"):
      // searches for book through an api
      searchBook(search)
        .then(bookJSON => {
          const result = JSON.parse(bookJSON);
          const description = result.products[0];
          const title = description.title;
          const rating = description.reviews.rating;
          const author = "Author";
          const synopsis = "API does not provide a synopsis.";
          const data = { title, author, rating, synopsis };

          if (data) {
          // adds search to book database
            addToBookDatabase(data)
              .then(() => {
              // Gets the table length to use as the new book_id
                getCategoryLength("books")
                  .then(count => {
                    const bookId = Number(count);
                    // Adds the users.id and products.id to the many to many table
                    addToUsersAndCategoriesDatabase(["books", "book_id"], userId, bookId)
                      .then(() => res.redirect("/"))
                      .catch(e => res.send(`Many to many table error`));
                  })
                  .catch(e => res.send(`Error in getCategeoryLength: ${e}`));
              })
              .catch(e => res.send("Invalid book, try again"));
          } else {
            return res.status(400).send("Cannot add item, try a different search!");
          }
        });
      break;
    case ("restaurants"):
      // fetch ip of user
      fetchMyIP()
        .then(body => {
        // fetch longitude and latitude of user
          fetchCoordsByIP(body)
            .then(coordinates => {
              const { lat, lon } = JSON.parse(coordinates);
              const coords = { lat, lon };
              // search for restaurant near user using an api
              // API not configured to search for restaurants with multiple words
              searchRestaurant(search, coords)
                .then(restaurantJSON => {
                  const result = JSON.parse(restaurantJSON).restaurants[0].restaurant;
                  // console.log(result);
                  const data = {
                    name: result.name,
                    street: result.location.address,
                    //city: result.location.city,
                    //post_code: result.location.zipcode,
                    city: '',
                    post_code: '',
                    rating: result.user_rating.aggregate_rating,
                    country: '',
                    province: ''
                  };

                  if (data) {
                  // add user's search to database
                    addToRestaurantDatabase(data)
                      .then(() => {
                      // Gets the table length to use as the new restaurant_id
                        getCategoryLength("restaurants")
                          .then(count => {
                            const restaurantId = Number(count);
                            // Adds the users.id and restaurant.id to the many to many table
                            addToUsersAndCategoriesDatabase(["restaurants", "restaurant_id"], userId, restaurantId)
                              .then(() => res.redirect("/"))
                              .catch(e => res.send(`Many to many table error`));
                          })
                          .catch(e => res.send(`Error in getCategeoryLength: ${e}`));
                      })
                      .catch(e => res.send("Invalid restaurant, try again"));
                  } else {
                    return res.status(400).send("Cannot add item, try a different search!");
                  }

                });
            });
        });
      break;
    case ("products"):
      // search for the product through an api
      searchProduct(search)
        .then(productJSON => {
          const results = JSON.parse(productJSON);
          // extract the first product
          const description = results.products[0];
          const title = description.title;
          const price = description.price["current_price"] * 100;
          const rating = description.reviews.rating;
          const data = { title, price, rating };
          // Check if the API returns a title, rating, and price
          if (data.title && data.price && data.rating) {
            addToProductDatabase(data)
              .then(() => {
              // Gets the table length to use as the new product_id
                getCategoryLength("products")
                  .then(count => {
                    const productId = Number(count);
                    // Adds the users.id and products.id to the many to many table
                    addToUsersAndCategoriesDatabase(["products", "product_id"], userId, productId)
                      .then(() => res.redirect("/"))
                      .catch(e => res.send(`Many to many table error`));
                  })
                  .catch(e => res.send(`Error in getCategeoryLength: ${e}`));
              })
              .catch(e => res.send("Invalid product, try again"));
          } else {
            return res.status(400).send("Cannot add item, try a different search!");
          }
        });
      break;
    }
  });

  router.post("/books/:id", (req, res) => {
    const search = req.body.name;
    const categoryChange = req.body.category.toLowerCase();
    const userId = req.session.user_id;
    const templateVars = { user: userId };
    switch (categoryChange) {
    case ("movies"):
      // search for the movie through an api
      searchMovie(search)
        .then(movieJSON => {
        // Extract required parameters from API to user's search
          const description = JSON.parse(movieJSON);
          let { title, plot, rating } = description;
          rating = Number(rating);
          const data = { title, plot, rating};
          // Check if the API returns a title, plot and rating
          if (data.title && data.plot && data.rating) {
          // Query to add the search to the database
            addToMovieDatabase(data)
              .then(() => {
              // Gets the table length to use as the new movies_id
                getCategoryLength("movies")
                  .then(count => {
                    console.log("test");
                    const movieId = Number(count);
                    console.log("movie id: ", movieId);
                    console.log("user id: ", userId);
                    // Adds the users.id and movies.id to the many to many table
                    addToUsersAndCategoriesDatabase(["movies", "movie_id"], userId, movieId)
                      .then(() => res.redirect("/"))
                      .catch(e => res.send(`Many to many table error`));
                  })
                  .catch(e => res.send(`Error in getCategeoryLength: ${e}`));
              })
              .catch(e => res.send("Invalid movie, try again"));
          } else {
            return res.status(400).send("Cannot add item, try a different search!");
          }
        });
      break;
    case ("books"):
      // searches for book through an api
      searchBook(search)
        .then(bookJSON => {
          const result = JSON.parse(bookJSON);
          const description = result.products[0];
          const title = description.title;
          const rating = description.reviews.rating;
          const author = "Author";
          const synopsis = "API does not provide a synopsis.";
          const data = { title, author, rating, synopsis };
          if (data) {
          // adds search to book database
            addToBookDatabase(data)
              .then(() => {
              // Gets the table length to use as the new book_id
                getCategoryLength("books")
                  .then(count => {
                    const bookId = Number(count);
                    // Adds the users.id and products.id to the many to many table
                    addToUsersAndCategoriesDatabase(["books", "book_id"], userId, bookId)
                      .then(() => res.redirect("/"))
                      .catch(e => res.send(`Many to many table error`));
                  })
                  .catch(e => res.send(`Error in getCategeoryLength: ${e}`));
              })
              .catch(e => res.send("Invalid book, try again"));
          } else {
            return res.status(400).send("Cannot add item, try a different search!");
          }
        });
      break;
    case ("restaurants"):
      // fetch ip of user
      fetchMyIP()
        .then(body => {
        // fetch longitude and latitude of user
          fetchCoordsByIP(body)
            .then(coordinates => {
              const { lat, lon } = JSON.parse(coordinates);
              const coords = { lat, lon };
              // search for restaurant near user using an api
              // API not configured to search for restaurants with multiple words
              searchRestaurant(search, coords)
                .then(restaurantJSON => {
                  const result = JSON.parse(restaurantJSON).restaurants[0].restaurant;
                  // console.log(result);
                  const data = {
                    name: result.name,
                    street: result.location.address,
                    //city: result.location.city,
                    //post_code: result.location.zipcode,
                    city: '',
                    post_code: '',
                    rating: result.user_rating.aggregate_rating,
                    country: '',
                    province: ''
                  };
                  if (data) {
                  // add user's search to database
                    addToRestaurantDatabase(data)
                      .then(() => {
                      // Gets the table length to use as the new restaurant_id
                        getCategoryLength("restaurants")
                          .then(count => {
                            const restaurantId = Number(count);
                            // Adds the users.id and restaurant.id to the many to many table
                            addToUsersAndCategoriesDatabase(["restaurants", "restaurant_id"], userId, restaurantId)
                              .then(() => res.redirect("/"))
                              .catch(e => res.send(`Many to many table error`));
                          })
                          .catch(e => res.send(`Error in getCategeoryLength: ${e}`));
                      })
                      .catch(e => res.send("Invalid restaurant, try again"));
                  } else {
                    return res.status(400).send("Cannot add item, try a different search!");
                  }
                });
            });
        });
      break;
    case ("products"):
      // search for the product through an api
      searchProduct(search)
        .then(productJSON => {
          const results = JSON.parse(productJSON);
          // extract the first product
          const description = results.products[0];
          const title = description.title;
          const price = description.price["current_price"] * 100;
          const rating = description.reviews.rating;
          const data = { title, price, rating };
          // Check if the API returns a title, rating, and price
          if (data.title && data.price && data.rating) {
            addToProductDatabase(data)
              .then(() => {
              // Gets the table length to use as the new product_id
                getCategoryLength("products")
                  .then(count => {
                    const productId = Number(count);
                    // Adds the users.id and products.id to the many to many table
                    addToUsersAndCategoriesDatabase(["products", "product_id"], userId, productId)
                      .then(() => res.redirect("/"))
                      .catch(e => res.send(`Many to many table error`));
                  })
                  .catch(e => res.send(`Error in getCategeoryLength: ${e}`));
              })
              .catch(e => res.send("Invalid product, try again"));
          } else {
            return res.status(400).send("Cannot add item, try a different search!");
          }
        });
      break;
    }
  });

  //edit specific product
  router.post("/products/:id", (req, res) => {
    const search = req.body.name;
    const categoryChange = req.body.category.toLowerCase();
    const userId = req.session.user_id;
    const templateVars = { user: userId };

    switch (categoryChange) {
    case ("movies"):
      // search for the movie through an api
      searchMovie(search)
        .then(movieJSON => {
        // Extract required parameters from API to user's search
          const description = JSON.parse(movieJSON);
          let { title, plot, rating } = description;
          rating = Number(rating);
          const data = { title, plot, rating};
          // Check if the API returns a title, plot and rating
          if (data.title && data.plot && data.rating) {
          // Query to add the search to the database
            addToMovieDatabase(data)
              .then(() => {
              // Gets the table length to use as the new movies_id
                getCategoryLength("movies")
                  .then(count => {
                    console.log("test");
                    const movieId = Number(count);
                    console.log("movie id: ", movieId);
                    console.log("user id: ", userId);
                    // Adds the users.id and movies.id to the many to many table
                    addToUsersAndCategoriesDatabase(["movies", "movie_id"], userId, movieId)
                      .then(() => res.redirect("/"))
                      .catch(e => res.send(`Many to many table error`));
                  })
                  .catch(e => res.send(`Error in getCategeoryLength: ${e}`));
              })
              .catch(e => res.send("Invalid movie, try again"));
          } else {
            return res.status(400).send("Cannot add item, try a different search!");
          }
        });
      break;
    case ("books"):
      // searches for book through an api
      searchBook(search)
        .then(bookJSON => {
          const result = JSON.parse(bookJSON);
          const description = result.products[0];
          const title = description.title;
          const rating = description.reviews.rating;
          const author = "Author";
          const synopsis = "API does not provide a synopsis.";
          const data = { title, author, rating, synopsis };

          if (data) {
          // adds search to book database
            addToBookDatabase(data)
              .then(() => {
              // Gets the table length to use as the new book_id
                getCategoryLength("books")
                  .then(count => {
                    const bookId = Number(count);
                    // Adds the users.id and products.id to the many to many table
                    addToUsersAndCategoriesDatabase(["books", "book_id"], userId, bookId)
                      .then(() => res.redirect("/"))
                      .catch(e => res.send(`Many to many table error`));
                  })
                  .catch(e => res.send(`Error in getCategeoryLength: ${e}`));
              })
              .catch(e => res.send("Invalid book, try again"));
          } else {
            return res.status(400).send("Cannot add item, try a different search!");
          }
        });
      break;
    case ("restaurants"):
      // fetch ip of user
      fetchMyIP()
        .then(body => {
        // fetch longitude and latitude of user
          fetchCoordsByIP(body)
            .then(coordinates => {
              const { lat, lon } = JSON.parse(coordinates);
              const coords = { lat, lon };
              // search for restaurant near user using an api
              // API not configured to search for restaurants with multiple words
              searchRestaurant(search, coords)
                .then(restaurantJSON => {
                  const result = JSON.parse(restaurantJSON).restaurants[0].restaurant;
                  // console.log(result);
                  const data = {
                    name: result.name,
                    street: result.location.address,
                    //city: result.location.city,
                    //post_code: result.location.zipcode,
                    city: '',
                    post_code: '',
                    rating: result.user_rating.aggregate_rating,
                    country: '',
                    province: ''
                  };

                  if (data) {
                  // add user's search to database
                    addToRestaurantDatabase(data)
                      .then(() => {
                      // Gets the table length to use as the new restaurant_id
                        getCategoryLength("restaurants")
                          .then(count => {
                            const restaurantId = Number(count);
                            // Adds the users.id and restaurant.id to the many to many table
                            addToUsersAndCategoriesDatabase(["restaurants", "restaurant_id"], userId, restaurantId)
                              .then(() => res.redirect("/"))
                              .catch(e => res.send(`Many to many table error`));
                          })
                          .catch(e => res.send(`Error in getCategeoryLength: ${e}`));
                      })
                      .catch(e => res.send("Invalid restaurant, try again"));
                  } else {
                    return res.status(400).send("Cannot add item, try a different search!");
                  }

                });
            });
        });
      break;
    case ("products"):
      // search for the product through an api
      searchProduct(search)
        .then(productJSON => {
          const results = JSON.parse(productJSON);
          // extract the first product
          const description = results.products[0];
          const title = description.title;
          const price = description.price["current_price"] * 100;
          const rating = description.reviews.rating;
          const data = { title, price, rating };
          // Check if the API returns a title, rating, and price
          if (data.title && data.price && data.rating) {
            addToProductDatabase(data)
              .then(() => {
              // Gets the table length to use as the new product_id
                getCategoryLength("products")
                  .then(count => {
                    const productId = Number(count);
                    // Adds the users.id and products.id to the many to many table
                    addToUsersAndCategoriesDatabase(["products", "product_id"], userId, productId)
                      .then(() => res.redirect("/"))
                      .catch(e => res.send(`Many to many table error`));
                  })
                  .catch(e => res.send(`Error in getCategeoryLength: ${e}`));
              })
              .catch(e => res.send("Invalid product, try again"));
          } else {
            return res.status(400).send("Cannot add item, try a different search!");
          }
        });
      break;
    }
  });

  const selectItemToDelete = function(tableName) {
    return `DELETE FROM ${tableName}
      WHERE id = $1`
  }

  const deleteMovieFromDb = function(id) {
    const queryString = selectItemToDelete('movies');
    const values = [id];
    console.log(queryString);

    return db.query(queryString, values)
      .then(res => { console.log('res=', res);
        return res.rows;
      })
      .catch(e => res.send(e));
  }

  const deleteRestaurantFromDb = function(id) {
    const queryString = selectItemToDelete('restaurants');
    const values = [id];

    return db.query(queryString, values)
      .then(res => {
        return res.rows;
      })
      .catch(e => res.send(e));
  }

  const deleteBookFromDb = function(id) {
    const queryString = selectItemToDelete('books');
    const values = [id];

    return db.query(queryString, values)
      .then(res => {
        return res.rows;
      })
      .catch(e => res.send(e));
  }
  const deleteProductFromDb = function(id) {
    const queryString = selectItemToDelete('products');
    const values = [id];

    return db.query(queryString, values)
      .then(res => {
        return res.rows;
      })
      .catch(e => res.send(e));
  }


  router.delete("/movies/:id", (req, res) => {

    deleteMovieFromDb(req.params.id);

    res.send(`You want to delete the movie ${req.params.id} `);
    res.redirect("/");
  });

  router.delete("/restaurants/:id", (req, res) => {

    deleteRestaurantFromDb(req.params.id);

    res.send(`You want to delete the restaurant ${req.params.id} `);
    res.redirect("/");
  });

  router.delete("/books/:id", (req, res) => {

    deleteBookFromDb(req.params.id);

    res.send(`You want to delete the book ${req.params.id} `);
    res.redirect("/");
  });


  router.delete("/products/:id", (req, res) => {

    deleteProductFromDb(req.params.id);

    res.send(`You want to delete the product ${req.params.id} `);
    res.redirect("/");
  });

  return router;
};
