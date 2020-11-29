const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.send("Login Page OK!");
  });

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
