var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { brands: req.brands, title: 'Express' });
});

router.get('/sync', function(req, res) {

    require('../controllers/guitarpleer.js').get().then(function(items) {
        res.render('items', { items: items });
    });

});

router.get('/get-items/:brand*?', function(req, res) {
    res.render('items',
        { items: require('../controllers/items.js').get(req.params.brand &&decodeURIComponent(req.params.brand)) });
});


module.exports = router;
