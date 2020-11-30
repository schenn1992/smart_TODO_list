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

  // Posts the user's login information and checks to see if it matches with the database
  router.post("/", (request, response) => {
    const userInputEmail = request.body.email;
    const userInputPassword = request.body.password;
    const user = getUserByEmail(userInputEmail, users);
    console.log("email: ",  userInputEmail);
    console.log("password: ", userInputPassword);
    console.log("user: ", user);
    if (user && bcrypt.compareSync(userInputPassword , user.password)) {
      request.session.user_id = user.id;
      res.redirect("/");
    } else {
      return response.send("403 error. Please enter valid email or password");
    }

  });

  return router;

}
