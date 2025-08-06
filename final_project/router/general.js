const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if username/password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" }); 
  }

  // Check if username exists
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" }); 
  }

  // Register the user
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" }); 
});

// Get the book list available in the shop
/*public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});*/
public_users.get('/', async function (req, res) {
  try {
    const getBooks = new Promise((resolve) => {
      resolve(books); 
    });

    const bookList = await getBooks; 

    return res.status(200).json(bookList); 
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
/*public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn; 

  if (books[isbn]) {
    return res.status(200).json(books[isbn]); 
  } else {
    return res.status(404).json({ message: "Book not found" }); 
  }
 });*/
 public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const findBook = new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book); 
      } else {
        reject("Book not found"); 
      }
    });

    const book = await findBook; 
    return res.status(200).json(book);

  } catch (error) {
    return res.status(404).json({ message: error }); 
  }
});
  
// Get book details based on author
/*public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase();  
  const matchingBooks = {};

  for (const [isbn, book] of Object.entries(books)) {
    if (book.author.toLowerCase().includes(author)) {
      matchingBooks[isbn] = book;  
    }
  }

  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).json(matchingBooks); 
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});*/
public_users.get('/author/:author', async function (req, res) {
  const authorQuery = req.params.author.toLowerCase();

  try {
    const findBooksByAuthor = new Promise((resolve, reject) => {
      const matchingBooks = {};
      
      for (const [isbn, book] of Object.entries(books)) {
        if (book.author.toLowerCase().includes(authorQuery)) {
          matchingBooks[isbn] = book;
        }
      }

      if (Object.keys(matchingBooks).length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found for this author");
      }
    });

    const filteredBooks = await findBooksByAuthor;
    return res.status(200).json(filteredBooks);

  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Get all books based on title
/*public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();  
  const matchingBooks = {};

  for (const [isbn, book] of Object.entries(books)) {
    if (book.title.toLowerCase().includes(title)) {
      matchingBooks[isbn] = book;  
    }
  }

  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).json(matchingBooks); 
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});*/
public_users.get('/title/:title', async function (req, res) {
  const titleQuery = req.params.title.toLowerCase();

  try {
    const findBooksByTitle = new Promise((resolve, reject) => {
      const matchingBooks = {};
      
      for (const [isbn, book] of Object.entries(books)) {
        if (book.title.toLowerCase().includes(titleQuery)) {
          matchingBooks[isbn] = book;
        }
      }

      if (Object.keys(matchingBooks).length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found for this title");
      }
    });

    const filteredBooks = await findBooksByTitle;
    return res.status(200).json(filteredBooks);

  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  const reviews = books[isbn].reviews;
  
  if (Object.keys(reviews).length === 0) {
    return res.status(200).json({ message: "No reviews yet" });  
  } else {
    return res.status(200).json(reviews);
  }
});

module.exports.general = public_users;
