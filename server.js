const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Mock product data with placeholder images
const products = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 199.99,
        description: "High-quality wireless headphones with noise cancellation",
        image: "https://picsum.photos/400/300?random=1",
        category: "Electronics"
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        price: 149.99,
        description: "Track your fitness goals with this advanced smartwatch",
        image: "https://picsum.photos/400/300?random=2",
        category: "Electronics"
    },
    {
        id: 3,
        name: "Organic Cotton T-Shirt",
        price: 29.99,
        description: "Comfortable, sustainable cotton t-shirt",
        image: "https://picsum.photos/400/300?random=3",
        category: "Clothing"
    },
    {
        id: 4,
        name: "Leather Messenger Bag",
        price: 89.99,
        description: "Stylish leather bag for your daily essentials",
        image: "https://picsum.photos/400/300?random=4",
        category: "Accessories"
    },
    {
        id: 5,
        name: "Wireless Gaming Mouse",
        price: 79.99,
        description: "High-precision gaming mouse with customizable buttons",
        image: "https://picsum.photos/400/300?random=5",
        category: "Electronics"
    },
    {
        id: 6,
        name: "Denim Jacket",
        price: 59.99,
        description: "Classic denim jacket with modern fit",
        image: "https://picsum.photos/400/300?random=6",
        category: "Clothing"
    }
];

// Shopping cart storage
let cart = [];

// Get all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
});

// Get cart
app.get('/api/cart', (req, res) => {
    res.json(cart);
});

// Add to cart
app.post('/api/cart', (req, res) => {
    const { productId, quantity } = req.body;
    const product = products.find(p => p.id === parseInt(productId));
    
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity || 1
    };
    
    cart.push(cartItem);
    res.json(cart);
});

// Remove from cart
app.delete('/api/cart/:id', (req, res) => {
    const index = cart.findIndex(item => item.id === parseInt(req.params.id));
    if (index > -1) {
        cart.splice(index, 1);
    }
    res.json(cart);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
