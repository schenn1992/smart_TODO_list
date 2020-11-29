/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/api", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Shows user's profile page
  router.get("/:id", (req, res) => {
    const users = req.params;
    db.query(`SELECT * FROM users WHERE id = ${users.id}`)
      .then(data => {
        // Need to make a new route later to show the user's page
        res.send(`User Page OK! Getting user: ${data.rows[0].username} id: ${data.rows[0].id} email: ${data.rows[0].email}`);
      })
      .catch(err => {
        res
          .status(404)
          .send("User not found");
      })
  });

  router.put("/:id", (req, res) => {
    res.send("Update the user's profile OK!");
  });

  return router;
};
