const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.send("All Categories Page OK!");
  });

  router.get("/:id", (req, res) => {
    res.send("Get Specific Item Page OK!");
  });

  router.get("/:id/edit", (req, res) => {
    res.send("Get Edit Page for Specific Item OK!");
  });

  router.put("/:id", (req, res) => {
    res.send("Update Item OK!");
  });

  router.delete("/:id", (req, res) => {
    res.send("Delete Item OK!");
  });

  return router;
}
