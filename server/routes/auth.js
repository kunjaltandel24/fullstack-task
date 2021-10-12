const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const { validationResult, body } = require('express-validator');

const router = require('express').Router();

const { jwtSecret } = require('../config');

const verifyToken = (token, opts = {}) => new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, opts, (err, decoded) => {
        if (err) {
            return reject({
                code: httpStatus.UNAUTHORIZED,
                message: err.message
            });
        }
        resolve(decoded);
    });
});

const middleware = async (req, res, next) => {
    try {
        if (!req.headers.token) {
            throw {
                code: httpStatus.UNAUTHORIZED,
                message: 'missing auth token'
            };
        }
        await verifyToken(req.headers.token);

        next();
    } catch (e) {
        res
            .status(e.code || httpStatus.INTERNAL_SERVER_ERROR)
            .send({ message: e.message });
    }
}


router.post('/login', [
    body('username', 'login username is required').exists(),
    body('password', 'password is required').exists()
], async (req, res) => {
    try {
        const err = validationResult(req);

        if (!err.isEmpty()) {
            throw {
                code: httpStatus.BAD_REQUEST,
                message: err.array().map(e => e.msg).join(',')
            };
        }

        const {
            username,
            password
        } = req.body;
        if (username !== 'admin' || password !== 'Admin@123') {
            throw {
                code: httpStatus.FORBIDDEN,
                message: 'username or password is incorrect'
            }
        }

        const token = await jwt.sign({
            username
        }, jwtSecret, { expiresIn: '365d' });

        res.send({ token });
    } catch (e) {
        res
            .status(e.code || httpStatus.INTERNAL_SERVER_ERROR)
            .send({ message: e.message });

    }
});

module.exports = {
    middleware,
    authRouter: router
};
