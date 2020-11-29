const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // need to check if this works once users can login
  router.post("/", (req, res) => {
    req.session.userId = null;
    res.send({});
  });

  return router
}
