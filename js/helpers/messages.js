var infoMessage = function ($parentEl, warningString, callback) {
    $parentEl.prepend('<div  class="alert alert-info">\
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
                    <span aria-hidden="true">&times;</span>\
                </button>\
                    ' + warningString + '\
            </div>');
    $parentEl.find('.alert').on('closed.bs.alert', function () {
        if (typeof callback !== 'undefined') {
            callback();
        }
    });
};
var successMessage = function ($parentEl, warningString, callback) {
    $parentEl.prepend('<div  class="alert alert-success">\
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
                    <span aria-hidden="true">&times;</span>\
                </button>\
                <strong>Well done!</strong> ' + warningString + '\
            </div>');
    $parentEl.find('.alert').on('closed.bs.alert', function () {
        if (typeof callback !== 'undefined') {
            callback();
        }
    });
};
var warnMessage = function ($parentEl, warningString, callback) {
    $parentEl.prepend('<div  class="alert alert-warning">\
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
                    <span aria-hidden="true">&times;</span>\
                </button>\
                <strong>Warning!</strong> ' + warningString + '\
            </div>');
    $parentEl.find('.alert').on('closed.bs.alert', function () {
        if (typeof callback !== 'undefined') {
            callback();
        }
    });
};
var dangerMessage = function ($parentEl, warningString, callback) {
    $parentEl.prepend('<div  class="alert alert-danger">\
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
                    <span aria-hidden="true">&times;</span>\
                </button>\
                <strong>Warning!</strong> ' + warningString + '\
            </div>');
    $parentEl.find('.alert').on('closed.bs.alert', function () {
        if (typeof callback !== 'undefined') {
            callback();
        }
    });
};

