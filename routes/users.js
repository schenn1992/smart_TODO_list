/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // Gets the all users from the db as a JSON
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
    console.log('users-from URL :', users);

    db.query(`SELECT * FROM users WHERE id = ${users.id}`)
      .then(data => {
        const { username, email, password } = data.rows[0];
        const avatarId = data.rows[0].avatar_id;

        const templateVars = {
          username,
          email,
          password,
          avatarId
        }

        res.render("users", templateVars);
      })
      .catch(err => {
        res
          .status(404)
          .send("User not found");
      })
  });

  // Update user's profile
  router.put("/:id", (req, res) => {

    res.send("Update the user's profile OK!");

  });

  return router;
};
