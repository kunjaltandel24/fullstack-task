const httpStatus = require('http-status');
const {validationResult, body, param} = require('express-validator');

const CarModel = require('../db/models/car');
const SaleModel = require('../db/models/sale-transaction');

const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        const {
            offset = 0,
            limit = 20,
            q = '',
            sku,
            model = '',
            name = '',
            buyerName = '',
            buyerPhone = '',
            minSaleDate,
            maxSaleDate
        } = req.query;

        const options = {};
        const carOptions = {};
        if (q) {
            const searchQuery = req.query.q.toLowerCase().trim().replace(/[\+\-\/\_]/g, (a) => `\\${a}`);
            options.$or = [{
                buyerName: {$regex: searchQuery, $options: 'i'},
            }, {
                buyerPhone: {$regex: searchQuery, $options: 'i'}
            }];
            carOptions.$or = [{
                name: {$regex: searchQuery, $options: 'i'},
            }, {
                model: {$regex: searchQuery, $options: 'i'}
            }];
        }
        if (sku) {
            carOptions.sku = sku;
        }
        if (model) {
            carOptions.model = model;
        }
        if (name) {
            carOptions.name = name;
        }
        let carIds;
        if (Object.keys(carOptions).length) {
            const cars = await CarModel.find(carOptions)
                .lean();

            carIds = cars.map(c => c._id);
        }

        if (carIds && carIds.length) {
            if (options.$or && options.$or.length) {
                options.$or.push({
                    car: {$in: carIds}
                });
            } else {
                options.car = {$in: carIds};
            }
        }
        if (buyerName) {
            options.name = name;
        }
        if (buyerPhone) {
            options.name = name;
        }
        if (minSaleDate && maxSaleDate) {
            options.$and = [{
                saleDate: {$gte: minSaleDate}
            }, {
                saleDate: {$lte: maxSaleDate}
            }];
        }
        const total = await SaleModel.count(options);
        const list = await SaleModel.find(options)
            .populate({
                path: 'car',
                select: {model: 1, name: 1, price: 1, _id: 1}
            })
            .skip(Number(offset) || 0)
            .limit(Number(limit) || 20)
            .lean();

        res.send({
            list,
            total
        });
    } catch (e) {
        res
            .status(e.code || httpStatus.INTERNAL_SERVER_ERROR)
            .send({message: e.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const sale = await SaleModel.findOne({
            _id: req.params.id
        })
            .populate({
                path: 'car',
                select: {model: 1, name: 1, price: 1, _id: 1}
            });

        if (!sale) {
            throw {
                code: httpStatus.NOT_FOUND,
                message: 'car not available'
            };
        }

        res.send({
            data: sale
        });
    } catch (e) {
        res
            .status(e.code || httpStatus.INTERNAL_SERVER_ERROR)
            .send({message: e.message});
    }
});

router.post('/add-sale', [
    body('sku', 'car sku required').exists(),
    body('buyerName', 'buyer name is required').exists(),
    body('buyerPhone', 'buyer phone is required').exists()
        .isNumeric().withMessage('invalid phone number'),
    body('price').optional()
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

        const car = await CarModel.findOne({
            sku: req.body.sku
        });

        if (!car) {
            throw {
                code: httpStatus.NOT_FOUND,
                message: 'car not available'
            };
        }

        const sale = await SaleModel.create({
            car: car._id,
            saleDate: new Date(),
            soldPrice: Number(req.body.price) || car.price,
            buyerName: req.body.buyerName,
            buyerPhone: req.body.buyerPhone
        });

        sale.populate({
            path: 'car',
            select: {model: 1, name: 1, price: 1, _id: 1}
        })

        await CarModel.updateOne({
            _id: car._id
        }, {$inc: {quantity: -1}})
            .exec();

        res.send({
            data: sale
        });
    } catch (e) {
        res
            .status(e.code || httpStatus.INTERNAL_SERVER_ERROR)
            .send({message: e.message});
    }
});

module.exports = {
    salesRouter: router
};
