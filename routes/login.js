const express = require('express');
const cookieSession = require("cookie-session");
const router  = express.Router();
const bcrypt = require('bcrypt');
const { getUserByEmail } = require ("../lib/helpers.js");
const app = express();



let users = {};

app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

module.exports = (db) => {
  // Get login page
  const getUserById = (id) => {
    const queryString = `
      SELECT * FROM users
      WHERE id = $1
    `
    const values = [id];
    return db.query(queryString, values)
      .then(res => {
        return res.rows[0];
      })
  };

  router.get("/", (req, res) => {
    if (!req.session.user_id) {
      res.render("login", {user: null})
    } else {
      getUserById(req.session.user_id).then(user => {
        const templateVars = {user};
        res.render("login", templateVars);
      })
    }
  });

  const getUserByEmail = (email) => {
    const queryString = `
      SELECT * FROM users
      WHERE email = $1
    `;
    const values = [email];
    return db.query(queryString, values)
      .then(res => {
        return res.rows[0];
      })
  };
  // Posts the user's login information and checks to see if it matches with the database
  router.post("/", (req, res) => {
    const {email, password} = req.body;
    getUserByEmail(email).then(user => {
      if (user.email === email) {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.user_id = user.id;
          return res.redirect("/");
        }
      }
      return res.send("403 error. Please enter valid email or password");
    });
  });
  return router;
}
//when clicked on Profile, i should be direct to users
