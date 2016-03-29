$('#content').on('click.device', '.remove-host', function (e) {
    var $tr = $(this).closest('tr'),
            idVirtualMashine = $tr.data('idVirtualMashine');
     deleteValue('virtual_mashines','id_virtual_mashine',idVirtualMashine)
             .then(function(){
                 $tr.fadeOut(function(){$(this).remove()});
     });
});

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
            idInterface=$(this).closest('tr.hyp').find('+tr.vm-list').data('idInterface'),
            $vmTable=$(this).closest('tr.hyp').find('+tr.vm-list table'),
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
            .then(function (newVM) {
                modal.hide();
                if ($vmTable.find('tbody').length != '1') {
                    $vmTable.html('<tbody></tbody>');
                }
                    $vmTable.find('tbody').prepend(newVM)
                highLightNewEntry($vmTable.find('tr.vm:nth-of-type(1)'));
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