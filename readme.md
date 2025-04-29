# E-Commerce Cart & Product Management System

A robust backend system for managing products, shopping carts, and orders with concurrency control and caching.

## Features

- **Product Management**
  - Create/update products with inventory tracking
  - Optimistic locking for stock updates
  - Redis caching with automatic invalidation

- **Cart Management**
  - Session-based shopping carts
  - TTL (24h) automatic cart expiration
  - Version-aware item operations

- **Checkout System**
  - Atomic stock reservation
  - Compensation-based rollbacks
  - Order creation pipeline

- **Optimizations**
  - Redis cache-aside pattern
  - MongoDB indexing (performance)
  - Lean query optimizations

## Tech Stack

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6+
- Redis 7+

### Installation
```bash
git clone https://github.com/yourrepo/ecommerce-cart-system.git
cd node-shopping-cart
npm install