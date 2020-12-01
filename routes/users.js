/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

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

    db.query(`SELECT * FROM users WHERE id = ${users.id}`)
      .then(data => {
        //extract user information from query
        const { id, username, email, password } = data.rows[0];
        const avatarId = data.rows[0].avatar_id;

        //pass user information to ejs template
        const templateVars = {
          id,
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

  //checks if the email is already in use in the db
  //move to helpers
  const getUserByEmail = function(email) {
    const query = {
    text: `SELECT * FROM users
    WHERE email = $1
    `,
    values: [email]
    }

    return db.query(query)
    .then(res => {return !res.rows[0] ? res.rows : res.rows[0]})
    .catch(e => res.send(e));
  }

  //checks that all fields have input, so there are no NULL values sent to db
  //move to helpers
  const verifyUserInput = function(input1, input2, input3) {
    if(!input1 || !input2 || !input3) {
      return false;
    }
    return true;
  }

  // Update user's profile
  router.post("/:id", (req, res) => {

    //extract user id from URL
    const id = req.params.id;

    //extract user input
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    if(verifyUserInput(username, email, password)) {
      getUserByEmail(email)
        .then(user => {
          //if db user is same as input user
          if(user.email === email) {
            return res.render("error", { error: 'Email is already in use!'});

          } else {
            //update user in the database
            const query = {
              text: `UPDATE users
              SET username = $1,
                email = $2,
                password = $3
              WHERE id = $4
              RETURNING *`,
              values: [username, email, hashedPassword, id]
            };

            db
              .query(query)
              .then(result => result.rows[0])
              .catch(err => console.error('query error', err.stack));

            res.redirect(`/users/${id}`);
          }
        })
        .catch(e => res.send(e));

        //return error if any of the form fields are empty
      } else {
        return res.render("error", { error: 'Fields cannot be empty!'});
    }

  });

  return router;
};
