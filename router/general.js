const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if the username is valid and not already taken
    if (!isValid(username)) {
        return res.status(400).json({ message: "Invalid username or username already taken." });
    }

    // Add the new user to the users array
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    // Return the list of books
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Check if the book exists and return its details
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookList = [];

    // Filter books by author
    for (let isbn in books) {
        if (books[isbn].author === author) {
            bookList.push(books[isbn]);
        }
    }

    if (bookList.length > 0) {
        return res.status(200).json(bookList);
    } else {
        return res.status(404).json({ message: "No books found by this author." });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const bookList = [];

    // Filter books by title
    for (let isbn in books) {
        if (books[isbn].title === title) {
            bookList.push(books[isbn]);
        }
    }

    if (bookList.length > 0) {
        return res.status(200).json(bookList);
    } else {
        return res.status(404).json({ message: "No books found with this title." });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Check if the book exists and return its reviews
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});

module.exports.general = public_users;
