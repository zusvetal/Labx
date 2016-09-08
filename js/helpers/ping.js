var ping = function (ip, callback) {
    return $.post(
            "/utils/ping.php",
            {
                ip: ip
            },
    function (data) {
        if (typeof callback !== 'undefined') {
            callback(data);
        }
    },
            "json"
            );
};
