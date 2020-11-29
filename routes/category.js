const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // Gets all categories list
  router.get("/", (req, res) => {
    res.send("All Categories Page OK!");
  });

  // Gets specific item page
  router.get("/:id", (req, res) => {
    res.send("Get Specific Item Page OK!");
  });

  // Gets specific edit item page
  router.get("/:id/edit", (req, res) => {
    res.send("Get Edit Page for Specific Item OK!");
  });

  // Updates specific item after editing
  router.put("/:id", (req, res) => {
    res.send("Update Item OK!");
  });

  // Delets specific item
  router.delete("/:id", (req, res) => {
    res.send("Delete Item OK!");
  });

  return router;
}
