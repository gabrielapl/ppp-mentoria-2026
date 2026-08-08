const express = require('express');
const authController = require('../controllers/authController');
const employeesController = require('../controllers/employeesController');
const managersController = require('../controllers/managersController');
const productsController = require('../controllers/productsController');
const recordsController = require('../controllers/salesController');
const { authenticate, authorizeRole, requireManagerOrFirstRegistration } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/employees/register', requireManagerOrFirstRegistration, authController.registerEmployee);
router.post('/employees/login', authController.loginEmployee);
router.get('/employees', authenticate, authorizeRole('worker', 'manager'), employeesController.searchEmployees);

router.post('/managers/register', requireManagerOrFirstRegistration, managersController.registerManager);
router.post('/managers/login', managersController.loginManager);
router.get('/managers', authenticate, authorizeRole('manager'), managersController.listManagers);

router.get('/products', authenticate, productsController.listProducts);
router.get('/products/:id', authenticate, productsController.getProduct);
router.post('/products', authenticate, authorizeRole('worker', 'manager'), productsController.createProduct);
router.delete('/products/:id', authenticate, authorizeRole('manager'), productsController.deleteProduct);

router.get('/records', authenticate, authorizeRole('worker', 'manager'), recordsController.listRecords);
router.get('/records/:id', authenticate, authorizeRole('worker', 'manager'), recordsController.getRecord);
router.post('/records/entry', authenticate, authorizeRole('worker', 'manager'), recordsController.createEntryRecord);
router.post('/records/withdrawal', authenticate, authorizeRole('worker', 'manager'), recordsController.createWithdrawalRecord);
router.put('/records/:id', authenticate, authorizeRole('worker', 'manager'), recordsController.updateRecord);
router.delete('/records/:id', authenticate, authorizeRole('manager'), recordsController.deleteRecord);

module.exports = router;
