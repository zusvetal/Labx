var id_rack = $('#rackTable').data('idRack');
var list = new List('device_model', 'id_model', 'model');


/******************************************************************************/
/*************************** left menu  *************************************/
/******************************************************************************/
$('#content').on('click', 'span.edit', function () {
    $('.tools').toggleClass('hidden');
});
$('#content').on('click', 'span.book', function () {
    $('.booking').toggleClass('hidden');
});

/******************************************************************************/
/*************************** update item  *************************************/
/******************************************************************************/


$('#content').on('dblclick', '.value', function () {
    var $td = $(this);
    var value = $td.text();
 if ($td.closest('tr').data('idDevice') !== 0) {
    }
    else {
        $td.html('<input class="input-value form-control" type="text">').find('input').val(value);
    }
});
$('#content ').on('keypress', 'input.input-value', function (event) {
    var key = event.which,
            targetEl = event.target,
            input = $(this),
            idModel,
            checkingIdModel;
    if (key === 13) {   /*press Enter*/
        var idDeviceInRack = $(input).closest('tr').attr('data-id-device-in-rack');
        var value = $(input).val();
        var item = $(input).closest('td').attr('data-item');
        if (item === 'mng_ip') {
            if (!checkFreeIp(value)) {
                alert('This ip is already used');
                $(input).closest('td').text(value);
                return false;
            }
        }
        updateValue('devices_in_racks', item, value, 'id_device_in_rack', idDeviceInRack)
        $(input).closest('td').text(value);
    }
});
/******************************************************************************/
/********************* update ip interface of rack and tower devices  *********/
/******************************************************************************/

$('#content').on('click', 'span.update-ip', function () {
    var $icon = $(this),
            $tr = $icon.closest('tr'),
            modelName = $tr.find('td.model').text().trim(),
            modal = new Modal(),
            int = new interfaceForm(),
            $rackBody = $icon.closest('.rack-body'),
            idRack = $rackBody.find('#rackTable').data('idRack'),
            idDevice = $icon.hasClass('edit-tower') ?
                $icon.closest('div.tower').data('idDevice') :
                $tr.data('idDevice'),
            idDeviceInRack = $icon.hasClass('edit-tower') ?
                $icon.closest('div.tower').data('idDeviceInRack') :
                $tr.data('idDeviceInRack');
    modal.getModal($('#updateIpInterface'))
            .then(function () {
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    getRack($rackBody, idRack);
                });
                modal.setTitle('Add network interfaces for <b>' + modelName + '</b>');
                modal.setWidth('30%');
                modal.show();
                return int.getForm(modal.getBodyField(), idDevice);
            })
            .then(function (data) {
                return int.eventListener();
            })
            .then(function (ip) {
                return  updateValue('devices_in_racks', 'mng_ip', ip, 'id_device_in_rack', idDeviceInRack);
            })
            .then(function (data) {
                modal.hide();
            });           
});


/******************************************************************************/
/************************* add/update links *********************************/
/******************************************************************************/
var updateLink = function (linkName, idPort, idModule, idDeviceInRack) {
    $.post(
            "/ajax",
            {
                update_link: '1',
                link: linkName,
                id_port: idPort,
                id_module: idModule,
                id_device_in_rack: idDeviceInRack

            },
    function (data) {
    });
}
$('#content').on('dblclick', 'td.link', function () {
    var link = $(this),
            linkName = $(link).text().trim();
    $(link).html('<input class="input-link form-control" type="text">').find('input').val(linkName);
});

$('#content ').on('keypress', 'input.input-link', function (event) {
    var key = event.which,
            targetEl = event.target,
            input = $(this),
            linkName = $(input).val().trim(),
            link = $(input).closest("td"),
            idPort = $(link).data("idPort"),
            idModule = $(link).data("idModule"),
            idDeviceInRack = $(link).closest('tr.unit').data('idDeviceInRack');
    if (key === 13) {   /*press Enter*/
        updateLink(linkName, idPort, idModule, idDeviceInRack);
        $(link).text(linkName);

    }
});


