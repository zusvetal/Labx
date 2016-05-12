$('#content').off('.devices','**');
/******************************************************************************/
/***************************** add  device **********************************/
/******************************************************************************/
var getDeviceRow = function (idDevice) {
    return  $.post(
            "/ajax",
            {
                get_device_tr: '1',
                id_device: idDevice
            }
    );
};

$('#content').on('click.devices', 'span.add', function (event) {
    event.preventDefault();
    var modal = new Modal();
    var form = new Form('device');
    modal.getModal($('#addNewDeviceToStock'))
            .then(function () {
                return form.getForm(modal.getBodyField());
            })
            .then(function (idDevice) {
                modal.setTitle('Add new device to stock');
                modal.setWidth('30%');
                modal.show();
                return form.eventListener();
            })
            .then(function (idDevice) {
                console.log(idDevice);
                modal.hide();
                return getDeviceRow(idDevice);
            })
            .then(function (newDevice) {
               $('table tr.item:nth-of-type(1)').after(newDevice);
                recountNumber($('td.number'));
                highLightNewEntry($('table tr.item:nth-of-type(2)'));
            });          
});

/******************************************************************************/
/***************************** delete device **********************************/
/******************************************************************************/

var unbindDeviceFromModules = function (idDevice) {
    $.post(
            "/ajax",
            {
                unbind_modules: '1',
                id_device: idDevice

            },
    function (existBindModules) {
        if (existBindModules.trim() !== '0') {
            $('tr[data-id-device="' + idDevice + '"] + tr').slideUp().remove();
        }
    });
};


$('#content').on('click.devices', 'span.remove-device', function () {
    var $tr = $(this).closest('tr'),
            idDevice = $tr.data('idDevice'),
            idLocation = $tr.data('idLocation');
    $.confirm("Do you want to remove this device from database?")
            .then(function () {
                unbindDeviceFromModules(idDevice);
                switch (idLocation) {
                    /*rack*/
                    case 1:
                        deleteValue('devices_in_racks', 'id_device', idDevice);
                        break
                        /*labdesk*/
                    case 2:
                        deleteValue('devices_in_labdesks', 'id_device', idDevice);
                        break
                        /*on hand*/
                    case 3:
                        deleteValue('devices_on_hands', 'id_device', idDevice);
                        break
                }
                return deleteValue('device_list', 'id_device', idDevice)

            })
            .then(function (data) {
                $tr.fadeOut('slow', function () {
                    $tr.remove();
                    recountNumber($('td.number'));
                });
            });
});
/******************************************************************************/
/***************************** edit  device **********************************/
/******************************************************************************/

$('#content').on('click.devices', 'span.edit-device', function (event) {
    event.preventDefault();
    var $icon=$(this),
            modal = new Modal(),
            form = new Form('device'),
            $tr=$icon.closest('tr'),
            idDevice = $tr.data('idDevice');
    modal.getModal($('#addNewDeviceToStock'))
            .then(function () {
                /*Action after closing modal window*/
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    $tr.removeClass('info');
                });
                $tr.addClass('info');
                return form.getForm(modal.getBodyField(),{id:idDevice});
            })
            .then(function (idDevice) {
                modal.setTitle('Edit device');
                modal.setWidth('30%');
                modal.show();
                return form.eventListener();
            })
            .then(function () {
                return getDeviceRow(idDevice);
            })
            .then(function (tr) {
                $tr.replaceWith(tr)
//                highLightNewEntry();
                recountNumber($('td.number'));
                modal.hide();
            });
});


/******************************************************************************/
/***************************** show modules **********************************/
/******************************************************************************/
$('#content').on('click.devices', 'span.show-modules', function () {
    var $icon = $(this),
            $tr=$icon.closest('tr'),
            $modulesTr = $tr.find('+ tr.modules-list');
    if ($modulesTr.length > 0) {
        $modulesTr.fadeToggle('100');
        if ($icon.hasClass('glyphicon-chevron-down')) {
            $icon.removeClass('glyphicon-chevron-down')
                    .addClass('glyphicon-chevron-up');
            $tr.addClass('choose3');
        }
        else {
            $icon.removeClass('glyphicon-chevron-up')
                    .addClass('glyphicon-chevron-down')
            $tr.removeClass('choose3');
        }

    }
});
/******************************************************************************/
/************************* bind device with modules ********************/
/******************************************************************************/                                                                                             

var getModuleRow = function (idModule) {
    return $.post(
            "/ajax",
            {
                get_module_row: '1',
                id_module: idModule
            }
            );
};

