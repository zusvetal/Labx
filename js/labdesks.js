var getAddingForm = function (modal,idDeviceInLabdesk, options) {
    var form = new Form('device'),
            idDevice;
    form.getForm($('#newDevice'), options)
            .then(function () {
                $('#modalWindow').animate({
                    scrollTop: $('#addForm').offset().top
                }, 1000);
                return form.eventListener();
            })
            .then(function (id) {
                idDevice = id;
                return updateValue('devices_in_labdesks', 'id_device', idDevice, 'id_device_in_labdesk', idDeviceInLabdesk);
            })
            .then(function () {
                return updateValue('device_list', 'id_location', '2', 'id_device', idDevice);
            })
            .then(function () {
                /*add/update network interfaces*/
                modal.setTitle('Add network interfaces for device');
                return interfaceForm(modal.getBodyField(), idDevice);
            })
            .then(function () {
                modal.hide();
            });
}
/******************************************************************************/
/***************************** add  device **********************************/
/******************************************************************************/

$('#content').on('click', 'span.add', function (event) {
    var idLabdesk = $(this).closest('div.labdesk').data('idLabdesk'),
            labdeskDevice, idDeviceInLabdesk, idDevice, modelName,
            labdeskDevice = new LabdeskForm(),
            modal = new Modal(),
            freeList = new FreeEquipList('device', '2');
    event.preventDefault();
    modal.getModal($('#addNewDeviceToLabdesk'))
            .then(function () {
                modal.setTitle('Add device into labdesk');
                modal.show();
                return labdeskDevice.getForm(modal.getBodyField(), idLabdesk);
            })
            .then(function (id) {
                modelName = labdeskDevice.modelName();
                idDeviceInLabdesk = id;
                modal.setTitle('Bind with avaliable device');
                modal.setWidth('40%');
                modal.addBody('<div id="freeDevice"></div>\
                               <div align="center">\
                                    <span id="addToStock" class="glyphicon glyphicon-plus"></span>\
                                </div>\
                                <div id="newDevice"></div>');
                /*Add device to table*/
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    location.reload();
                });
                return freeList.getList($('#freeDevice'), modelName);
            })
            .then(function () {

                $('#addToStock').on('click', function () {
                    $('#addToStock').off('click');
                    getAddingForm(modal, idDeviceInLabdesk, {model: modelName});
                });
                return freeList.eventListener();
            })
            .then(function (id) {
                idDevice = id
                return  updateValue('devices_in_labdesks', 'id_device', idDevice, 'id_device_in_labdesk', idDeviceInLabdesk);
            })
            .then(function () {
                modal.setTitle('Add network interfaces for device');
                return interfaceForm(modal.getBodyField(), idDevice);
            })
            .then(function () {
                modal.hide();
            });
});
/******************************************************************************/
/***************************** delete device **********************************/
/******************************************************************************/

$('#content').on('click', 'span.remove', function () {
    var $tr = $(this).closest('tr'),
            $labdesk = $(this).closest('.labdesk'),
            idDeviceInLabdesk = $tr.data('idDeviceInLabdesk'),
            idDevice = $tr.data('idDevice');

    $.confirm("Do you want to remove this entry?")
            .then(function () {
                deleteValue('interfaces', 'id_device', idDevice);
                deleteValue('devices_in_labdesks', 'id_device_in_labdesk', idDeviceInLabdesk);
                updateValue('device_list', 'id_location', '4', 'id_device', idDevice);
                $tr.fadeOut('slow', function () {
                    $tr.remove();
                    recountNumber($labdesk.find('td.number'));
                });
            });
});

/******************************************************************************/
/***************************** bind device ****** *****************************/
/******************************************************************************/

