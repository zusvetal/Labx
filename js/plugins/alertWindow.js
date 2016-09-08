/******************************************************************************/
/*************************  Alert modal window *****************************/
/******************************************************************************/
jQuery.alert = function (dialog, callback) {
    var deferred = jQuery.Deferred();
    var box = '<div id="alertWindow" class="modal static"  data-backdrop="static" tabindex="-1" role="dialog">\
                <div class="modal-dialog info">\
                    <div class="modal-content">\
                        <div class="modal-header">\
                            <span class="glyphicon glyphicon-alert"></span>\
                        </div>\
                        <div class="modal-body"> </div>\
                        <div class="modal-footer">\
                            <button type="button" class="btn btn-primary ok"  data-dismiss="modal">Ok</button>\
                        </div>\
                    </div>\
                </div>\
            </div>'
    $('body').append(box);
    $('#alertWindow .modal-body').html(dialog.replace(/\n/, "<br />"));
    $('#alertWindow.modal').modal();
    $('#alertWindow .ok').off('click');
    $('#alertWindow .ok').on('click', function () {
        $('#alertWindow').off('hidden.bs.modal');
        $('#alertWindow').on('hidden.bs.modal', function (e) {
            if (typeof callback !== 'undefined') {
                callback(true);
            }
            /*if exist open modal window - scroll to this window*/
            deferred.resolve();
            $('#alertWindow').remove();
        });
        $(this).modal('hide');
    });
    return  deferred.promise();
};

