// State management
let products = [];
let cart = [];
let currentFilter = 'all';

// DOM Elements
const productsContainer = document.getElementById('products-container');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItems = document.getElementById('cart-items');
const cartCount = document.querySelector('.cart-count');
const cartTotal = document.getElementById('cart-total-amount');
const searchInput = document.getElementById('search');
const productModal = document.getElementById('product-modal');
const filterButtons = document.querySelectorAll('.filter-btn');

// Fetch products from API
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        products = await response.json();
        renderProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Render products
function renderProducts() {
    const filteredProducts = products.filter(product => {
        const matchesFilter = currentFilter === 'all' || product.category === currentFilter;
        const matchesSearch = product.name.toLowerCase().includes(searchInput.value.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    productsContainer.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join('');

    // Add click listeners for product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('add-to-cart-btn')) {
                showProductModal(parseInt(card.dataset.productId));
            }
        });
    });
}

// Cart functions
async function addToCart(productId) {
    try {
        const response = await fetch('http://localhost:3000/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId })
        });
        cart = await response.json();
        updateCart();
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

async function removeFromCart(productId) {
    try {
        const response = await fetch(`http://localhost:3000/api/cart/${productId}`, {
            method: 'DELETE'
        });
        cart = await response.json();
        updateCart();
    } catch (error) {
        console.error('Error removing from cart:', error);
    }
}

function updateCart() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Modal functions
function showProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modalContent = document.querySelector('.modal-product-details');
    modalContent.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="modal-product-image">
        <div class="modal-product-info">
            <h2>${product.name}</h2>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p class="description">${product.description}</p>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `;

    productModal.style.display = 'block';
}

// Event Listeners
document.querySelector('.cart-icon').addEventListener('click', () => {
    cartSidebar.classList.add('open');
});

document.querySelector('.close-cart').addEventListener('click', () => {
    cartSidebar.classList.remove('open');
});

document.querySelector('.close-modal').addEventListener('click', () => {
    productModal.style.display = 'none';
});

searchInput.addEventListener('input', renderProducts);

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.dataset.category;
        renderProducts();
    });
});

document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length > 0) {
        alert('Thank you for your purchase! This is where the checkout process would begin.');
        cart = [];
        updateCart();
        cartSidebar.classList.remove('open');
    }
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.style.display = 'none';
    }
});

// Initialize
fetchProducts();
