//  blogg server try number one.js
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const blogg = [];

const dateNow = new Date();
const year = dateNow.getFullYear();
const month = (dateNow.getMonth() + 1).toString().padStart(2, "0");
const day = dateNow.getDate().toString().padStart(2, "0");
const formattedDate = `${day}-${month}-${year}`;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// route
app.get("/", (req, res) => {
  try {
    res.render("index", { blogg: blogg });
  } catch (error) {
    handleError(res, error);
  }
});

// create a entry
app.post("/add", (req, res) => {
  try {
    const newTodoName = req.body.todoName;
    const newTodoText = req.body.todoText;
    const newBlogg = {
      todoText: newTodoText,
      todoName: newTodoName,
      currentDate: formattedDate,
    };

    blogg.push(newBlogg);
    res.redirect("/");
  } catch (error) {
    handleError(res, error);
  }
});
//  get ID from last entry
app.post("/edit", (req, res) => {
  try {
    const bloggId = req.body.bloggId;
    const blogToEdit = blogg[bloggId];
    res.render("index", {
      bloggId: bloggId,
      blogToEdit: blogToEdit,
    });
  } catch (error) {
    handleError(res, error);
  }
});

//  update the edit entry
app.post("/edit-submit", (req, res) => {
  try {
    const bloggId = req.body.bloggId;
    const updatedTodoName = req.body.todoName;
    const updatedTodoText = req.body.todoText;
    blogg[bloggId].todoName = updatedTodoName;
    blogg[bloggId].todoText = updatedTodoText;

    res.redirect("/");
  } catch (error) {
    handleError(res, error);
  }
});
// try to delete the entry
app.post("/delete", (req, res) => {
  try {
    const bloggId = req.body.bloggId;

    // Check entry for exist
    if (bloggId === blogg[bloggId]) {
      blogg.splice(bloggId, 1); // Remove the entry at index bloggId
    }
  } catch (error) {
    handleError(res, error);
  }
  res.render("index", {
    blogg: blogg,
  });
});

// middleware for mistakes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

app.listen(port, () => {
  console.log(`Der Server läuft auf http://localhost:${port}`);
});

//methode for mistakes
function handleError(res, error) {
  console.error(error.stack);

  res.status(500).send("Internal Server Error");
}
