
/******************************************************************************/
/***************************** add  vm host **********************************/
/******************************************************************************/
var getVMRow = function (idVirtualMashine) {
    return  $.post(
            "/ajax",
            {
                get_vm_tr: '1',
                id_virtual_mashine:  idVirtualMashine
            }
    );
};
$('#content').on('click.device', 'span.add-host', function (event) {
    event.preventDefault();
    var
            $deviceRow = $(this).closest('.hyp'),
            idInterface = $deviceRow.find('.virt-host').data('idInterface'),
            modal = new Modal(),
            form = new VMForm(idInterface);
    modal.getModal($('#vmForm'))
            .then(function () {
                return form.getForm(modal.getBodyField());
            })
            .then(function () {
                modal.setTitle('Add new virtual host');
                modal.setWidth('30%');
                modal.show();
                return form.eventListener();
            })
            .then(function (idVirtualMashine) {
                modal.hide();
                return getVMRow(idVirtualMashine);
            })
            .then(function (newVMRow) {
                modal.hide();
                $deviceRow.after(newVMRow);
                var $newVMRow = $deviceRow.next();
                highLightNewEntry($newVMRow);
            })

})
/******************************************************************************/
/***************************** edit vm host **********************************/
/******************************************************************************/

$('#content').on('click.device', 'span.edit-host', function (event) {
    event.preventDefault();
    var     $btn=$(this),
            $tr=$btn.closest('tr.vm'),
            idInterface=$btn.closest('tr.vm-list').data('idInterface'),
            idVirtualMashine=$btn.closest('tr.vm').data('idVirtualMashine'),
            modal = new Modal(),
            form = new VMForm(idInterface);
    modal.getModal($('#vmForm'))
            .then(function () {
                return form.getForm(modal.getBodyField(), {id_virtual_mashine: idVirtualMashine});
            })
            .then(function () {
                modal.setTitle('Add new virtual host');
                modal.setWidth('30%');
                modal.show();
                return form.eventListener();
            })
            .then(function (idVirtualMashine) {
                modal.hide();
                return getVMRow(idVirtualMashine);
            })
            .then(function (tr) {
                modal.hide();
                $tr.replaceWith(tr);
            })

})
/******************************************************************************/
/***************************** remove vm host **********************************/
/******************************************************************************/
$('#content').on('click.device', '.remove-host', function (e) {
    var $tr = $(this).closest('tr'),
            idVirtualMashine = $tr.data('idVirtualMashine');
    $.confirm("Do you want to remove this virtual host?")
            .then(function () {
                return  deleteValue('virtual_mashines', 'id_virtual_mashine', idVirtualMashine)
            })
            .then(function () {
                return $tr.fadeOut();
            })
            .then(function () {
                $tr.remove();
            });
});
/******************************************************************************/
/***************************** initial settings *******************************/
/******************************************************************************/
