const employeesService = require('../services/employeesService');

function searchEmployees(req, res) {
  const { q } = req.query;
  const employees = employeesService.searchEmployees(q);
  return res.status(200).json({ data: employees });
}

module.exports = {
  searchEmployees,
};
