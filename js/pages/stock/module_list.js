$('#content').off('.modules','**');
/******************************************************************************/
/***************************** add module **********************************/
/******************************************************************************/
var getModuleRow = function (idModule) {
    return  $.post(
            "/ajax",
            {
                get_module_tr: '1',
                id_module: idModule
            }
    );
};

$('#content').on('click.modules', 'span.add', function (event) {
    var modal = new Modal(),
            form = new Form('module');
    event.preventDefault();
    modal.getModal($('#addNewModuleToStock'))
            .then(function () {
                return form.getForm(modal.getBodyField());
            })
            .then(function () {
                modal.setTitle('Add new module to stock');
                modal.setWidth('30%');
                modal.show();
                return form.eventListener();
            })
            .then(function (idModule) {
                modal.hide();
                return getModuleRow(idModule);
            })
            .then(function (newModule) {              
                $('table tr:nth-of-type(1)').after(newModule);
                recountNumber($('td.number'));
                highLightNewEntry($('table tr:nth-of-type(2)'));
            });
});


/******************************************************************************/
/***************************** delete module **********************************/
/******************************************************************************/

$('#content').on('click.modules', '.remove-module', function () {
    var $tr = $(this).closest('tr'),
            idModule = $tr.attr('data-id-module');
    $.confirm("Do you want to remove this entry?")
            .then(function () {
                deleteValue('module_list', 'id_module', idModule);
                $tr.fadeOut('slow', function () {
                    $(this).remove();
                    recountNumber($('td.number'));
                });
            });
});
/******************************************************************************/
/****************** edit module  **********************************************/
/******************************************************************************/

$('#content').on('click.modules', 'span.edit-module', function (event) {
    event.preventDefault();
    var $icon=$(this),
            modal = new Modal(),
            form = new Form('module'),
            $tr=$icon.closest('tr'),
            idModule = $tr.data('idModule');
    modal.getModal($('#addNewModuleToStock'))
            .then(function () {
                /*Action after closing modal window*/
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    $tr.removeClass('info');
                });
                $tr.addClass('info');
                return form.getForm(modal.getBodyField(),{id:idModule});
            })
            .then(function (idDevice) {
                modal.setTitle('Edit device');
                modal.setWidth('30%');
                modal.show();
                return form.eventListener();
            })
            .then(function () {
                return getModuleRow(idModule);
            })
            .then(function (tr) {
                $tr.replaceWith(tr)
                recountNumber($('td.number'));
                modal.hide();
            });
});


/******************************************************************************/
/***************************** Change modules/cards status  *******************/
/******************************************************************************/
$('#content').on('click.modules', '.edit-trans', function (event) {
    var $tr = $(this).closest('tr'),
            idOld = $tr.data('idTransferStatus'),
            nameModel = $tr.find('.model').text(),
            idModule=$tr.data('idModule'),
            modal = new Modal(),
            oldStatus,idNew;
    event.preventDefault();
    alert(idOld);
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
                alert(id)
                idNew=id;
                $tr.attr('data-id-transfer-status', id);
                return updateValue('module_list', 'id_transfer_status', id, 'id_module', idModule);
            })
            .then(function () {
                hideTransferStatus();
                return getValueAsync('transfer_status', 'transfer_status_name', 'id_transfer_status', idNew );
            })
            .then(function (newStatus) {
                addModuleEvent(idModule, 'Change transfer status from "' + oldStatus + '" to "' + newStatus+'"');
                showTransferStatus();
                modal.hide();
            });
});

$('#content').on('click.modules', '.edit-work', function (event) {
    var $tr = $(this).closest('tr'),
            idOld = $tr.data('idWorkStatus'),
            nameModel = $tr.find('.model').text(),
            idModule=$tr.data('idModule'),
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
                return updateValue('module_list', 'id_work_status', id, 'id_module', idModule);
            })
            .then(function () {
                hideWorkStatus();
                return getValueAsync('work_status', 'work_status_name', 'id_work_status', idNew);
            })
            .then(function (newStatus) {
                showWorkStatus();
                addModuleEvent(idModule, 'Change status from "' + oldStatus + '" to "' + newStatus+'"');
                modal.hide();
            });
});

/******************************************************************************/
/************************* get module info ******** ********************/
/******************************************************************************/

