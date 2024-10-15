import "./style.css";

const loadBooks = async () => {
  const response = await fetch("https://gutendex.com/books");
  try {
    const data =await response.json();
    console.log(data.results)
  } catch (error) {
    alert(error.message);
  }
};

window.loadBooks = loadBooks;