/******************************************************************************/
/************************ Insert device to unit/slot **************************/
/******************************************************************************/
/*Tower device*/
$('#content').on('click', 'span.add-tower', function () {
    var $button = $(this),
            topSlot = $button.closest('tr').find('.number-of-unit').text().trim(),
            $rackBody = $button.closest('.rack-body'),
            idRack = $rackBody.find('#rackTable').data('idRack'),
            insertForm = new insertDeviceIntoRack(idRack, topSlot),
            modal = new Modal();
    modal.getModal($('#addDeviceForm'))
            .then(function () {
                $('#content').on('hidden.bs.modal', '#modalWindow', function () {
                    getRack($rackBody, idRack);
                });
                modal.setTitle('Add device with tower form factor');
                modal.show();
                return insertForm.getForm(modal.getBodyField());
            })
            .then(function ($form) {
                $form.find('select')
                        .val('2')
                        .attr('disabled', 'disabled');
                return insertForm.eventListener();
            })
            .then(function () {
                modal.hide();
            });
});
/*Rack device*/
$('#content').on('click', 'span.add-device', function () {
    var $button = $(this),
            topSlot = $button.closest('tr').find('.number-of-unit').text().trim(),
            $rackBody = $button.closest('.rack-body'),
            idRack = $rackBody.find('#rackTable').data('idRack'),
            modal = new Modal(),
            insertForm = new insertDeviceIntoRack(idRack, topSlot),
            elementNavigation = '\
                <center>\
                    <div id="elementNavigation" class=" btn-group">\
                        <button id="insertOverBarcode" type="button" class="btn btn-primary">Over barcode</button>\
                        <button id="insertOverSn" type="button" class="btn btn-primary">Over S/N</button>\
                        <button id="insertDevice" type="button" class="btn btn-primary">Device</button>\
                        <button id="insertPatchPanel" type="button" class="btn btn-primary">Patch panel</button>\
                        <button id="insertShelf" type="button" class="btn btn-primary">Shelf</button>\
                    </div>\
                </center>';
    modal.getModal($('#addDeviceForm'))
            .then(function () {
                $('#content').on('hidden.bs.modal', '#modalWindow', function () {
                    getRack($rackBody, idRack);
                });
                $('#content').on('shown.bs.modal', '#modalWindow', function () {
                    $('#insertOverBarcode').focus(); 
                });
                    modal.setTitle('Choose element you want to insert into the rack slot <b>' + topSlot + '</b>');               
                    modal.addBody(elementNavigation);
                $('#content').on('click', '#elementNavigation button', function () {
                    switch ($(this).attr('id')) {
                        case 'insertDevice':
                            modal.setTitle('Enter the device settings slot <b>' + topSlot + '</b>');
                            insertForm.getForm(modal.getBodyField())
                                    .then(function ($form) {
                                        return insertForm.eventListener();
                                    })
                                    .then(function (idDeviceInRack) {
                                        modal.hide();
                                    });
                            break
                        case 'insertPatchPanel':
                            modal.setTitle('Choose patch Panel for slot  <b>' + topSlot + '</b>');
                            patchPanelForm(modal.getBodyField(), idRack, topSlot, function () {
                                modal.hide();
                            });
                            break
                        case 'insertShelf':
                            var idShelf = insertValue('shelves', 'id_rack', idRack);
                            updateValue('shelves', 'unit', topSlot, 'id_shelf', idShelf)
                                    .then(function () {
                                        modal.hide();
                                    });
                            break
                        case 'insertOverBarcode':
                            var barcode = new ParametrForm(idRack, topSlot, 'barcode');
                            barcode.getForm(modal.getBodyField())
                                    .then(function () {
                                        return barcode.eventListener();
                                    })
                                    .then(function () {
                                        modal.hide();
                                    })
                            break;
                        case 'insertOverSn':
                            var sn = new ParametrForm(idRack, topSlot, 'sn');
                            sn.getForm(modal.getBodyField())
                                    .then(function () {
                                        return sn.eventListener();
                                    })
                                    .then(function () {
                                        modal.hide();
                                    })
                            break;
                            
                    }
                    $('#content').off('click', '#elementNavigation button');
                });
                modal.show();
                
            });
});

/******************************************************************************/
/******************* Remove device from unit **********************************/
/******************************************************************************/

var moveToStorage = function (idDevice,idRack,slot) {
    var rackName=getValue('rack','name','id_rack',idRack),
            rackLocation="Rack "+rackName+" slot "+slot;
    addDeviceEvent(idDevice, 'Move device from "'+rackLocation+'" to "Storage"');
    return updateValue('device_list', 'id_location', '4', 'id_device', idDevice);
};

