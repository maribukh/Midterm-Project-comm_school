const productContainer = document.querySelector(".product-cards-container");

let currentPage = 1;
const itemsPerPage = 9;
let productArrays = [];

async function fetchProducts() {
  try {
    const response = await fetch(
      "https://dummyjson.com/products/category/smartphones"
    );
    const data = await response.json();

    productArrays = data.products;
    renderProducts(currentPage);
  } catch (error) {
    console.error("Error", error);
  }
}

function renderProducts(page) {
  productContainer.innerHTML = "";

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const productsToDisplay = productArrays.slice(startIndex, endIndex);

  productsToDisplay.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
      <div class="image">
        <img src="${product.images[0]}" alt="${
      product.title
    }" class="product-card__image">
      </div>
      <div class="product-info">
        <div class="product-card__prices">
          <h5 class="title-h5">$${product.price}</h5>
          ${
            product.discountPercentage > 0
              ? `<span class="discount">${product.discountPercentage}% OFF</span>`
              : ""
          }
        </div>
        <div class="favorite">
          <img src="./assets/icons/favorite_border.svg" alt="favorite">
        </div>
        <div class="rating">
          <ul>
            ${generateStars(product.rating)}
            <span class="product_rating">${product.rating}</span>
          </ul>
        </div>
        <h4 class="product-card__name">${product.title}</h4>
        <p class="product-description">${truncateDescription(
          product.description,
          35
        )}</p>
        <button class="add-to-cart" onclick="addToCart('${product.title}', ${
      product.price
    })">Add To Cart</button>
      </div>
    `;

    productContainer.appendChild(productCard);
  });

  function truncateDescription(description, maxLength) {
    return description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  }
}

function generateStars(rating) {
  let stars = "";
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  for (let i = 0; i < fullStars; i++) {
    stars += `<li><img src="./assets/icons/star_colored.svg" alt="star"></li>`;
  }

  for (let i = 0; i < emptyStars; i++) {
    stars += `<li><img src="./assets/icons/star_uncolored.svg" alt="star"></li>`;
  }

  return stars;
}

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
});

// sorting
const sortDropdown = document.querySelector(".select-box select");

function sortProducts(criteria) {
  if (criteria === "sort by price") {
    productArrays.sort((a, b) => a.price - b.price);
  } else if (criteria === "sort by name") {
    productArrays.sort((a, b) => a.title.localeCompare(b.title));
  } else if (criteria === "sort by rating") {
    productArrays.sort((a, b) => b.rating - a.rating);
  }

  renderProducts(currentPage);
}

sortDropdown.addEventListener("change", (event) => {
  const selectedOption = event.target.value;
  sortProducts(selectedOption);
});

let cart = [];

function addToCart(title, price) {
  cart.push({ title, price });
  displayCart();
}

function displayCart() {
  let cartItems = document.getElementById("cartItems");
  let totalPrice = 0;

  cartItems.innerHTML = "";

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.title} - ${item.price} ₾`;

    const del = document.createElement("span");
    del.textContent = " ⨉";
    del.style.cursor = "pointer";
    del.style.marginLeft = "10px";

    del.onclick = () => delItem(index);

    li.appendChild(del);
    cartItems.appendChild(li);

    totalPrice += parseFloat(item.price);
  });

  document.getElementById("totalPrice").textContent = totalPrice.toFixed(2);
}

function delItem(index) {
  cart.splice(index, 1);
  displayCart();
}
