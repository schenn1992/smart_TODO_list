const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // Gets register page
  router.get("/", (req, res) => {
    res.send("Register Page OK!");
  });

  // Post and Creates new user
  router.post("/", (req, res) => {
    // Can't test yet, need to create register.ejs first
    res.send("Posting to Register Page OK!");

    // Need to fix these to match the db
    // const user = req.body;
    // user.password = bcrypt.hashSync(user.password, 12);
    // console.log(user);
    // db.addUser(user)
    // .then(user => {
    // if (!user) {
    // return res.send({error: "error"});
    // }
    // req.session.userId = user.id;
    // res.send(`Logged in as ${user.username}`);
    // })
    // .catch(e => res.send(e));
  });

  return router;
}
