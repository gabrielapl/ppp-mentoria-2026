const db = require('../models/db');

function createProduct({ name, quantity, description }) {
  if (!name || typeof quantity !== 'number' || quantity < 0) {
    return { error: 'Dados inválidos para cadastro de produto' };
  }

  const product = {
    id: `product-${Date.now()}`,
    name,
    description: description || '',
    quantity,
    createdAt: new Date().toISOString(),
  };

  db.products.push(product);
  return product;
}

function listProducts() {
  return db.products;
}

function getProductById(id) {
  return db.products.find((product) => product.id === id);
}

module.exports = {
  createProduct,
  listProducts,
  getProductById,
};
