const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // Gets form to add new item
  router.get("/", (req, res) => {
    res.send("Add new item page OK!");
  });

  // Post new item
  router.post("/", (req, res) => {
    const item = req.body.text;
    console.log("user item input: ", item);

    res.send("Adding new item OK!");
  });

  return router;
}
