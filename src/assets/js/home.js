let books = [];
let currentPage = 1;
const booksPerPage = 9;
const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let genreSet = new Set();

// document.addEventListener("DOMContentLoaded", () => {
//   displayBooks();
//   setupPagination();
//   setupEventListeners();
// });

// Function to get all books from the API
const loadBooks = async () => {
  console.log("called");
  const response = await fetch("https://gutendex.com/books");
  try {
    const data = await response.json();
    console.log(data.results);
    books = data.results;
    extractGenres(books);
    displayBooks();
    setupPagination();
  } catch (error) {
    alert(error.message);
  }
};

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  loadBooks();
  setupEventListeners();
});

// Extract unique genres from the fetched books
function extractGenres(books) {
  books.forEach((book) => {
    if (book.bookshelves) {
      book.bookshelves.forEach((genre) =>
        genreSet.add(genre.replace("Browsing: ", ""))
      ); // Add genre to Set
    }
  });
  populateGenreDropdown(); // Populate the genre dropdown
}

// Populate the genre dropdown in the HTML
function populateGenreDropdown() {
  const genreFilter = document.getElementById("genre-filter");
  genreSet.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre.toLowerCase(); // Use lowercase value for filtering
    option.innerText = genre;
    genreFilter.appendChild(option);
  });
}

// Filter and display books
function displayBooks() {
  console.log("called displayBooks");
  const booksList = document.getElementById("books-list");
  booksList.innerHTML = ""; // Clear the current list
  const filteredBooks = filterBooks();
  const paginatedBooks = paginateBooks(filteredBooks);

  paginatedBooks.forEach((book) => {
    const bookDiv = document.createElement("div");

    // Check if the book is in the wishlist
    const isInWishlist = wishlist.includes(book.id);

    bookDiv.innerHTML = `
    <div key=${book.id} class="book-card">
        <figure class="figure">
            <img 
            src="${book.formats["image/jpeg"]}" 
            alt="${book.title}" 
            class='book-image' 
            />  
            <i class="${isInWishlist ? "fa-solid" : "fa-regular"} fa-heart like-btn" data-id="${book.id}" 
            style="color: ${isInWishlist ? "#ff0000" : "#000000"};"}>
            </i>
        </figure>
            
        <div class="book-details">
            <h1 class='book-title'>${book.title}</h1>                   
            <p>Author:${book?.authors[0]?.name}</p>                
            <p>${book.bookshelves? book.bookshelves[0].replace("Browsing: ", ""): "Unknown genre"}</p>
        </div>
    </div>`;

    booksList.appendChild(bookDiv);
  });
}

// Real-time search and genre filter
function filterBooks() {
  console.log("called filterBooks()");
  const searchTerm = document.getElementById("search-bar").value.toLowerCase();
  const genreFilter = document.getElementById("genre-filter").value;

  return books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm);
    const matchesGenre =
      genreFilter === "all" ||
      (book.bookshelves &&
        book.bookshelves.some((shelf) =>
          shelf.toLowerCase().includes(genreFilter)
        ));
    return matchesSearch && matchesGenre;
  });
}

// Pagination logic
function paginateBooks(filteredBooks) {
  const start = (currentPage - 1) * booksPerPage;
  const end = start + booksPerPage;
  return filteredBooks.slice(start, end);
}

// Setup pagination buttons
function setupPagination() {
  console.log("called setupPagination");
  const paginationDiv = document.getElementById("pagination");
  paginationDiv.innerHTML = ""; // Clear previous pagination
  const totalPages = Math.ceil(filterBooks().length / booksPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement("span");
    pageLink.classList.add("page-link");
    pageLink.innerText = i;
    pageLink.addEventListener("click", () => {
      currentPage = i;
      displayBooks();
    });
    paginationDiv.appendChild(pageLink);
  }
}

// Handle events for real-time search, genre filter, and wishlist toggle
function setupEventListeners() {
  console.log("called setupEvent");
  document.getElementById("search-bar").addEventListener("input", () => {
    currentPage = 1; // Reset to first page on search
    displayBooks();
    setupPagination();
  });

  document.getElementById("genre-filter").addEventListener("change", () => {
    currentPage = 1; // Reset to first page on genre change
    displayBooks();
    setupPagination();
  });

  document.getElementById("books-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("like-btn")) {
      const bookId = Number(e.target.dataset.id);
      toggleWishlist(bookId);
      displayBooks();
    }
  });
}

// Toggle wishlist functionality
function toggleWishlist(bookId) {
  console.log("called toggleWishlist");
  console.log(bookId);
  if (wishlist.includes(bookId)) {
    const index = wishlist.indexOf(bookId);
    wishlist.splice(index, 1);
  } else {
    wishlist.push(bookId);
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// set loadBooks in window to access from dom directly
window.loadBooks = loadBooks;
