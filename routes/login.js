const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // Get login page
  router.get("/login", (req, res) => {
    res.render("login_page");
  });

  // Posts the user's login information and checks to see if it matches with the database
  router.post("/login", (req, res) => {
    const {email, password} = req.body;

    // login does not exist yet, need to create a login helper function
    login(email, password)
      .then(user => {
        if (!user) return res.send({error: "error"});
      })
    });

  return router;
}
