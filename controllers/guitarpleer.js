var http = require('http'),
    Vow = require('vow'),
    cache = require('../utils/cache');

function getHtml(page) {
    var promise = new Vow.promise();

    http.get("http://forum.guitarplayer.ru/index.php?board=20." + ((page || 0) - 1) * 40, function(res) {
        var buffer = '';

        res
            .on('data', function(chunk) {
                buffer += chunk;
            })
            .on('end', function() {
                promise.fulfill(buffer);
            });
    });

    return promise;
}

function getItems(html) {
    var promise = new Vow.promise(),
        env = require('jsdom').env;

    env(html, function(errors, window) {
        var $ = require('jquery')(window),
            res = [];

        $('td.subject').toArray().forEach(function(node) {
            var $item = $(node).find('div>span>a'),
                href = $item.attr('href');

            if (!href) return;

            var id = href.match(/topic=(\d+)\./),
                author = $(node).find('div>p>strong>a').text();

            if (!$item.text().match(/([A-z0-9\//\-\:\\&'",]+\s*)+/g)) return {
                text: $item.text(),
                href: href,
                id: id,
                author: author
            };

            //TODO parseTitle function
            var text = $item.text().match(/([A-z0-9\//\-\:\\&'",]+\s*)+/g).sort(function(t1, t2) {
                var l1 = t1.length,
                    l2 = t2.length;

                return l1 - l2;
            }).pop();


            res.push({
                text: text,
                href: href,
                id: id,
                author: author
            });
        });

        promise.fulfill(res);
    });

    return promise;
}

module.exports = {

    get: function() {
        return Vow.all([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function(page) {
                return getHtml(page).then(function(html) {
                    return getItems(html);
                });
            })).then(function(array) {
            var items = array.reduce(function(accum, item) {
                    accum = accum.concat(item);
                    return accum;
                }, []);

                return cache.updateItems(items);
            });
    }

};
