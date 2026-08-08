const authService = require('../services/authService');
const employeesService = require('../services/employeesService');

function registerManager(req, res) {
  const { name, email, password } = req.body;
  const result = authService.registerEmployee({ name, email, password, role: 'manager' });

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  return res.status(201).json({ data: result.employee, token: result.token });
}

function loginManager(req, res) {
  const { email, password } = req.body;
  const result = authService.loginEmployee({ email, password });

  if (result.error) {
    return res.status(401).json({ error: result.error });
  }

  if (result.employee.role !== 'manager') {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  return res.status(200).json({ data: result.employee, token: result.token });
}

function listManagers(req, res) {
  const managers = employeesService.listManagers();
  return res.status(200).json({ data: managers });
}

module.exports = {
  registerManager,
  loginManager,
  listManagers,
};
