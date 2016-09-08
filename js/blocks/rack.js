var getRack = function ($parentEl, idRack, callback) {
    var dfd =$.Deferred();
    $.post(
            "/rack.php",
            {
                get_rack: '1',
                id_rack: idRack
            },
    function (rackHtml) {
        $parentEl.html(rackHtml);
        if (typeof callback !== 'undefined') {
            callback($parentEl);
        }
        dfd.resolve($parentEl);
    });
    return dfd.promise();
};
var showDeviceInRack = function ($parentEl, idDevice) {
    var dfd = jQuery.Deferred();
    getValues('devices_in_racks', 'id_device', idDevice)
            .then(function (device) {
                if (device) {
                    return $.post('/rack.php',
                            {get_rack: '1', id_rack: device.id_rack, id_device_in_rack: device.id_device_in_rack});
                }
                $parentEl.html('<b>Device is not in the rack</b>')
                dfd.resolve($parentEl);
            })
            .then(function (rackHtml) {
                $parentEl.html(rackHtml)
                dfd.resolve($parentEl);
            })
    return dfd.promise();
}