$('#content').on('click', '.del-device', function () {
    var $btn = $(this),
            $unit = $btn.closest('.unit'),
            idDeviceInRack, idPatchPanel, idShelf, idDevice,
            topSlot = $unit.attr('data-slot'),
            sizeUnits = $unit.attr('data-size'),
            $rackBody = $btn.closest('.rack-body'),
            idRack = $rackBody.find('#rackTable').data('idRack');
    switch ($btn.attr('data-type')) {
    case 'device':
            $.confirm("Do yo really want to remove device from rack?")
                    .then(function () {
                        idDevice = $unit.attr('data-id-device');
                        idDeviceInRack = $unit.attr('data-id-device-in-rack');
                        return deleteValue('devices_in_racks', 'id_device_in_rack', idDeviceInRack);
                    })
                    .then(function () {
                        return moveToStorage(idDevice,idRack,topSlot);
                    })
                    .then(function () {
                        getRack($rackBody, idRack);
                    });

            break
        case 'patchpanel':
            $.confirm("Do yo really want to remove patchpanel from rack?")
                    .then(function () {
                        idPatchPanel = $unit.attr('data-id-patchpanel');
                        return deleteValue('patchpanel_list', 'id_patchpanel', idPatchPanel);
                    })
                    .then(function () {
                        getRack($rackBody, idRack);
                    });
            break
        case 'shelf':
            $.confirm("Do yo really want to remove shelf from rack?")
                    .then(function () {
                        idShelf = $unit.attr('data-id-shelf');
                        return deleteValue('shelves', 'id_shelf', idShelf);
                    })
                    .then(function () {
                        getRack($rackBody, idRack);
                    });
            break
        case 'tower':
            $.confirm("Do yo really want to remove PC from rack?")
                    .then(function () {
                        idDevice = $btn.closest('.tower').attr('data-id-device');
                        idDeviceInRack = $btn.closest('.tower').attr('data-id-device-in-rack');
                        return deleteValue('devices_in_racks', 'id_device_in_rack', idDeviceInRack);
                    })
                    .then(function () {
                        return moveToStorage(idDevice,idRack,topSlot);
                    })
                    .then(function () {
                        getRack($rackBody, idRack);
                    });
            break
    }
});

/******************************************************************************/
/*************************    alert  ******************************************/
/*****************************************************************************/
$('#alert').on('closed.bs.alert', function () {
    $('button.add-device').show();
});


