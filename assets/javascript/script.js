const productContainer = document.querySelector(".product-cards-container");

let currentPage = 1;
const itemsPerPage = 9;
let productArrays = [];

function prodactfilter(pageNumber) {
  currentPage = pageNumber;
  renderProducts(currentPage);
}

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
        <button class="add-to-cart" onclick="addToCart('${product.title}', '${
      product.price
    }','${product.images[0]}')">Add To Cart</button>
      </div>
    `;

    productContainer.appendChild(productCard);
  });

  function truncateDescription(description, maxLength) {
    return description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  }
  // add functional of pagination
  let divp = document.getElementById("pid");
  divp.innerHTML = "";

  for (let i = 0; i < Math.ceil(productArrays.length / itemsPerPage); i++) {
    let sp = document.createElement("span");
    sp.className = "page-number";
    sp.textContent = i + 1;

    sp.addEventListener("click", () => {
      prodactfilter(i + 1);
    });

    divp.appendChild(sp);
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
  if (criteria === "price-asc") {
    productArrays.sort((a, b) => a.price - b.price);
  } else if (criteria === "price-desc") {
    productArrays.sort((a, b) => b.price - a.price);
  } else if (criteria === "name") {
    productArrays.sort((a, b) => a.title.localeCompare(b.title));
  } else if (criteria === "rating-asc") {
    productArrays.sort((a, b) => a.rating - b.rating);
  } else if (criteria === "rating-desc") {
    productArrays.sort((a, b) => b.rating - a.rating);
  }

  renderProducts(currentPage);
}

sortDropdown.addEventListener("change", (event) => {
  const selectedOption = event.target.value;
  sortProducts(selectedOption);
});

// search functional
function renderSearchedProducts(products) {
  productContainer.innerHTML = "";

  products.forEach((product) => {
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
        <button class="add-to-cart" onclick="addToCart('${product.title}', '${
      product.price
    }','${product.images[0]}')">Add To Cart</button>
      </div>
    `;

    productContainer.appendChild(productCard);
  });

  document.getElementById("pid").innerHTML = "";
}

function search(value) {
  let filltered_products = productArrays.filter((x) =>
    x.description.toLowerCase().includes(value.toLowerCase())
  );

  renderProducts(filltered_products);
}

// add to cart functional

let cart = [];

function addToCart(title, price, images) {
  cart.push({ title, price, images });
  displayCart();
}

function displayCart() {
  let cartItems = document.getElementById("cartItems");
  let totalPrice = 0;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<li>Cart is empty</li>";
    document.getElementById("totalPrice").textContent = 0;
    return;
  }

  cart.forEach((item, index) => {
    let li = document.createElement("li");
    let img = document.createElement("img");
    let del = document.createElement("span");
    console.log(cart[index]);
    img.src = item.images;
    img.style.height = "40px";

    del.textContent = "⨉";
    del.style.color = "red";
    del.style.margin = "0.5rem";
    del.style.cursor = "pointer";

    li.textContent = `${item.title} - ${item.price} $ `;
    li.appendChild(img);
    li.appendChild(del);

    cartItems.appendChild(li);

    del.onclick = function () {
      delItem(index);
    };

    totalPrice += parseInt(item.price);
  });

  document.getElementById("totalPrice").textContent = totalPrice;
}

function delItem(index) {
  cart.splice(index, 1);
  displayCart();
}

function toggleCartDetails() {
  let cartItems = document.getElementById("cartItems");

  if (cartItems.style.display === "none" || cartItems.style.display === "") {
    cartItems.style.display = "block";
  } else {
    cartItems.style.display = "none";
  }
}
