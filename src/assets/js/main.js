import "../css/style.css";

const menuItems = document.querySelectorAll(".menu-item");


// Function to set the active link based on the current URL
const setActiveLink = () => {
  const currentPath = window.location.pathname;

  menuItems.forEach((item) => {
    const href = item.getAttribute("href");

    // Check if the href matches the current URL path
    if (href === currentPath) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
};



// Run on page load
window.addEventListener("load", setActiveLink);
