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
      console.log('data-from query :', data.rows[0]);

        const templateVars = {
          username: data.rows[0].username,
          email: data.rows[0].email,
          password: data.rows[0].password,
          avatarId: data.rows[0].avatar_id
        }

        // Need to make a new route later to show the user's page
        // res.send(`User Page OK! Getting user: ${data.rows[0].username} id: ${data.rows[0].id} email: ${data.rows[0].email}`);
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
