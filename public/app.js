// LaunchDarkly Client Initialization
const ldClient = LDClient.initialize('66fdb5f5cefd6708575fe683', {
    // Anonymous user object - you can customize this based on your needs
    anonymous: true
});

// Header Image Management with LaunchDarkly
const headerConfig = {
    defaultImage: 'header-image.svg',
    currentImage: null
};

// Initialize LaunchDarkly and header image
ldClient.on('ready', () => {
    // Get header image from LaunchDarkly feature flag
    updateHeaderImageFromFlags();

    // Set up flag change listener
    ldClient.on('change', (flags) => {
        if (flags.headerImage) {
            updateHeaderImageFromFlags();
        }
    });
});

function updateHeaderImageFromFlags() {
    const headerImageFlag = ldClient.variation('headerImage2', {
        imagePath: headerConfig.defaultImage,
        altText: 'Shop Header'
    });

    setHeaderImage(headerImageFlag, headerImageFlag.altText);
}

function setHeaderImage(imageUrl, altText = 'Shop Header') {
    const headerContainer = document.getElementById('header-container');
    if (!headerContainer) return;

    // Create or update image element
    let headerImage = headerContainer.querySelector('img');
    if (!headerImage) {
        headerImage = document.createElement('img');
        headerContainer.appendChild(headerImage);
    }

    // Update image source and alt text
    headerImage.src = imageUrl;
    headerImage.alt = altText;
    headerConfig.currentImage = imageUrl;
}

function getHeaderImage() {
    return headerConfig.currentImage || headerConfig.defaultImage;
}

// Products Management
let products = [];
let cart = [];

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
    const productsContainer = document.getElementById('products-container');
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

// Cart Management
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
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total-amount');

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

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Cart toggle
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.querySelector('.close-cart');

    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('open');
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });

    // Search functionality
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', renderProducts);

    // Category filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.category;
            renderProducts();
        });
    });

    // Initialize
    fetchProducts();
});

// Modal Management
function showProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const modalContent = modal.querySelector('.modal-product-details');
    
    modalContent.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="modal-product-image">
        <div class="modal-product-info">
            <h2>${product.name}</h2>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p class="description">${product.description}</p>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `;

    modal.style.display = 'block';
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('product-modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Close modal button
document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('product-modal').style.display = 'none';
});
