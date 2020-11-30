const express = require('express');
const router  = express.Router();
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const { addUser, getUserWithEmail } = require('../lib/helpers.js');

// shit to do
// 2. show avatar icons on register page
  // i. fix up HTML page
// 5. CSS

module.exports = (db) => {
  // Gets register page
  router.get("/", (req, res) => {
    // cookies shit
    //console.log(req);
    // console.log("req.session: ", req.sessionCookies.Cookies);
    // const userId = req.session["user_id"];
    // console.log("userId: ", userId);
    // const templateVars = {
    //   user_id: users[req.session["user_id"]]
    // };

    const templateVars = {

    };

    // renders the page, templateVars when cookies work
    res.render("register");//, templateVars);
  });

    // Add user to database
    const addUser =  function(user) {
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
    const getUserEmail = function(email) {
      const queryString = `
      SELECT * FROM users
      WHERE email = $1
      `;
      console.log(queryString);
      const values = [email];
      return db.query(queryString, values)
        .then(res => {
          return res.rows[0];
          // console.log(res.rows);
          // if (res.rows.length === 0) {
          //   return undefined;
          // } else {
          //   return true;
          // }
          //return res.rows;
          //console.log("db email: ", res.rows[0].email);
          // console.log("res.rows: ", res.rows[0]);
          // return res.rows[0];
          // if (res.rows[0]) {
          //   return true;
          // } else {
          //   return false;
          // }
        })
        .catch(e => res.send(e));
    };

  // Post and Creates new user
  router.post("/", (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 12);
    console.log("user: ", user);

    console.log("user input email: ", user.email);

    // Checks if the submitted email and password were empty and sends an error
    // if the email is already in use, send an error.
    if (!user.email || !user.password) {
      console.log(1);
      return res.status(400).send("Invalid email or password");
    }
    // else if (getUserEmail(user.email)) {
    //   console.log(2);
    //   return res.status(400).send("Email already in use");
    // }

    // Generates a random avatar id for the user
    user.avatar_id = Math.floor(Math.random() * Math.floor(10) + 1);
    // Adds the user to the database
    addUser(user);
    // Sets cookie to the user's id
    req.session.userId = user.id;
    // Redirects to their todo list page after registering
    res.redirect("/");
  });

  return router;
}
