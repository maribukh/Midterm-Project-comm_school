const productContainer = document.querySelector('.product-cards-container');

let currentPage = 1;
const itemsPerPage = 9;
let productArrays = [];

async function fetchProducts() {
  try {
    const response = await fetch('https://dummyjson.com/products/category/smartphones');
    const data = await response.json();
    
    productArrays = data.products;
    renderProducts(currentPage); 
  } catch (error) {
    console.error('Error', error);
  }
}

function renderProducts(page) {
  productContainer.innerHTML = '';

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const productsToDisplay = productArrays.slice(startIndex, endIndex);

  productsToDisplay.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    
    productCard.innerHTML = `
    <div class="image">
      <img src="${product.images[0]}" alt="${product.title}" class="product-card__image">
    </div>
    <div class="product-info">
      <div class="product-card__prices">
        <h5 class="title-h5">$${product.price}</h5>
        ${product.discountPercentage > 0 ? 
          `<span class="discount">$${product.discountPercentage}</span>` : ''
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
 <p class="product-description">${truncateDescription(product.description, 65)}</p>    </div>
  `;

  function truncateDescription(description, maxLength) {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + '...';
    }
    return description;
  }
    
    productContainer.appendChild(productCard);
  });
  
}

function generateStars(rating) {
  let stars = '';
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

document.addEventListener('DOMContentLoaded', () => {
  fetchProducts(); 
  

});
