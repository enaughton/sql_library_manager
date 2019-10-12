const express = require("express");
const router = express.Router();
const Book = require("../models").Book;

// set up parsing
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  };
}

/* GET books listing. */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    res.render("index", { books, title: "Book Library" });
  })
);

/* Create a new book form. */
router.get("/new", (req, res) => {
  res.render("new-book", { book: {}, title: "New book" });
});

/* POST create book. */
router.post(
  "/new",
  asyncHandler(async (req, res) => {
    const book = await Book.create(req.body);
    res.redirect("/books");
  })
);

/* GET individual book. */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render("book-details", { book, title: book.title });
  })
);

/* Edit book form. */
router.get(
  "/:id/edit",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render("books-details", { book, title: "Edit book" });
  })
);

/* Update an book. */
router.post(
  "/:id/edit",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect("/books");
  })
);

/* Delete book form. */
router.get(
  "/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render("books-details", { book, title: "Delete book" });
  })
);

/* Delete individual book. */
router.post(
  "/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect("/books");
  })
);

module.exports = router;
