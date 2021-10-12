const httpStatus = require('http-status');
const { validationResult, body, param } = require('express-validator');

const CarModel = require('../db/models/car');

const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        const { offset = 0, limit = 20, q = '', sku } = req.query;

        const options = {};
        if (q) {
            const searchQuery = req.query.q.toLowerCase().trim().replace(/[\+\-\/\_]/g, (a) => `\\${a}`);
            options.$or = [{
                name: {$regex: searchQuery, $options: 'i'},
            }, {
                model: { $regex: searchQuery, $options: 'i' }
            }];
        }
        if (sku) {
            options.sku = sku;
        }
        const total = await CarModel.count(options);
        const list = await CarModel.find(options)
            .skip(Number(offset) || 0)
            .limit(Number(limit) || 20);

        res.send({
            list,
            total
        });
    } catch (e) {
        res
            .status(e.code || httpStatus.INTERNAL_SERVER_ERROR)
            .send({ message: e.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const car = await CarModel.findOne({
            $or: [{
                _id: req.params.id
            }, {
                sku: req.params.id
            }]
        });

        if (!car) {
            throw {
                code: httpStatus.NOT_FOUND,
                message: 'car not available'
            };
        }

        res.send(car);
    } catch (e) {
        res
            .status(e.code || httpStatus.INTERNAL_SERVER_ERROR)
            .send({ message: e.message });
    }
});

router.post('/', [
    body('name', 'car name required').exists(),
    body('model', 'car model required').exists(),
    body('price', 'car price is required').exists()
        .isFloat().withMessage('invalid car price'),
    body('quantity', 'car quantity is required').exists()
        .isFloat().withMessage('invalid car price'),
], async (req, res) => {
    try {
        const err = validationResult(req);

        if (!err.isEmpty()) {
            throw {
                code: httpStatus.BAD_REQUEST,
                message: err.array().map(e => e.msg).join(',')
            };
        }

        const carCount = await CarModel.count();
        req.body.sku = `CAR-${new Date().getFullYear()}-${carCount}-${req.body.name}-${req.body.model}`;

        const car = await CarModel.create(req.body);

        res.send({ car });
    } catch (e) {
        res
            .status(e.code || httpStatus.INTERNAL_SERVER_ERROR)
            .send({ message: e.message });
    }
});

router.put('/:id', [
    body('name', 'car name required').exists(),
    body('model', 'car model required').exists(),
    body('price', 'car price is required').exists()
        .isFloat().withMessage('invalid car price'),
    body('quantity', 'car quantity is required').exists()
        .isFloat().withMessage('invalid car price'),
], async (req, res) => {
    try {
        const err = validationResult(req);

        if (!err.isEmpty()) {
            throw {
                code: httpStatus.BAD_REQUEST,
                message: err.array().map(e => e.msg).join(',')
            };
        }

        let car = await CarModel.findOne(req.params.id);

        if (!car) {
            throw {
                code: httpStatus.NOT_FOUND,
                message: 'car not available'
            };
        }

        car = await CarModel.findOneAndUpdate({
            _id: id
        }, {
            model: req.body.model,
            name: req.body.name,
            quantity: req.body.quantity,
            price: req.body.price
        });

        res.send({ car });
    } catch (e) {
        res
            .status(e.code || httpStatus.INTERNAL_SERVER_ERROR)
            .send({ message: e.message });
    }
});

module.exports = {
    inventoryRouter: router
};
