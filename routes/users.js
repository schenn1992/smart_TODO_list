/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
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

  router.get("/:id", (req, res) => {
    const users = req.params;
    console.log(users);
    db.query(`SELECT * FROM users WHERE id = ${users.id}`)
      .then(data => {
        // Need to change this later to show the user's page
        res.send(`OK. Getting user: ${data.rows[0].name} id: ${data.rows[0].id}`);
      })
      .catch(err => {
        res
          .status(404)
          .send("User not found");
      })
  });

  return router;
};
