const productsService = require('../services/productsService');

function createProduct(req, res) {
  const { name, quantity, description } = req.body;
  const result = productsService.createProduct({ name, quantity, description });
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  return res.status(201).json({ data: result });
}

function listProducts(req, res) {
  const products = productsService.listProducts();
  return res.status(200).json({ data: products });
}

function getProduct(req, res) {
  const { id } = req.params;
  const product = productsService.getProductById(id);

  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }

  return res.status(200).json({ data: product });
}

function deleteProduct(req, res) {
  const { id } = req.params;
  const result = productsService.deleteProduct(id);

  if (result.error) {
    if (result.error === 'Produto não encontrado') {
      return res.status(404).json({ error: result.error });
    }
    return res.status(400).json({ error: result.error });
  }

  return res.status(204).send();
}

module.exports = {
  createProduct,
  listProducts,
  getProduct,
  deleteProduct,
};
