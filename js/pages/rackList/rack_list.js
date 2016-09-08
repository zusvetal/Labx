/******************************************************************************/
/***************************** Add rack **********************************/
/******************************************************************************/

$('#content').on('click.racks', 'span.add', function (event) {
    event.preventDefault();
    var modal = new Modal();
    var form = new RackForm();
    modal.getModal($('#modalField'))
            .then(function () {
                return form.getForm(modal.getBodyField());
            })
            .then(function () {
                modal.setTitle('Add new rack');
                modal.setWidth('25%');
                modal.show();
                return form.eventListener();
            })
            .then(function (idRack) {
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    location.reload();
                });
                modal.hide();
            });
});
/******************************************************************************/
/***************************** Delete rack **********************************/
/******************************************************************************/

$('table').on('click', '.remove', function () {
    var $tr = $(this).closest('tr'),
            idRack = $tr.data('idRack'),
            idBackRack = $tr.data('idBackRack'),
            check = new CheckingAssets(),
            notification = new DeleteNotification($('#modalField'));
    check.devicesInRack(idRack)
            .then(function (devices) {
                if (devices.length === 0) {
                    return $.confirm("Do you want to remove this rack?");
                }
                else {
                    notification.devicesInRack(devices);
                    return $.Deferred();
                }
            })
            .then(function () {
                deleteValue('rack', 'id_rack', idRack);
                deleteValue('rack', 'id_rack', idBackRack);
                return $tr.fadeOut('slow')
            })
            .then(function () {
                location.reload();
            })
});

