const jwt = require('jsonwebtoken');
const db = require('../models/db');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não informado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const employee = db.employees.find((item) => item.id === decoded.id && item.email === decoded.email);
    if (!employee) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

function requireManagerOrFirstRegistration(req, res, next) {
  if (db.employees.length === 0) {
    return next();
  }

  authenticate(req, res, () => {
    authorizeRole('manager')(req, res, next);
  });
}

function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  };
}

module.exports = {
  authenticate,
  authorizeRole,
  requireManagerOrFirstRegistration,
};