/*Open modal window*/
$('#content').on('click.devices', 'span.add-module', function (event) {
    var $tr = $(this).closest('tr'),
            idDevice = $tr.data('idDevice'),
            modal = new Modal(),
            list = new FreeEquipList('module', idDevice),
            firstModule=$(this).hasClass('first')?true:false;
    event.preventDefault();
    modal.getModal($('#unusedModuleList'))
            .then(function () {
                modal.setWidth('50%');
                modal.setTitle('<b>Choose module/card, which you want to insert to device<b>');
                /*Action after closing modal window*/
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    $tr.removeClass('info');
                    if(firstModule){
                        document.location.reload();
                    }
                });
                return list.getList(modal.getBodyField());
            })
            .then(function () {
                $tr.addClass('info');
                modal.show();               
                return list.eventListener();
            })
            .then(function (idModule) {
                modal.hide();
                return getModuleRow(idModule)
            })
            .then(function (row) {
                $tr.find('table tbody')
                        .prepend(row);
                highLightNewEntry($tr.find('table tr:nth-of-type(1)'));
            })
});


/******************************************************************************/
/************************* unbind device with modules ********************/
/******************************************************************************/
var unbindDeviceFromModule = function (idModule) {
    updateValue('module_list', 'id_device', '0', 'id_module', idModule);

}

$('#content').on('click.devices', 'span.unbind', function () {
    var tr = $(this).closest('tr'),
            idModule = $(tr).data('idModule');
    $.confirm("Do you want to unbind this module?")
            .then(function () {
                    unbindDeviceFromModule(idModule);
                    $(tr).fadeOut('slow', function () {
                        $(this).remove();
                    });
            });
});
/******************************************************************************/
/***************************** Add/update interfaces *********************************/
/******************************************************************************/
$('#content').on('click.devices', '.update-ip', function () {
    var $tr=$(this).closest('tr'),
    idDevice = $tr.data('idDevice'),
    modelName=$tr.find('td.model').text().trim(),
    modal = new Modal(),
    int = new interfaceForm(); 
    modal.getModal($('#editInterfaces'))
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
/************************* device information ********************/
/******************************************************************************/

$('#content').on('click.devices', 'span.infoRack', function () {
    var modal = new Modal(),
            $tr = $(this).closest('tr'),
            idDeviceInRack = $(this).data('idDeviceInRack'),
            idDevice = $tr.data('idDevice'),
            modalName = $tr.find('td.model').text(),
            ip, slot, idRack, rackName;
    $tr.addClass('info');
    $('#content').on('hidden.bs.modal', modal.object, function () {
        $tr.removeClass('info');
    });
    modal.getModal($('#deviceInfo'), function () {
        ip = getValue('devices_in_racks', 'mng_ip', 'id_device_in_rack', idDeviceInRack);
        slot = getValue('devices_in_racks', 'unit', 'id_device_in_rack', idDeviceInRack);
        idRack = getValue('devices_in_racks', 'id_rack', 'id_device_in_rack', idDeviceInRack);
        rackName = getValue('rack', 'name', 'id_rack', idRack);
        modal.setTitle(modalName);
        modal.addBody('<div id="info" align="center">\
                            <p id="ipDevice" align="center"><b>' + ip + '</b></p>\
                            <p>Device insert into rack <b>' + rackName + '</b> slot <b>' + slot + '</b><p>\
                            <p><span id="showInRack" class="glyphicon">Show in rack</span></p>\
                        </div>');
        if (ip == '' || ip == '0.0.0.0' || ip == '0') {
            $('#ipDevice').html('<b>Device haven`t managment ip</b>');
        }

        modal.show();
    });
    $('#content').on('click.devices', '#showInRack', function () {
        modal.setWidth('60%');
        $.post(
                "/rack.php",
                {
                    get_rack: '1',
                    id_rack: idRack,
                    id_device_in_rack: idDeviceInRack
                },
        function (data) {
            modal.addBody(data);
            $('#panel').remove();
            $('#rackTable .status').addClass('hidden');
            $('#content').off('click.devices', '#showInRack');
        });
    });
});

/******************************************************************************/
/************************* get device i ******** ********************/
/******************************************************************************/

/*Open modal window and show device information*/
$('#content').on('click.devices', 'span.info-device', function () {
    var $tr=$(this).closest('tr'),
    idDevice = $(this).data('idDevice'),
    modelName=$tr.find('td.model').text();
    var modal = new Modal();
    modal.getModal($('#deviceInfo'))
            .then(function () {
                /***get device information body***/
                modal.setWidth('50%');
                modal.setTitle('<b>' + modelName + '</b>');
                modal.show();
                $tr.addClass('info');
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    $tr.removeClass('info');
                });
                modal.addBody('<div id="statusInfo"></div>\
                               <div id="deviceDescription"></div>\
                               <div id="modelDescription"></div>\
                               <div id="generalInfo"></div>\
                               <div id="deviceCards"></div>\
                               <div id="historyEvents"></div>\
                              ');
                return getMainInfo($('#deviceDescription'), 'device', idDevice);
            })
            .then(function () {
                return modelDescription($('#modelDescription'), 'device', modelName);
            })
            .then(function () {
                return historyEvents($('#historyEvents'), 'device', idDevice);
            })
            .then(function () {
                return netInterfaceInfo($('#statusInfo'), idDevice);
            })
            .then(function () {
                return generalDeviceInfoTable($('#generalInfo'), idDevice);
            })
            .then(function () {
                return deviceModuleTable($('#deviceCards'), idDevice);
            })
            .then(function (data) {
                console.log(data);
            });
    // $('#content').off('click.devices', 'span.info');
});
/******************************************************************************/
/**************************** transfer device  ********************************/
/******************************************************************************/
$('#content').on('click.devices', 'span.transfer', function () {
    var $tr = $(this).closest('tr'),
            idDevice = $tr.data('idDevice'),
            modelName = $tr.find('td.model').text(),
            modal = new Modal(),
            oldLocation,idNewLocation;
    modal.getModal($('#transferDevice'))
            .then(function () {
                modal.setWidth('30%');
                modal.setTitle('Transfer <b>' + modelName + '</b>');
                modal.show();
                $tr.addClass('info');
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    $tr.removeClass('info');
                });
                modal.addBody('<div id="head"></div>\
                                <div id="globalLocations"></div>\
                            ');
                infoMessage(modal.getBodyField().find('#head'),
                        '<center><b>Choose location, which will transfer device</b></center>'
                        );
                return  getGlobalLocations(modal.getBodyField().find('#globalLocations'));
            })
            .then(function (id) {
                idNewLocation=id;
                return updateValueList('device_list', {id_global_location:id, id_transfer_status:'1'}, 'id_device', idDevice);
            })
            .then(function () {
                return getValueAsync('global_location', 'name', 'id_global_location', getIdGlobalLocation());
            })
            .then(function (location) {
                oldLocation=location;
                return getValueAsync('global_location', 'name', 'id_global_location', idNewLocation);
            })
            .then(function (location) {
                addDeviceEvent(idDevice, 'Change global location from"' + oldLocation + '" to "' + location + '"');
                return $tr.fadeOut();
            })
            .then(function () {
                    modal.hide();
                    $tr.remove();
                    recountNumber($('td.number'));
            });
});