/******************************************************************************/
/************************* bind rack list with device list ********************/
/******************************************************************************/
var getAddingForm = function (modal,idDeviceInRack, ip, options) {
    var form = new Form('device'),
            slot=getValue('devices_in_racks','unit','id_device_in_rack',idDeviceInRack),
            rackName=getValue('rack','name','id_rack',getValue('devices_in_racks','unit','id_device_in_rack',idDeviceInRack)),
            rackLocation="Rack "+rackName+" slot "+slot,
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
                return updateValue('devices_in_racks', 'id_device', idDevice, 'id_device_in_rack', idDeviceInRack);
            })
            .then(function () {
                addDeviceEvent(idDevice, 'Move device to "'+rackLocation+'"');
                return updateValue('device_list', 'id_location', '1', 'id_device', idDevice);
            })
            .then(function () {
                /*add/update network interfaces*/
                modal.setTitle('Add network interfaces for device');
                /*mng_ip add to interfaces*/
                insertValueList('interfaces', {ip: ip, id_device: idDevice});
                return interfaceForm(modal.getBodyField(), idDevice);
            })
            .then(function () {
                modal.hide();
            });
}
var getInfoFromDevice = function (idDeviceInRack,ip, modelName, info, modal, freeList) {
    if (ip !== '' && ip != '0.0.0.0') {
        ping(ip)
                .then(function (ping) {
                    if (ping) {
                        $('#statusPing').html('<div class="positive medium">device available</div>\
                                                <div><a href="http://' + ip + '" target="_blank">' + ip + '</a><div>');
                        if (info.abilityGettingInfo) {
                            $('#remoteCheck').html('<button class="btn a-btn btn-l">Check SN</button>')
                        }
                    }
                    else {
                        $('#statusPing').html('<div class="negative big">device not available</div>');
                    }
                })
        $('#remoteCheck').on('click', 'button', function () {
            var sn = info.sn();
            $('#remoteCheck').off('click');
            if ($('#freeDevice').find('table').length) {
                freeList.chooseElement(sn);
            }
            else {
                getAddingForm(modal,idDeviceInRack, ip,{model: modelName, sn: sn});
            }
        });
    }
    else {
        //   $('#statusPing').html('<div class="positive medium">ip from device is not defined</div>'); 
    }
}
$('#content').on('click', 'span.warning', function (event) {
    var $device = $(this).closest('.device'),
            modelName = $device.find('[data-item="model"]').text().trim(), 
            ip = $device.find('[data-item="mng_ip"]').text().trim(),
            idDeviceInRack = $(this).attr('data-id-device-in-rack'),
            $rackBody = $(this).closest('.rack-body'),
            idRack = $rackBody.find('#rackTable').data('idRack'),
            topSlot = $device.attr('data-slot'),
            rackName=getValue('rack','name','id_rack',idRack),
            rackLocation="Rack "+rackName+" slot "+topSlot,
            idDevice, idInterface,
            info = new GettingInfoFromDevice(modelName, ip),
            modal = new Modal(),
            int=new interfaceForm(),
            freeList = new FreeEquipList('device', '1'),
            bodyField = '\<center id="statusPing"></center>\
                        <div id="freeDevice"></div>\
                        <center id="remoteCheck"></center>\
                        <center>\
                            <a id="addToStock" class="btn a-btn">\
                               <span  class="glyphicon glyphicon-plus black small" title="add manually"></span> Add new device\
                            </a>\
                            <br/><br/>\
                        </center>\
                        <div id="newDevice"></div>';
    event.preventDefault();
    modal.getModal($('#unusedDeviceList'))
            .then(function () {
                modal.setTitle('Bind device ' + modelName);
                modal.show();
                modal.addBody(bodyField);
                /*Action after closing modal window*/
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    getRack($rackBody, idRack);
                });
                return freeList.getList($('#freeDevice'), modelName);
            })
            .then(function () {
                getInfoFromDevice(idDeviceInRack,ip, modelName, info, modal, freeList);
                $('#addToStock').on('click', function () {
                    $('#addToStock').off('click');
                    getAddingForm(modal,idDeviceInRack, ip, {model: modelName});
                });
                return freeList.eventListener();
            })
            .then(function (id) {
                idDevice = id;
                addDeviceEvent(idDevice, 'Move device from "Storage" to "'+rackLocation+'"');
//                idInterface = insertValueList('interfaces', {ip: ip, id_device: idDevice});
                return  updateValue('devices_in_racks', 'id_device', idDevice, 'id_device_in_rack', idDeviceInRack);
            })
            .then(function () {
                modal.setTitle('Add network interfaces for device');
                return int.getForm(modal.getBodyField(), idDevice);
            })
            .then(function () {
                return int.eventListener();
            })
            .then(function (ip) {
                return updateValue('devices_in_racks', 'mng_ip', ip, 'id_device_in_rack', idDeviceInRack);
            })
            .then(function () {
                modal.hide();
            })
});


/******************************************************************************/
/************************* get patch panel information ******** ********************/
/******************************************************************************/
var modal = new Modal();
var getPatchPanelTable = function (idPatchPanel, idModel, callback) {
    var table;
    return $.post(
            "/ajax",
            {
                get_patchpanel_info: '1',
                id_model: idModel,
                id_patchpanel: idPatchPanel
            },
    function (patch) {
        table = '<div align="center"><h3>' + patch['name'] + '</div>\
                    <table class="table table-bordered patch" data-id-patchpanel=' + patch['id_patchpanel'] + '>';
        for (var i = 0; i < patch['sockets'].length; i++) {
            table += '<tr data-id-socket="' + patch['sockets'][i]['id_socket'] + '">\
                        <td class="number">' + (i + 1) + '</td>\
                        <td class="descr">' + patch['sockets'][i]['descr'] + '</td>\
                    </tr>'
        }
        table += '</table>'
        if (callback && typeof (callback) === "function") {

            callback(table);
        }
    },
            "json"
            );
};

/*Open modal window and show patch panel information*/
$('#content').on('click', 'span.info-patchpanel', function () {
    var modal = new Modal();
    var idPatchPanel = $(this).data('idPatchpanel'),
            idModel = $(this).data('idModel');
    modal.getModal($('#deviceInformation'), function () {
        modal.setTitle('Patch panel connection');
        getPatchPanelTable(idPatchPanel, idModel, function (table) {
            modal.addBody(table);
        });
        modal.show();
    });
});

