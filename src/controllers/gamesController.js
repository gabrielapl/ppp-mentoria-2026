const gamesService = require('../services/gamesService');

function createProduct(req, res) {
  const { name, quantity, description } = req.body;
  const result = gamesService.createProduct({ name, quantity, description });
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  return res.status(201).json({ data: result });
}

function listProducts(req, res) {
  const products = gamesService.listProducts();
  return res.status(200).json({ data: products });
}

function getProduct(req, res) {
  const { id } = req.params;
  const product = gamesService.getProductById(id);

  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }

  return res.status(200).json({ data: product });
}

module.exports = {
  createProduct,
  listProducts,
  getProduct,
};
