module.exports = function(app) {
  app.get("/register", (req, res) => {
    res.send("Register Page OK!");
  });
}
