﻿var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/editor', function (req, res) {
    res.render('editor', { title: 'Editor' });
});

module.exports = router;