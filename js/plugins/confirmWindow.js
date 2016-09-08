/******************************************************************************/
/*************************  Confirm modal window *****************************/
/******************************************************************************/

jQuery.altConfirm = function () {
    var box = '<div id="confirmWindow" class="modal static" id="confirm" data-backdrop="static" tabindex="-1" role="dialog">';
    box += '<div class="modal-dialog info">';
    box += '<div class="modal-content">';
    box += '<div class="modal-body"> </div>';
    box += '<div class="modal-footer">';
    box += '<button type="button" class="btn btn-danger no" data-dismiss="modal">No</button>';
    box += '<button type="button" class="btn btn-primary ok"  data-dismiss="modal">Ok</button>';
    box += '</div>';
    box += '</div>';
    box += '</div>';
    box += '</div>';
    $("body").append(box);

    jQuery.confirm = function (dialog, callback) {
        var deferred = jQuery.Deferred();
        $('#confirmWindow .modal-body').html(dialog.replace(/\n/, "<br />"));
        $('#confirmWindow.modal').modal();
        $('#confirmWindow .no').on('click', function () {
            $('#confirmWindow').off('hidden.bs.modal')
            $('#confirmWindow').on('hidden.bs.modal', function (e) {
                console.log('reject')
                if (typeof callback !== 'undefined') {
                    callback(false);
                }
                deferred.reject();
            })
            $(this).modal('hide');

        });
        $('#confirmWindow .ok').off('click');
        $('#confirmWindow .ok').on('click', function () {
            $('#confirmWindow').off('hidden.bs.modal')
            $('#confirmWindow').on('hidden.bs.modal', function (e) {
                console.log('resolve')
                if (typeof callback !== 'undefined') {
                    callback(true);
                }
                deferred.resolve();
            })
            $(this).modal('hide');

        });
        return  deferred.promise();
    };
};

$(document).ready(function () {
    $.altConfirm();
});