/*Open modal window and show card/module information*/
$('#content').on('click.modules', 'span.info-module', function () {
    var $tr = $(this).closest('tr'),
            idModule = $tr.data('idModule'),
            modelName = $tr.find('td.model').text(),
            modal = new Modal();
    modal.getModal($('#moduleInfo'))
            .then(function () {
                /*Action after closing modal window*/
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    $tr.removeClass('info');
                });
                /***get module information body***/
                modal.setWidth('50%');
                modal.setTitle('<b>' + modelName + '</b>');
                modal.show();
                modal.addBody('\
                               <div id="mainInfo"></div>\
                               <div id="deviceDescription"></div>\
                               <div id="modelDescription"></div>\
                               <div id="historyEvents"></div>\
                              ')
                $tr.addClass('info');
                return getMainInfo($('#mainInfo'), 'module', idModule);
            })
            .then(function () {
                return deviceDescription($('#deviceDescription'), 'module', idModule);
            })
            .then(function () {
                return modelDescription($('#modelDescription'), 'module', modelName);
            })
            .then(function () {
                return historyEvents($('#historyEvents'), 'module',idModule);
            })
});
/******************************************************************************/
/**************************** transfer card  ********************************/
/******************************************************************************/
$('#content').on('click.modules', 'span.transfer', function () {
    var $tr = $(this).closest('tr'),
            idModule = $tr.data('idModule'),
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
                return updateValueList('module_list', {id_global_location:id, id_transfer_status:'1'}, 'id_module', idModule);
            })
            .then(function () {
                return getValueAsync('global_location', 'name', 'id_global_location', getIdGlobalLocation());
            })
            .then(function (location) {
                oldLocation=location;
                return getValueAsync('global_location', 'name', 'id_global_location', idNewLocation);
            })
            .then(function (location) {
                addModuleEvent(idModule, 'Change global location from "' + oldLocation + '" to "' + location + '"');
                return $tr.fadeOut();
            })
            .then(function () {
                    modal.hide();
                    $tr.remove();
                    recountNumber($('td.number'));
            });
});
/******************************************************************************/
/*****************************  popover info **********************************/
/******************************************************************************/
$('.used').popover({
    title: 'A device that uses a card',
    content: '<div class="popover-content"></div>',
    trigger: 'click',
    placement: 'bottom',
    html:true
  });
$('.used').on('show.bs.popover', function () {
    var $popover=$(this);
    var idDevice = $popover.data('idDevice');
    getDeviceInfo(idDevice)
            .then(function (device) {
                console.log(device);
                $popover.find('+div .popover-content')
                        .html('<table class="device-info table no-border">\
                                <tr>\
                                    <td class="show-device-info" colspan="2" align="center" data-id-device="' + device.id_device + '">'+device.model+'</td>\
                                </tr>\
                                <tr>\
                                    <td>barcode: ' + device.asset_harmonic + '</td>\
                                    <td>S/N: ' + device.sn + '</td>\
                                </tr>\
                                <tr>\
                                    <td class="show-in-rack" colspan="2" align="center" data-id-device="' + device.id_device + '">' + device.descr + '</td>\
                                </tr>\
                            </table>')
            })
});
$('#content').on('click.modules', 'td.show-in-rack', function () {
    var modal = new Modal(),
            descr=$(this).text(),
            idDevice = $(this).data('idDevice');
    modal.getModal($('#deviceInRack'))
            .then(function () {
                modal.setWidth('60%');
                modal.setTitle('<b>'+descr+'</b>');
                return showDeviceInRack(modal.getBodyField(), idDevice);
            })
            .then(function () {
                modal.show();
            });
});
$('#content').on('click.modules', 'td.show-device-info', function () {
    var modal = new Modal(),
            idDevice = $(this).data('idDevice'),
            modelName = $(this).text();
    modal.getModal($('#deviceInfo'))
            .then(function () {
                /***get device information body***/
                modal.setWidth('50%');
                modal.setTitle('<b>' + modelName + '</b>');
                modal.show();
                modal.addBody('<div id="statusInfo"></div>\
                               <div id="mainInfo"></div>\
                               <div id="deviceDescription"></div>\
                               <div id="modelDescription"></div>\
                               <div id="generalInfo"></div>\
                               <div id="deviceCards"></div>\
                               <div id="historyEvents"></div>\
                              ')
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