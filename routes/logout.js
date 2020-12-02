const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // need to check if this works once users can login
  router.post("/", (req, res) => {
    req.session = null;
    // will change the redirect to /login after merge
    res.redirect("/");


  });

  return router
}
