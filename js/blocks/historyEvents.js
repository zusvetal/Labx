var addDeviceEvent = function (id, event) {
    return insertValueList('device_history', {event: event, id_device: id});
};
var addModuleEvent = function (id, event) {
    return insertValueList('module_history', {event: event, id_module: id});
};
var historyEvents = function ($parentEl, type, id, callback) {
    var dfd = jQuery.Deferred();
    $.get('/get_history',
            {type: type, id: id},
    function (html) {
        $parentEl.html(html);
        if (typeof callback !== 'undefined') {
            callback($parentEl);
        }
        dfd.resolve();
    });
    return dfd.promise();
};