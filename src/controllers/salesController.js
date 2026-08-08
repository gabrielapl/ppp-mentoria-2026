const recordsService = require('../services/salesService');

function createEntryRecord(req, res) {
  const { productId, quantity } = req.body;
  const employeeId = req.user.id;
  const result = recordsService.createRecord({
    employeeId,
    productId,
    quantity,
    type: 'entry',
  });

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  return res.status(201).json({ data: result });
}

function createWithdrawalRecord(req, res) {
  const { productId, quantity } = req.body;
  const employeeId = req.user.id;
  const result = recordsService.createRecord({
    employeeId,
    productId,
    quantity,
    type: 'withdrawal',
  });

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  return res.status(201).json({ data: result });
}

function updateRecord(req, res) {
  const { id } = req.params;
  const { productId, quantity, type } = req.body;
  const result = recordsService.updateRecord(id, {
    productId,
    quantity,
    type,
  });

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  if (!result) {
    return res.status(404).json({ error: 'Registro não encontrado' });
  }

  return res.status(200).json({ data: result });
}

function deleteRecord(req, res) {
  const { id } = req.params;
  const result = recordsService.deleteRecord(id);

  if (result.error) {
    if (result.error === 'Registro não encontrado') {
      return res.status(404).json({ error: result.error });
    }
    return res.status(400).json({ error: result.error });
  }

  return res.status(204).send();
}

function listRecords(req, res) {
  const records = recordsService.listRecords();
  return res.status(200).json({ data: records });
}

function getRecord(req, res) {
  const { id } = req.params;
  const record = recordsService.getRecordById(id);
  if (!record) {
    return res.status(404).json({ error: 'Registro não encontrado' });
  }
  return res.status(200).json({ data: record });
}

module.exports = {
  createEntryRecord,
  createWithdrawalRecord,
  updateRecord,
  deleteRecord,
  listRecords,
  getRecord,
};
