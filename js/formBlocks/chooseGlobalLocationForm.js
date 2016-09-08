var getGlobalLocations = function ($parentEl, callback) {
    var dfd = jQuery.Deferred();
    $.post(
            "/ajax",
            {
                get_global_locations: '1'
            },
    function (html) {
        $parentEl.html(html);
        if (typeof callback !== 'undefined') {
            callback($parentEl);
        }
    });
    $parentEl.on('click.locations', '.site', function () {
        dfd.resolve($(this).data('idGlobalLocation'));
        dfd.always($parentEl.off('.locations', '**'));
    });
    return dfd.promise();
};

