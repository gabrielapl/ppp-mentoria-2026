const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const employeesService = require('./employeesService');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
const JWT_EXPIRES_IN = '3h';

function hashPassword(password) {
  return bcrypt.hashSync(password, 8);
}

function comparePassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

function sanitizeEmployee(employee) {
  const { password, ...rest } = employee;
  return rest;
}

function registerEmployee({ name, email, password, role }) {
  if (!name || !email || !password) {
    return { error: 'Dados inválidos para cadastro de funcionário' };
  }

  if (role && !['worker', 'manager'].includes(role)) {
    return { error: 'Perfil inválido' };
  }

  if (require('../models/db').employees.length === 0 && role !== 'manager') {
    return { error: 'O primeiro cadastro deve ser de um gerente' };
  }

  const existing = employeesService.getEmployeeByEmail(email);
  if (existing) {
    return { error: 'Funcionário já cadastrado' };
  }

  const employee = employeesService.createEmployee({
    name,
    email,
    password: hashPassword(password),
    role: role || 'worker',
  });

  const token = generateToken(employee);
  return { employee: sanitizeEmployee(employee), token };
}

function loginEmployee({ email, password }) {
  if (!email || !password) {
    return { error: 'Dados inválidos para login de funcionário' };
  }

  const employee = employeesService.getEmployeeByEmail(email);
  if (!employee || !comparePassword(password, employee.password)) {
    return { error: 'Credenciais inválidas' };
  }

  const token = generateToken(employee);
  return { employee: sanitizeEmployee(employee), token };
}

module.exports = {
  registerEmployee,
  loginEmployee,
};
