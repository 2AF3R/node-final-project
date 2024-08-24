const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    // Ensure username is between 3 and 16 characters, starts with a letter, and contains only alphanumeric characters
    const regex = /^[a-zA-Z][a-zA-Z0-9]{2,15}$/;
    return regex.test(username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    // Find the user in the records
    const user = users.find(u => u.username === username);
    
    // If the user is found and the password matches, return true
    if (user && user.password === password) {
        return true;
    }
    
    // Otherwise, return false
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  // Check if the username and password are provided
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if the user is authenticated
  if (authenticatedUser(username, password)) {
      // Generate a JWT token for the authenticated user
      const accessToken = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
      
      return res.status(200).json({ message: "Login successful", token: accessToken });
  } else {
      return res.status(401).json({ message: "Invalid username or password." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const username = req.user.username; // Assuming req.user is set after JWT authentication middleware

  // Check if the book exists in the database
  if (books[isbn]) {
      // If the user has already reviewed the book, update the review
      if (books[isbn].reviews[username]) {
          books[isbn].reviews[username] = review;
          return res.status(200).json({ message: "Review updated successfully." });
      } else {
          // Otherwise, add a new review
          books[isbn].reviews[username] = review;
          return res.status(201).json({ message: "Review added successfully." });
      }
  } else {
      return res.status(404).json({ message: "Book not found." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
