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
  router.get("/", (req, res) => {
    res.render("login");
  });

  const getUserByEmail = (email) => {
    const queryString = `
      SELECT * FROM users
      WHERE email = $1
    `;
    const values = [email];
    return db.query(queryString, values)
      .then(res => {
        console.log(res.rows[0]);
        return res.rows[0];
      })
      .catch(e => res.send(e));
  };

  // Posts the user's login information and checks to see if it matches with the database
  router.post("/", (req, res) => {
    const { email, password } = req.body;
    const user = getUserByEmail(email); // return object with user email/password
    console.log("input email: ", email);
    console.log("input password: ", password);
    console.log("user.email: ", user.email);
    if (user.email === email) {
      console.log("email check passed");
      if (bcrypt.compareSync(password, user.password)) {
        console.log("password check passed");
        req.session.user_id = user.id;
        return res.redirect("/");
      }
    } else {
      return res.send("403 error. Please enter valid email or password");
    }
  });

  return router;

}
