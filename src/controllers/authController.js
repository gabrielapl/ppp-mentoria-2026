const authService = require('../services/authService');

function registerEmployee(req, res) {
  const { name, email, password, role } = req.body;
  const result = authService.registerEmployee({ name, email, password, role });

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  return res.status(201).json({ data: result.employee, token: result.token });
}

function loginEmployee(req, res) {
  const { email, password } = req.body;
  const result = authService.loginEmployee({ email, password });

  if (result.error) {
    return res.status(401).json({ error: result.error });
  }

  return res.status(200).json({ data: result.employee, token: result.token });
}

module.exports = {
  registerEmployee,
  loginEmployee,
};
