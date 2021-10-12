const router = require('express').Router();

const { middleware, authRouter } = require('./auth');
const { inventoryRouter } = require('./inventory');
const { salesRouter } = require('./sales');

router.use('/auth', authRouter);
router.use('/inventory', middleware, inventoryRouter);
router.use('/sales', middleware, salesRouter);

module.exports = router;