$('#content').on('click', 'span.warning', function (event) {
    var $device = $(this).closest('.labdesk-device'),
            modelName = $device.find('[data-item="model"]').text().trim(),
            idDeviceInLabdesk = $(this).attr('data-id-device-in-labdesk'),
            idLabdesk = $(this).closest('.labdesk').data('idLabdesk'),
            idDevice, idInterface,
            modal = new Modal(),
            freeList = new FreeEquipList('device', '2'),
            bodyField = '\<center id="statusPing"></center>\
                        <div id="freeDevice"></div>\
                        <center id="remoteCheck"></center>\
                        <center>\
                            <span id="addToStock" class="glyphicon glyphicon-plus medium" title="add manually"></span>\
                        </center>\
                        <div id="newDevice"></div>';
    event.preventDefault();
    $device.addClass('info');
    modal.getModal($('#unusedDeviceList'))
            .then(function () {
                modal.setTitle('Bind device ' + modelName);
                modal.show();
                modal.addBody(bodyField);
                /*Action after closing modal window*/
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    location.reload();
                });
                return freeList.getList($('#freeDevice'), modelName);
            })
            .then(function () {
                
                $('#addToStock').on('click', function () {
                    $('#addToStock').off('click');
                    getAddingForm(modal,idDeviceInLabdesk , {model: modelName});
                });
                return freeList.eventListener();
            })
            .then(function (id) {
                idDevice = id;
                idInterface = insertValueList('interfaces', {id_device: idDevice});
                return  updateValue('devices_in_labdesks', 'id_device', idDevice, 'id_device_in_labdesk', idDeviceInLabdesk );
            })
            .then(function () {
                modal.setTitle('Add network interfaces for device');
                return interfaceForm(modal.getBodyField(), idDevice);
            })
            .then(function (ip) {
                modal.hide();
            });
});
/******************************************************************************/
/***************************** device information **********************************/
/******************************************************************************/
$('#content').on('click', 'span.info', function () {
    var idDevice = $(this).data('idDevice'),
    $tr=$(this).closest('tr'),
    modal = new Modal(),
    numOfInterface;
    
    modal.getModal($('#deviceInformation'))
            .then(function () {
                /***get device information body***/
                modal.setWidth('50%');
                modal.show();
                $tr.addClass('info');
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    $tr.removeClass('info');
                });
                return getMainInfo(modal.getBodyField(),'device', idDevice);
            })
            .then(function ($body) {
                var $intField;
                $body.append('<div id="intInfo"></div>')
                        .append('<div id="generalInfo"></div>')
                        .append('<div id="deviceCards"></div>')
                        .prepend('<div id="statusInfo"></div>');
                getInterfaceList(idDevice)
                        .then(function (interfaces) {
                            numOfInterface = Object.keys(interfaces).length;
                            $intField = numOfInterface > 1 ?
                                    $('#intInfo')
                                    :
                                    $('#statusInfo');
//                            if(numOfInterface>1){
//                                modal.setWidth('60%'); 
//                            }
                            netInterfaceInfo($intField, idDevice);
                        });
                return generalDeviceInfoTable($('#generalInfo'), idDevice);
            })
            .then(function ($body) {
                return deviceModuleTable($('#deviceCards'), idDevice);
            })
            .then(function (table) {
                console.log(this);
            }
            /*,
                    function (status) {
                        alert(status);
                    }*/
            );
});
/******************************************************************************/
/***************************** Add/update interfaces *********************************/
/******************************************************************************/
$('#content').on('click', '.update-ip', function () {
    var $tr=$(this).closest('tr'),
    idDevice = $tr.data('idDevice'),
    modelName=$tr.find('td.model').text().trim(),
    modal = new Modal(),
    int = new interfaceForm(); 
    modal.getModal($('#deviceInformation'))
            .then(function () {
                $tr.addClass('info');
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    location.reload();
                });
                modal.setTitle('Add network interfaces for <b>' + modelName + '</b>');
                modal.setWidth('30%');
                modal.show();
                return int.getForm(modal.getBodyField(), idDevice);
            })
            .then(function (data) {
                return int.eventListener();
            })
            .then(function (data) {
                modal.hide();
            })
            
});

/******************************************************************************/
/**************************** popover virtual host  ***************************/
/******************************************************************************/


$('body').popover({
    selector:'.virt-host',
    title: 'Virtual hosts',
    content: '<div class="popover-content"></div>',
    trigger: 'hover',
    container:'body',
    placement: 'bottom',
    html:true
});
$('.virt-host').on('shown.bs.popover', function (e) {
    var $popover = $('.popover-content'),
            idInterface = $(this).data('idInterface');
    console.log($popover,idInterface)
    getVirtualHosts($popover, idInterface);

});


