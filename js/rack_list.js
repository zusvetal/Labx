/******************************************************************************/
/***************************** Add rack **********************************/
/******************************************************************************/

$('#content').on('click.racks', 'span.add', function (event) {
    event.preventDefault();
    var modal = new Modal();
    var form = new RackForm();
    modal.getModal($('#addNewRack'))
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
            idBackRack = $tr.data('idBackRack');
    $.confirm("Do you want to remove this rack?")
            .then(function () {
                deleteValue('rack', 'id_rack', idRack);
                deleteValue('rack', 'id_rack', idBackRack);
                return $tr.fadeOut('slow')
            })
            .then(function () {
                location.reload();
            })
});


