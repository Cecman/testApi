const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("articles", articleSchema);

const article = new Article({
  title: "DOM",
  content: "DOM is short for Document Object Model",
});

//article.save();

app.get("/articles", function (req, res) {
  Article.find(function (err, articles) {
    if (err) {
      console.log(err);
    } else {
      res.send(articles);
    }
  });
});

app.post("/articles", function (req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
  });

  newArticle.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Success");
    }
  });
});

app.delete("/articles", function (req, res) {
  Article.deleteMany((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Successfully deleted articles");
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
