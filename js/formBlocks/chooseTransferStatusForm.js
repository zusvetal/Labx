var getTransferStatus = function ($parentEl, callback) {
    var dfd = jQuery.Deferred();
    $.post(
            "/ajax",
            {
                get_transfer_status: '1'
            },
    function (html) {
        $parentEl.html(html);
        if (typeof callback !== 'undefined') {
            callback($parentEl);
        }
    });
    $parentEl.on('click.transfer', '.list-group-item', function () {
        var id = $(this).data('id');
        dfd.resolve(id);
        dfd.always($parentEl.off('.transfer', '**'));
    });
    return dfd.promise();
};