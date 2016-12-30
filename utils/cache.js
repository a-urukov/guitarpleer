var fs = require('fs'),
    FILE_NAME = 'store.data';

function updateItems(items) {
    var cache = this.getItems(),
        res = {};

    items.forEach(function(data) {
        var item = cache[data.id];

        if (!item) {
            item = data;
            item.created = Date.now();
            res[data.id] = item;
        }

        item.updated = Date.now();

        cache[item.id] = item;
    });

    save(JSON.stringify(cache));

    return res;
}

function getItems() {
    var store = read();

    return store ? JSON.parse(store) : {};
}

function save(data) {
    fs.writeFileSync(FILE_NAME, data, { encoding: 'utf8' });
}

function read() {
    return fs.existsSync(FILE_NAME) ? fs.readFileSync(FILE_NAME, { encoding: 'utf8' }) : '';
}

module.exports = {
    updateItems: updateItems,
    getItems: getItems
};
