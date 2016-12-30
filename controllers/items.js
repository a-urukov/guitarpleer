var cache = require('../utils/cache'),
    BLACK_LIST = ['Rad_meandr', 'DEAN', 'Guitares', 'Komissionka', 'Ladkor', 'gitaru.ru', 'GUITAR-SALE'];

module.exports = {

    get: function(filter) {
        var items = cache.getItems();

        return Object.keys(items).reduce(function(acc, id) {
            if (BLACK_LIST.some(function(black) {
                return items[id].author.indexOf(black) !== -1;
            })) {
                return acc;
            }

            if (!filter || items[id].text.toLowerCase().indexOf(filter.toLowerCase()) != -1) {
                acc[id] = items[id];
            }

            return acc;
        }, {})
    }

};
