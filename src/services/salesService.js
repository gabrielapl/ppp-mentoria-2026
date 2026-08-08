const db = require('../models/db');
const productsService = require('./productsService');

function createRecord({ employeeId, productId, quantity, type }) {
  if (!employeeId || !productId || typeof quantity !== 'number' || quantity <= 0 || !['entry', 'withdrawal'].includes(type)) {
    return { error: 'Dados inválidos para registro' };
  }

  const product = productsService.getProductById(productId);
  if (!product) {
    return { error: 'Produto não encontrado' };
  }

  if (type === 'withdrawal' && product.quantity < quantity) {
    return { error: 'Quantidade insuficiente em estoque' };
  }

  if (type === 'entry') {
    product.quantity += quantity;
  } else {
    product.quantity -= quantity;
  }

  const record = {
    id: `record-${Date.now()}`,
    employeeId,
    productId,
    type,
    quantity,
    createdAt: new Date().toISOString(),
  };

  db.records.push(record);
  return record;
}

function listRecords() {
  return db.records;
}

function getRecordById(id) {
  return db.records.find((record) => record.id === id);
}

function updateRecord(id, { productId, quantity, type }) {
  const record = getRecordById(id);
  if (!record) {
    return { error: 'Registro não encontrado' };
  }

  const existingProduct = productsService.getProductById(record.productId);
  if (!existingProduct) {
    return { error: 'Produto do registro antigo não encontrado' };
  }

  // Revert old record
  if (record.type === 'entry') {
    if (existingProduct.quantity < record.quantity) {
      return { error: 'Não é possível atualizar registro porque o estoque atual é menor que a reversão' };
    }
    existingProduct.quantity -= record.quantity;
  } else {
    existingProduct.quantity += record.quantity;
  }

  const newType = type || record.type;
  const newQuantity = typeof quantity === 'number' ? quantity : record.quantity;
  const newProductId = productId || record.productId;
  const newProduct = productsService.getProductById(newProductId);

  if (!newProduct) {
    // restore original state if possible
    if (record.type === 'entry') {
      existingProduct.quantity += record.quantity;
    } else {
      existingProduct.quantity -= record.quantity;
    }
    return { error: 'Produto não encontrado para atualização' };
  }

  if (newType === 'withdrawal' && newProduct.quantity < newQuantity) {
    // restore original state
    if (record.type === 'entry') {
      existingProduct.quantity += record.quantity;
    } else {
      existingProduct.quantity -= record.quantity;
    }
    return { error: 'Quantidade insuficiente em estoque para atualização' };
  }

  if (newType === 'entry') {
    newProduct.quantity += newQuantity;
  } else {
    newProduct.quantity -= newQuantity;
  }

  record.productId = newProductId;
  record.type = newType;
  record.quantity = newQuantity;
  record.updatedAt = new Date().toISOString();

  return record;
}

function deleteRecord(id) {
  const recordIndex = db.records.findIndex((record) => record.id === id);
  if (recordIndex === -1) {
    return { error: 'Registro não encontrado' };
  }

  const record = db.records[recordIndex];
  const product = productsService.getProductById(record.productId);
  if (!product) {
    return { error: 'Produto não encontrado para exclusão de registro' };
  }

  if (record.type === 'entry') {
    if (product.quantity < record.quantity) {
      return { error: 'Não é possível excluir o registro: quantidade em estoque insuficiente' };
    }
    product.quantity -= record.quantity;
  } else {
    product.quantity += record.quantity;
  }

  db.records.splice(recordIndex, 1);
  return {};
}

module.exports = {
  createRecord,
  listRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
