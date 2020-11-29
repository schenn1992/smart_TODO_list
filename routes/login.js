const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // Gets login page
  router.get("/", (req, res) => {
    res.send("Login Page OK!");
  });

  // Posts the user's login information and checks to see if it matches with the database
  router.post("/", (req, res) => {
    const {email, password} = req.body;

    // login does not exist yet, need to create a login helper function
    login(email, password)
      .then(user => {
        if (!user) return res.send({error: "error"});
      })
    });

  return router;
}
