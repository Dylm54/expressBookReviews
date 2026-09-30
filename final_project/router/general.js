const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function generalizeString(str) {
    return str.toLowerCase().split(" ").join("-");
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  const newUser = {
    username: username,
    password: password
  }
  const isRegistered = users.filter(user => user.username === username);

  if (isRegistered.length > 0) {
    return res.status(409).json({message: "User already exist!"});
  } else {
    users.push(newUser);
    return res.status(201).json({message: "User already created, you can login now"});
  }
  
});

// Get the book list available in the shop
const getBooks = () => {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject(new Error("Books not found"));
        }
    })
}

public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    const booklist = await getBooks();
    return res.status(200).send(JSON.stringify({booklist}, null, 4))
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return res.send(users[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = generalizeString(req.params.author);
  const booksArr = Object.values(books);
  const getBooksByAuthor = booksArr.filter(book => generalizeString(book.author) === author);

  if (getBooksByAuthor.length > 0) {
    return res.send(getBooksByAuthor);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const title = generalizeString(req.params.author);
  const booksArr = Object.values(books);
  const getBooksByTitle = booksArr.filter(book => generalizeString(book.title) === title);

  if (getBooksByTitle.length > 0) {
    return res.send(getBooksByTitle);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.send(books[isbn][reviews]);
});

module.exports.general = public_users;
