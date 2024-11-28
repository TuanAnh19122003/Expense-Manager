var express = require('express');
var router = express.Router();
const authRouter = require('./auth');
const expensesRouter = require('./expenses');
const categoriesRouter = require('./categories');

router.use('/auth', authRouter);
router.use('/expenses', expensesRouter);
router.use('/categories', categoriesRouter);

module.exports = router;
