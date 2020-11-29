const express = require('express');
const router  = express.Router();
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({extended: true}));
router.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
  })
);

module.exports = (db) => {


  // Gets register page
  router.get("/", (req, res) => {
    console.log("req.session: ", req.session);
    const userId = req.session["user_id"];
    console.log("userId: ", userId);
    // const templateVars = {
    //   user_id: users[req.session["user_id"]]
    // };
    res.render("register");//, templateVars);
  });

  // Post and Creates new user
  router.post("/", (req, res) => {
    console.log(req.body);
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
