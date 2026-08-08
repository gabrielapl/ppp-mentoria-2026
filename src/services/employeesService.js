const db = require('../models/db');

function createEmployee({ name, email, password, role }) {
  const employee = {
    id: `employee-${Date.now()}`,
    name,
    email,
    password,
    role: role && ['worker', 'manager'].includes(role) ? role : 'worker',
    createdAt: new Date().toISOString(),
  };

  db.employees.push(employee);
  return employee;
}

function searchEmployees(search) {
  const query = search ? search.toLowerCase() : '';
  return db.employees.filter((employee) =>
    employee.name.toLowerCase().includes(query) || employee.email.toLowerCase().includes(query),
  );
}

function getEmployeeById(id) {
  return db.employees.find((employee) => employee.id === id);
}

function getEmployeeByEmail(email) {
  return db.employees.find((employee) => employee.email === email);
}

function listManagers() {
  return db.employees.filter((employee) => employee.role === 'manager');
}

module.exports = {
  createEmployee,
  searchEmployees,
  getEmployeeById,
  getEmployeeByEmail,
  listManagers,
};
