require('dotenv').config()
const express = require("express");
const path = require("path");
const app = express();

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});