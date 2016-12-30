function updateItems(brand) {
    $.ajax('/get-items' + (brand ? '/' + brand : '')).then(function(res) {
        $('.items').html('<h4>All</h4>'+res);
    })
}


$(function() {
    updateItems();

    $('.brandlink').on('click', function(e) {
        var brand = $(e.target).attr('href').substr(1);

        updateItems(brand);
    })

    $('.sync').on('click', function(e) {
        $.ajax('/sync').then(function(res) {
            $('.new-items').html('<h4>New</h4>' + res);
        })
    })
});

