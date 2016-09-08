var modelDescription = function ($parentEl, type, modelName, callback) {
    var dfd = jQuery.Deferred();
    $.post(
            "/ajax",
            {
                get_model_descr: '1',
                model: modelName,
                type: type
            },
    function (html) {
        $parentEl.html(html);
        if ($parentEl.find('.section-content ').html().trim() === '') {
            $parentEl.empty()
        }
        if (typeof callback !== 'undefined') {
            callback($parentEl);
        }
        dfd.resolve();
    });
    return dfd.promise();
};