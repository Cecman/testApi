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

//general route
app
  .route("/articles")
  .get((req, res) => {
    Article.find((err, articles) => {
      if (err) {
        console.log(err);
      } else {
        //console.log(res.statusCode);
        res.send([res.statusCode, articles]);
      }
    });
  })
  .post((req, res) => {
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
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully deleted articles");
      }
    });
  });
////////general route end

//specific article route

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching the parameters");
      }
    });
  })
  .put((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Succesfully updated the article");
        }
      }
    );
  })
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err) => {
        if (err) {
          res.send(err);
        } else {
          res.send("Succesfully updated the article");
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne(
      { title: req.params.articleTitle }, 
      (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Succesfully deleted the article");
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
