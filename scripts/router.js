const express = require('express');

const router = express.Router();


const ctrl = require('./ctrl');

router.use('/query', ctrl.getShort);

router.use('/tf/:pool/:random/:index', ctrl.transfLong);

module.exports = router;
