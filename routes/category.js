const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // gives a list of the user's category
  // category must be movies, restaurants, books, or products for query to work
  const selectUserItems = (userId, category) => {
    const queryString = `
      SELECT *
      FROM users_${category}
      WHERE user_id = $2
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

    };

    res.render("index", templateVars);
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
