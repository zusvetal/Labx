var getWorkStatus = function ($parentEl, callback) {
    var dfd = jQuery.Deferred();
    $.post(
            "/ajax",
            {
                get_work_status: '1'
            },
    function (html) {
        $parentEl.html(html);
        if (typeof callback !== 'undefined') {
            callback($parentEl);
        }
    });
    $parentEl.on('click.work', '.list-group-item', function () {
        var id = $(this).data('id');
        dfd.resolve(id);
        dfd.always($parentEl.off('.work', '**'));
    });
    return dfd.promise();
};