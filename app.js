const express = require('express');
const cors = require('cors');
const createHttpError = require('http-errors');
const { get, add, getAll, update } = require('./storage');

module.exports = express()
    .use(cors())
    .use(express.json())
    .get('/storage', (req, res, next) => {
        const { key } = req.query;
        if (!key) {
            return next(createHttpError(400, 'Please provide a key'));
        }
        return get(key)
            .then((data) => {
                if (!data) return next(createHttpError(404, `Key ${key} not found`));
                return res.json(data);
            })
            .catch(next);
    })
    .post('/storage', (req, res, next) => {
        const data = req.body;
        if (!data) {
            return next(createHttpError(400, 'Please provide a data'));
        }
        // Destructuring Assignment: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
        const { key, expireDuration } = req.query;
        return add(data, key, expireDuration)
            .then((key) => res.status(201).json({ key }))
            .catch(next);
    })
    .get('/storage/all', (req, res, next) => {
        // isExpired can only be 0 or 1, 0 --> Not expired, 1 --> Expired

        const { lastId, pageSize, isExpired } = req.query;
        return getAll(lastId, pageSize, isExpired)
            .then((result) => res.json(result))
            .catch(next);
    })
    .put('/storage', (req, res, next) => {
        const { key, expiryDate } = req.query;
        return update(key, expiryDate)
            .then(() => res.sendStatus(200))
            .catch(next);
    })
    .use((req, res, next) => next(createHttpError(404, `Unknown resource ${req.method} ${req.originalUrl}`)))
    .use((error, req, res, next) => {
        console.error(error);
        next(error);
    })
    .use((error, req, res, next) => res.status(error.status || 500).json({ error: error.message || 'Unknown error' }));
