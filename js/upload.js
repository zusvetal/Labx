(function ($) {
    var defaults = {};
    var methods = {
        init: function (params) {
            return this;
        },
//upload file
        upload: function (path, callback) {
            var files;
            var el = this;
            $(this).change(function () {
                files = this.files;
                var data = new FormData();
                $.each(files, function (key, value) {
                    data.append(key, value);
                });
                $.ajax({
                    url: '/utils/upload_file.php?uploadfiles=1&path=' + path,
                    type: 'POST',
                    data: data,
                    cache: false,
                    dataType: 'json',
                    processData: false, // Don't process the files
                    contentType: false, //String  query
                    success: function (respond, textStatus, jqXHR) {
                        if (typeof respond.error === 'undefined') {
                            if (typeof callback !== 'undefined') {
                                callback(el, respond.files[0]);
                            }
                        }
                        else {
                            console.log('Response Error: ' + respond.error);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(' AJAX error: ' + textStatus + ',  ' + errorThrown);
                    }
                });
            });
            return this;
        },
        delete: function (callback) {
            var $img = $(this),
                    path = $img.attr('src');
            $.post(
                    "/utils/upload_file.php",
                    {
                        delete_file: '1',
                        path: path
                    },
            function (status) {
                if (status.trim() !== '0') {
                    $img.slideUp();
                    if(typeof callback !=='undefined'){
                        callback();
                    }
                }
                else {
                    console.log('Response Error: '+status);
                }
            });
            return this;
        },
        download: function () {
            return this;
        }
    };
    $.fn.fileManage = function (method) {
        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(
                    arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method "' + method + '"id not found into plugin ');
        }
    };
})(jQuery);