/******************************************************************************/
/**************************** popover virtual host  ***************************/
/******************************************************************************/


$('body').popover({
    selector:'.virt-host',
    title: 'Virtual hosts',
    content: '<div class="popover-content"></div>',
    trigger: 'click',
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
/******************************************************************************/
/***************************** Change device status  ***************************/
/******************************************************************************/
$('#content').on('click.devices', '.edit-trans', function (event) {
    var $tr = $(this).closest('tr'),
            idOld = $tr.data('idTransferStatus'),
            nameModel = $tr.find('.model').text(),
            idDevice=$tr.data('idDevice'),
            modal = new Modal(),
            oldStatus,idNew;
    event.preventDefault();
    modal.getModal($('#transferStatus'))
            .then(function () {
                /*Action after closing modal window*/
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    $tr.removeClass('');
                });
                $tr.addClass('');
                modal.setTitle('Choose transfer status for <b>' + nameModel + '</b>');
                modal.setWidth('30%');
                modal.show();
                return getValueAsync('transfer_status','transfer_status_name','id_transfer_status',idOld);
            })
            .then(function (status) {
                oldStatus=status
                return getTransferStatus(modal.getBodyField());
            })
            .then(function (id) {
                idNew=id;
                $tr.attr('data-id-transfer-status', id);
                return updateValue('device_list', 'id_transfer_status', id, 'id_device', idDevice);
            })
            .then(function () {
                hideTransferStatus();
                return getValueAsync('transfer_status', 'transfer_status_name', 'id_transfer_status', idNew );
            })
            .then(function (newStatus) {
                addDeviceEvent(idDevice, 'Change transfer status from  "' + oldStatus + '" to "' + newStatus+'"');
                showTransferStatus();
                modal.hide();
            });
});

$('#content').on('click.devices', '.edit-work', function (event) {
    var $tr = $(this).closest('tr'),
            idOld = $tr.data('idWorkStatus'),
            nameModel = $tr.find('.model').text(),
            idDevice = $tr.data('idDevice'),
            modal = new Modal(),
            oldStatus, idNew;
    event.preventDefault();
    modal.getModal($('#transferStatus'))
            .then(function () {
                /*Action after closing modal window*/
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    $tr.removeClass('');
                });
                $tr.addClass('');
                modal.setTitle('Choose working status for <b>' + nameModel + '</b>');
                modal.setWidth('30%');
                modal.show();
                return getValueAsync('work_status', 'work_status_name', 'id_work_status', idOld);
            })
            .then(function (status) {
                oldStatus=status;
                return getWorkStatus(modal.getBodyField());
            })
            .then(function (id) {
                idNew = id;
                $tr.attr('data-id-work-status', id);
                return updateValue('device_list', 'id_work_status', id, 'id_device', idDevice);
            })
            .then(function () {
                hideWorkStatus();
                return getValueAsync('work_status', 'work_status_name', 'id_work_status', idNew);
            })
            .then(function (newStatus) {
                showWorkStatus();
                addDeviceEvent(idDevice, 'Change status from "' + oldStatus + '" to "' + newStatus+'"');
                modal.hide();
            })
});
/******************************************************************************/
/******************************* Init settings ********************************/
/******************************************************************************/
