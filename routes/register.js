const express = require('express');
const router  = express.Router();
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");

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


  const getUserWithEmail = function(email) {
    const queryString = `
    SELECT * FROM users
    WHERE email = $1
    `;
    const values = [email];
    return db.query(queryString, values)
      .then(res => res.rows[0])
      // .then(res => {
      //   console.log(res.rows[0]);
      //   if (res.rows[0]) {
      //     return true
      //   } else {
      //     return false;
      //   }
      //   // console.log(res.rows[0]);
      //   // return res.rows[0];
      // })
      .catch(e => res.send(e));
  };

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

  // Post and Creates new user
  router.post("/", (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 12);

    console.log(user.email);

    // Checks if the submitted email and password were empty and sends an error
    // if the email is already in use, send an error.
    if (!user.email || !user.password) {
      return res.status(400).send("Invalid email or password");
    } else if (getUserWithEmail(user.email)) {
      return res.status(400).send("Email already in use");
    }

    addUser(user);
    req.session.userId = user.id;
    res.redirect("/");
  });

  return router;
}
