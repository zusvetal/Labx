var getVMRow = function (idVirtualMashine) {
    return  $.post(
            "/ajax",
            {
                get_vm_tr: '1',
                id_virtual_mashine:  idVirtualMashine
            }
    );
};
var getHypervisorRow = function (idDevice) {
    return  $.get(
            '/get_hypervisor_tr',
            {
                id_device: idDevice
            }
    );
};
var updateVMRow=function($trVMOld){
    var idVirtualMashine=$trVMOld.data('idVirtualMashine');
    
    return getVMRow(idVirtualMashine)
            .then(function(trVMNew){
                $trVMOld.replaceWith(trVMNew);
                recountNumber($('td.number'))
    })
}
var updateHypervisorRow=function($trHypervisorOld){
    var idDevice=$trHypervisorOld.data('idDevice');
    
    return getHypervisorRow(idDevice)
            .then(function(trHypervisorNew){
                $trHypervisorOld.replaceWith(trHypervisorNew);
                recountNumber($('td.number'))
    })
}

/******************************************************************************/
/***************************** add  vm host **********************************/
/******************************************************************************/

$('#content').on('click.device', 'span.add-host', function (event) {
    event.preventDefault();
    var
            $deviceRow = $(this).closest('.hyp'),
            idInterface = $deviceRow.find('.ip-interface').data('idInterface'),
            modal = new Modal(),
            form = new VMForm(idInterface);
    modal.getModal($('#vmForm'))
            .then(function () {
                return form.getForm(modal.getBodyField());
            })
            .then(function () {
                modal.setTitle('Add new virtual host');
                modal.setWidth('30%');
                highlightRow($tr);
        
                /*action after closing modal window*/
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    updateHypervisorRow($tr);
                    highlightingRowRemove($tr);
                });
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
                highlightRow($tr);

                /*action after closing modal window*/
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    updateVMRow($tr);
                    highlightingRowRemove($tr);
                });
                
                modal.show();
                return form.eventListener();
            })
            .then(function (tr) {
                modal.hide();
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
/***************************** Add/update interfaces *********************************/
/******************************************************************************/
$('#content').on('click.device', '.update-hyp-ip', function () {
    console.log('update hyp ip')
    var $tr=$(this).closest('tr'),
    idDevice = $tr.data('idDevice'),
    modelName=$tr.find('td.model').text().trim(),
    modal = new Modal(),
    int = new interfaceForm(); 
    modal.getModal($('#editInterfaces'))
            .then(function () {
                highlightRow($tr);
        
                /*action after closing modal window*/
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    updateHypervisorRow($tr);
                    highlightingRowRemove($tr);
                });
                
                modal.setTitle('Add network interfaces for <b>' + modelName + '</b>');
                modal.setWidth('30%');
                modal.show();
                return int.getForm(modal.getBodyField(), idDevice);
            })
            .then(function (data) {
                return int.eventListener();
            })
            .then(function () {
                modal.hide();
            })
            
});
/******************************************************************************/
/***************************** initial settings *******************************/
/******************************************************************************/
