const express = require('express');
const router = express.Router();
const {CLIENTS} = require('../../constants/APICONSTANTS')
router.use(CLIENTS, require('./client.route'))
module.exports = router;
