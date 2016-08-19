$('#content').off('.devices','**');
var getDeviceRow = function (idDevice) {
    return  $.post(
            "/ajax",
            {
                get_device_tr: '1',
                id_device: idDevice
            }
    );
};
var updateDeviceRow = function ($tr) {
    var idDevice = $tr.data('idDevice');
    return getDeviceRow(idDevice)
            .then(function (tr) {
                $tr.replaceWith(tr)
                recountNumber($('td.number'));
            });

}
var highlightingRowRemove=function($tr){
    $tr.removeClass('info');
}
var highlightRow=function($tr){
    $tr.addClass('info');
}
/******************************************************************************/
/***************************** add  device **********************************/
/******************************************************************************/

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
                modal.hide();
                return getDeviceRow(idDevice);
            })
            .then(function (newDevice) {
               $('table tbody  tr.item:nth-of-type(1)').before(newDevice);
                recountNumber($('td.number'));
                highLightNewEntry($('table tbody tr.item:nth-of-type(1)'));
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
                    highlightingRowRemove($tr);
                });
                highlightRow($tr);
                return form.getForm(modal.getBodyField(),{id:idDevice});
            })
            .then(function (idDevice) {
                modal.setTitle('Edit device');
                modal.setWidth('30%');
                modal.show();
                return form.eventListener();
            })
            .then(function () {
                return updateDeviceRow($tr)
            })
            .then(function (tr) {
                modal.hide();
            });
});


/******************************************************************************/
/***************************** show modules **********************************/
/******************************************************************************/
$('#content').on('click.devices', 'span.show-modules', function () {
    var $icon = $(this),
            $tr=$icon.closest('tr'),
            $modulesTr = $tr.find('+tr.module');
    if ($modulesTr.length > 0) {
        if ($icon.hasClass('glyphicon-chevron-down')) {
            $icon.removeClass('glyphicon-chevron-down')
                    .addClass('glyphicon-chevron-up');
            $tr.addClass('choose3');
            while ($modulesTr.length > 0) {
                $modulesTr.fadeIn('100');
                $modulesTr = $modulesTr.find('+tr.module');
            }
        }
        else {
            $icon.removeClass('glyphicon-chevron-up')
                    .addClass('glyphicon-chevron-down');
            $tr.removeClass('choose3');
            while ($modulesTr.length > 0) {
                $modulesTr.fadeOut('100');
                $modulesTr = $modulesTr.find('+tr.module');
            }
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
$('#content').on('click.devices', 'span.insert-module', function (event) {
    var $tr = $(this).closest('tr'),
            idDevice = $tr.data('idDevice'),
            modal = new Modal(),
            list = new FreeEquipList('module', idDevice);
    event.preventDefault();
    modal.getModal($('#unusedModuleList'))
            .then(function () {
                modal.setWidth('50%');
                modal.setTitle('<b>Choose module/card, which you want to insert to device<b>');
                
                /*Action after closing modal window*/
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    highlightingRowRemove($tr);
                });
                return list.getList(modal.getBodyField());
            })
            .then(function () {
                highlightRow($tr);
                modal.show();               
                return list.eventListener();
            })
            .then(function (idModule) {
                modal.hide();
                getDeviceInfo(idDevice).then(function(d){addModuleEvent(idModule,'Bind with device <b>'+d['model']+', sn - '+d['sn']+'</b> manually')})
                return getModuleRow(idModule);
            })
            .then(function (row) {
                $tr.after(row);
                $tr.find('+tr.module').show();
                highLightNewEntry($tr.find('+tr.module'));
            });
});


/******************************************************************************/
/************************* unbind device with modules ********************/
/******************************************************************************/
var unbindDeviceFromModule = function (idModule) {
    updateValue('module_list', 'id_device', '0', 'id_module', idModule);
};

$('#content').on('click.devices', 'span.unbind', function () {
    var $tr = $(this).closest('tr'),
            $deviceTr = $tr.prevAll('.item').eq(0),
            idModule = $tr.data('idModule');
    $.confirm("Do you want to unbind this module?")
            .then(function () {
                unbindDeviceFromModule(idModule);
                return  $tr.fadeOut('slow');
            })
            .then(function () {
                $(this).remove();
                if ($deviceTr.find('+tr.module').length < 1) {
                    $deviceTr.removeClass('choose3');
                    $deviceTr.find('.show-modules').remove();
                }
                addModuleEvent(idModule,'Change status to "free" manually');
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
                highlightRow($tr);
        
                /*action after closing modal window*/
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    updateDeviceRow($tr);
                    $highlightingDeviceRowRemove($tr);
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
/************************* device information ********************/
/******************************************************************************/

$('#content').on('click.devices', 'span.infoRack', function () {
    var modal = new Modal(),
            $tr = $(this).closest('tr'),
            idDeviceInRack = $(this).data('idDeviceInRack'),
            idDevice = $tr.data('idDevice'),
            modalName = $tr.find('td.model').text(),
            ip, slot, idRack, rackName;
    highlightRow($tr);
    $('#content').on('hidden.bs.modal', modal.object, function () {
        highlightingRowRemove($tr);
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
    var $tr = $(this).closest('tr'),
            idDevice = $(this).data('idDevice'),
            modelName = $tr.find('td.model').text();
    var modal = new Modal();

    modal.getModal($('#deviceInfo'))
            .then(function () {
                /***get device information body***/
                modal.setWidth('50%');
                modal.show();
                modal.addBody('<div id="statusInfo"></div>\
                               <div id="mainInfo"></div>\
                               <div id="deviceDescription"></div>\
                               <div id="modelDescription"></div>\
                               <div id="generalInfo"></div>\
                               <div id="deviceCards"></div>\
                               <div id="historyEvents"></div>\
                              ')
                highlightRow($tr);
                
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    highlightingRowRemove($tr);
                });
                return getMainInfo($('#mainInfo'), 'device', idDevice);
            })
            .then(function () {
                return deviceDescription($('#deviceDescription'), 'device', idDevice);
            })
            .then(function () {
                return modelDescription($('#modelDescription'), 'device', modelName);
            })
            .then(function () {
                return netInterfaceInfo($('#statusInfo'), idDevice);
            })
            .then(function () {
                return historyEvents($('#historyEvents'), 'device', idDevice);
            })
            .then(function () {
                return generalDeviceInfoTable($('#generalInfo'), idDevice);
            })
            .then(function (data) {
                return deviceModuleTable($('#deviceCards'), idDevice);
            });
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
                highlightRow($tr);
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    highlightingRowRemove($tr);
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
/***************************** Show full location  ***************************/
/******************************************************************************/
$('#content').on('click.devices', '.show-location span', function () {
    var $icon = $(this),
            $table = $icon.closest('table');
    if ($icon.hasClass('glyphicon-resize-small')) {
        $icon.removeClass('glyphicon-resize-small')
                .addClass('glyphicon-resize-full');
        $table.find('.place .short').hide();
        $table.find('.place .full').show();
        
    }
    else {
        $icon.removeClass('glyphicon-resize-full')
                .addClass('glyphicon-resize-small');
        $table.find('.place .full').hide();
        $table.find('.place .short').show();
    }
});
/******************************************************************************/
/******************************* Init settings ********************************/
/******************************************************************************/
//$(document).ready(function() 
//    { 
//        $('#infoField table').tablesorter(); 
//    } 
//); 