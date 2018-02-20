var express = require('express');
var router = express.Router();


router.get('/prototype', function (req, res) {
    res.render('prototype/index', { title: 'Prototype' });
});

module.exports = router;