var getLeftRackMenu = function ($parentEl, callback) {
    return $parentEl.load(
            "/html/sections/rack_left_menu.html",
            function (data) {
                if (typeof callback !== 'undefined') {
                    callback(data);
                }
            });
};

