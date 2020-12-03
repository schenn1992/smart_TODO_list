const express = require('express');
const router  = express.Router();

const {
  movieSearch,
  restaurantSearch,
  bookSearch,
  productSearch,
  removeKeyword,
  searchMovie,
  searchProduct,
  searchBook
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
  }

  const addToBookDatabase = (item) => {
    const queryString = `
    INSERT INTO books (title, author, rating, synopis)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `;
    const values = [item.title, item.author, item.rating, item.synopis];
    return db.query(queryString, values)
      .then(res => {
        console.log(res.rows[0]);
        return res.rows[0]
      })
      .catch(e => res.send(`Adding to books database error: ${e}`));
  }

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

  // Post new item
  router.post("/", (req, res) => {
    // user input from the smart post form
    const userInput = req.body.text;
    // gets the user id
    const userId = req.session.user_id;

    // Checks if doing a movie search
    if (movieSearch(userInput.split(" "))) {
      const search = removeKeyword(userInput.split(" "), "movie");
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
    }

    if (productSearch(userInput.split(" "))) {
      const search = removeKeyword(userInput.split(" "), "product");
      searchProduct(search)
        .then(productJSON => {
          const results = JSON.parse(productJSON);
          // extract the first product
          const description = results.products[0];
          const title = description.title;
          const price = description.price["current_price"] * 100;
          const rating = description.reviews.rating;
          const data = { title, price, rating };

          // Stretch: add url to the product list
          // console.log("URL: ", description.url);

          // Check if the API returns a title, rating, and price
          if (data.title && data.price && data.rating) {
            addToProductDatabase(data)
              .then(() => {
                // console.log("inside add to db: ", data);
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
        })
    }

    if (bookSearch(userInput.split(" "))) {
      const search = removeKeyword(userInput.split(" "), "book");
      searchBook(search)
        .then(bookJSON => {
          const result = JSON.parse(bookJSON);
          const description = result.products[0];
          // console.log(description);
          const title = description.title;
          const price = description.price["current_price"] * 100;
          const rating = description.reviews.rating;
          const author = "Author";
          const synopsis = "Synopsis";
          const data = { title, author, rating, synopsis };
          // console.log(data);

          if (data) {
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
        })
    }

  });

  return router;
};
