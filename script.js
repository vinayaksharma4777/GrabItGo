
let allProducts = []; 


async function fetchProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=100");
    const data = await response.json();
    allProducts = data.products;
    displayProducts(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}


function displayProducts(products) {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.setAttribute("data-category", product.category);

    card.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>₹${product.price}</p>
      <button class="add-cart">Add to Cart</button>
      <button class="wishlist-btn" title="Add to Wishlist">
        <span class="heart">&#10084;</span>
      </button>
    `;

    container.appendChild(card);
  });

  setupButtons();
}

function searchProducts() {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();

  if (!query) {
    displayProducts(allProducts); 
    return;
  }

  const filtered = allProducts.filter(p =>
    p.title.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );

  displayProducts(filtered);
}


function setupButtons() {
  
  document.querySelectorAll('.add-cart').forEach(button => {
    button.onclick = () => {
      const card = button.closest('.product-card');
      const name = card.querySelector('h3').textContent;
      const price = parseFloat(card.querySelector('p').textContent.replace('₹', ''));
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existing = cart.find(i => i.name === name);
      if (existing) existing.quantity += 1;
      else cart.push({ name, price, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${name} added to cart!`);
    };
  });

  document.querySelectorAll('.wishlist-btn').forEach(button => {
    button.onclick = () => {
      const card = button.closest('.product-card');
      const name = card.querySelector('h3').textContent;
      const price = parseFloat(card.querySelector('p').textContent.replace('₹', ''));
      let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      const idx = wishlist.findIndex(i => i.name === name);
      const heart = button.querySelector('.heart');

      if (idx === -1) {
        wishlist.push({ name, price });
        heart.style.color = 'red';
        alert(`${name} added to wishlist!`);
      } else {
        wishlist.splice(idx, 1);
        heart.style.color = 'black';
        alert(`${name} removed from wishlist.`);
      }

      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    };

   
    const name = button.closest('.product-card').querySelector('h3').textContent;
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (wishlist.some(i => i.name === name)) button.querySelector('.heart').style.color = 'red';
  });
}


fetchProducts();

