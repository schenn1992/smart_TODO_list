const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.send("All Categories Page OK!");
  });

  return router;
}
