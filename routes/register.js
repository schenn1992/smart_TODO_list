const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {
  // Gets the user id from the database
  const getUserId = (id) => {
    const queryString = `
    SELECT * FROM users
    WHERE id = $1
    `;
    const values = [id];
    return db.query(queryString, values)
      .then(res => res.rows[0].id)
      .catch(e => res.send(e));
  };

  // Get register page
  router.get("/", (req, res) => {
    // Set the user id with the id in the database
    const userId = getUserId(req.session["user_id"]);
    const templateVars = {
      user_id: userId
    };
    // renders the page, templateVars when cookies work
    res.render("register", templateVars);//, templateVars);
  });

  // Add user to database
  const addUser = (user) => {
    const queryString = `
        INSERT INTO users (username, email, password, avatar_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
    const values = [user.username, user.email, user.password, user.avatar_id];
    return db.query(queryString, values)
      .then(res => res.rows[0])
      .catch(e => res.send(e));
  };

  // Checks if an email is already in the database
  const getUserEmail = (email) => {
    const queryString = `
      SELECT * FROM users
      WHERE email = $1
      `;
    const values = [email];
    return db.query(queryString, values)
      .then(res => {
        console.log(res.rows.length);
        return res.rows;
      })
      .catch(e => res.send(e));
  };

  // Post and Create new user
  router.post("/", (req, res) => {
    const user = req.body;
    // Hash the user's password
    user.password = bcrypt.hashSync(user.password, 12);
    // Generate a random avatar id for the user
    user.avatar_id = Math.floor(Math.random() * Math.floor(9) + 1);
    // console.log("user: ", user);
    // console.log("user input email: ", user.email);
    // console.log("user avatar: ", user.avatar_id);

    // Checks if the submitted email and password were empty and sends an error
    // if the email is already in use, send an error.
    if (!user.email || !user.password) {
      return res.status(400).send("Invalid email or password");
    }
    if (getUserEmail(user.email).length > 0) {
      return res.status(400).send("Email already in use");
    }
    // else if (exampleFn()) {
    //   return res.status(400).send("Email already in use");
    // }

    // Adds the user to the database
    addUser(user);
    // Sets cookie to the user's id
    req.session.userId = user.id;
    // Redirect to user's todo list after registering
    res.redirect("/");
  });

  return router;
};
