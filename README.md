# Analytics Test Shop

A B2C retail website template designed for testing various product analytics tools. This project provides a complete e-commerce environment with trackable user interactions and shopping behaviors.

## Features

- Product catalog with filtering and search
- Product detail views
- Shopping cart functionality
- Category-based navigation
- Checkout flow
- Responsive design

## Analytics Integration Points

- Product impressions
- Product detail views
- Add-to-cart events
- Cart abandonment tracking
- Category preference analysis
- Search pattern tracking
- Conversion funnel analysis

## Tech Stack

- Backend: Node.js with Express
- Frontend: Vanilla JavaScript, HTML5, CSS3
- Static file serving
- RESTful API endpoints

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/s-shindeldecker/analytics-test-shop.git
```

2. Install dependencies:
```bash
cd analytics-test-shop
npm install
```

3. Start the server:
```bash
npm start
```

4. Open http://localhost:3000 in your browser

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/cart` - Get cart contents
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:id` - Remove item from cart

## Project Structure

```
analytics-test-shop/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── server.js
├── package.json
└── README.md
```

## Contributing

Feel free to submit issues and enhancement requests.

## License

This project is licensed under the ISC License.