$('#content').on('dblclick', 'td.descr', function (e) {
    var $td = $(this),
            value = $td.text(),
            targetEl = e.target;
    if (!$(targetEl).is('input')) {
        $td.html('<input class="input-descr form-control" type="text">')
                .find('input')
                .val(value);
    }
});
$('#content ').on('keydown', 'table.patch input.input-descr', function (event) {
    var key = event.which,
            targetEl = event.target,
            $input = $(this),
            idPatchpanel = $input.closest('table').attr('data-id-patchpanel'),
            idSocket = $input.closest('tr').attr('data-id-socket'),
            number = $input.closest('tr').find('td.number').text().trim(),
            value;
    if (key === 13) {
        value = $input.val();
        console.log(idSocket);
        if (idSocket !== '') {
            updateValue('sockets', 'descr', value, 'id_socket', idSocket)
                    .then(function () {
                        $input.closest('td').text(value);
                    });
        }
        else {
            idSocket = insertValue('sockets', 'id_patchpanel', idPatchpanel);
            updateValue('sockets', 'descr', value, 'id_socket', idSocket)
                    .then(function () {
                        return updateValue('sockets', 'number', number, 'id_socket', idSocket);
                    })
                    .then(function () {
                        $input.closest('td').text(value);
                    });
        }
    }
});

/******************************************************************************/
/************************* get device information ******** ********************/
/******************************************************************************/

/*Open modal window and show device information*/
$('#content').on('click', 'span.info', function () {
    var $tr = $(this).closest('tr'),
            idDevice = $(this).data('idDevice'),
            modelName = $tr.find('td.model').text();
    var modal = new Modal();
    modal.getModal($('#deviceInformation'))
            .then(function () {
                /***get device information body***/
                modal.setWidth('50%');
                modal.setTitle('<b>' + modelName + '</b>');
                modal.show();
                modal.addBody('<div id="statusInfo"></div>\
                               <div id="deviceDescription"></div>\
                               <div id="modelDescription"></div>\
                               <div id="generalInfo"></div>\
                               <div id="deviceCards"></div>\
                               <div id="historyEvents"></div>\
                              ')
                return getMainInfo($('#deviceDescription'), 'device', idDevice);
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
            })
            .then(function (data) {
            });
});

/******************************************************************************/
/************************* booking device  ************************************/
/******************************************************************************/

$('#content').on('click', 'span.free', function () {
    var modal = new Modal(),
            $td = $(this).closest('td'),
            $tr = $td.closest('tr'),
            idDeviceInRack = $tr.data('idDeviceInRack'),
            name, checkingIdEmployee, idEmployee;

    modal.getModal($('#bookDevice'), function () {
        var staffList = new List('staff', 'id_employee', 'employee_name');
        staffList.getElementsDropDown(modal.getBodyField());
        modal.setTitle('Who is booking device?');
        modal.addActionButton('Book device', 'bookDevice');
        modal.show();
        $('#content').on('click', 'button#bookDevice', function () {
            name = staffList.getInputVal();
            checkingIdEmployee = staffList.checkInDb(name);
            if (checkingIdEmployee) {
                idEmployee = checkingIdEmployee;
                updateValue('devices_in_racks', 'id_reserved_by', idEmployee, 'id_device_in_rack', idDeviceInRack);
                modal.hide();
                $td.html('<div class="guy"><button type="button" class="close unbook" aria-label="Close"><span aria-hidden="true">&times;</span></button><small>' + name + '</small></div>');
                $('#content').off('click', '#addEmployeeButton');
            }
            else {
                alert(name + 'not found');
                modal.hide();
            }
        });
    });
});

$('#content').on('click', '.unbook', function () {
    $td = $(this).closest('td');
    $(this).closest('.guy').remove();
    $td.html('<span class="glyphicon free">free</span>');
});

/******************************************************************************/
/**************************** mark device  ************************************/
/******************************************************************************/

$('#content').on('click', '.glyphicon-pushpin', function () {
    var $tr = $(this).closest('tr'),
            $device = $tr.closest('tbody'),
            idDeviceInRack = $tr.data('idDeviceInRack');
    if ($device.hasClass('mark-device')) {
        $device.removeClass('mark-device');
        updateValue('devices_in_racks', 'is_mark', '0', 'id_device_in_rack', idDeviceInRack)
    }
    else {
        $device.addClass('mark-device');
        updateValue('devices_in_racks', 'is_mark', '1', 'id_device_in_rack', idDeviceInRack);
    }
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
/******************************************************************************/
/**************************** initial settings ********************************/
/******************************************************************************/


$('#racksCarousel').on('slid.bs.carousel', function () {
    var idRack = $(this).find('.active').data('idRack'),
            idLab = $('#fullRack').data('idLab'),
            curUrl = window.location.href,
            global, arr;
    arr = curUrl.split('/');
    global = arr[arr.length - 5];
    setLocation('/' + global + '/lab/' + idLab + '/rack/' + idRack);
});