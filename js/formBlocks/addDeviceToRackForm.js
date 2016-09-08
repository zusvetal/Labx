var insertDeviceIntoRack = function (idRack, topSlot, callback) {
    var checkEmptySpaceInRack = function (idRack, topSlot, size) {
        if (Number(topSlot - size) < 0) {
            return false;
        }
        var status = $.ajax({
            url: "/ajax",
            async: false,
            type: "POST",
            data: {
                check_empty_space: '1',
                id_rack: idRack,
                top_slot: topSlot,
                size: size
            },
            dataType: "text"
        }).responseText.trim();
        return status === '0' ? false : true;
    };
    this.idRack = idRack;
    this.topSlot = topSlot;
    var modelList = new List('device_model', 'id_model', 'model');
    this.getForm = function ($parentEl, callback) {
        var idRack = this.idRack,
                topSlot = this.topSlot;
        var dfd = jQuery.Deferred();
        //               eventListener = this.eventListener;
        this.$parentEl = $parentEl;

        $.post(
                "/ajax",
                {
                    get_device_to_rack_form: '1',
                    slot: topSlot
                },
        function (form) {
            $parentEl.html(form);
            modelList.getElementsDropDown($('#modelDevice'));
            $parentEl.find('#addForm')
                    .attr('data-id-rack', idRack)
                    .attr('data-slot', topSlot);
            //eventListener($parentEl);
            if (callback && typeof (callback) === "function") {
                callback($parentEl);
            }
            dfd.resolve($parentEl);
        });
        return dfd.promise();
    };
    this.eventListener = function () {
        var dfd = jQuery.Deferred();
        topSlot = this.topSlot;
        $parentEl = this.$parentEl;
        $parentEl.on('click.rack', 'button.submit', function () {
            var $btn = $(this),
                    $form = $btn.closest('#addForm').find('table'),
                    idRack = $btn.closest('#addForm').data('idRack'),
                    topSlot = $btn.closest('#addForm').data('slot'),
                    ip = $form.find('.ip').val(),
                    size = $form.find('.size').val(),
                    modelName = modelList.getInputVal(),
                    idModel = modelList.getElementId(),
                    idFormFactor = $form.find('.form-factor').val(),
                    ip_pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                    size_pattern = /^\d+$/,
                    permission = true,
                    idDeviceInRack, device;
            if (!size_pattern.test(size) || size == '0') {
                $('input.size').css({'border': 'solid 2px red'});
                permission = false;
            }
            if (!ip_pattern.test(ip) && ip !== '') {
                $('input.ip').css({'border': 'solid 2px red'});
                permission = false;
            }

            if (permission) {
                if (modelName === '') {
                    modelList.focusToInputField();
                }
                else if (!checkEmptySpaceInRack(idRack, topSlot, size)) {
                    warningMessage('This device cannot insert in this unit. Not enough place');
                }
                else if (getDeviceThatUseIp(ip)) {
                    device = getDeviceThatUseIp(ip);
                    warnMessage(
                            $parentEl.find('.info-field'),
                            '<br>Device exist with ip <b>' + ip + '</b>.<br>\
                             Model: <b>' + device['model'] + '</b>, location: <b>' + device['descr'] + '</b>',
                            function () {
                                modelList.focusToInputField();
                            }
                    );
                }
                else {
                    if (idModel === '0') {
                        /*when model doesn't exist - show model form*/
                        var modelForm = new ModelForm('device');
                        $btn.hide();
                        $form.find('input').attr('disabled', 'disabled');
                        $form.find('select').attr('disabled', 'disabled');
                        $form.find('button').attr('disabled', 'disabled');
                        infoMessage($parentEl.find('.info-field'),
                                "Device model <b>" + modelName + "</b> not exist in the db.<br/> \
                                        Add <b>" + modelName + "</b> to model database.");
                        modelForm.getForm($parentEl.find('#modelForm'),
                                    {size_in_unit: size, model: modelName, id_formfactor: idFormFactor},
                                    slideToEl($('#modalWindow'), $('.info-field'))
                                )
                                .then(function () {
                                    return modelForm.eventListener();
                                })
                                .then(function () {
                                    modelList.setElementId(getValue('device_model', 'id_model', 'model', modelName));
                                    $form.find('input').removeAttr('disabled');
                                    $form.find('select').removeAttr('disabled');
                                    $form.find('button').removeAttr('disabled');
                                    $btn.click();
                                });
                        return false;
                    }
                    idDeviceInRack = insertValue('devices_in_racks', 'id_model', idModel);
                    updateValueList('devices_in_racks', {id_model: idModel, size_in_unit: size, unit: topSlot, mng_ip: ip, id_rack: idRack, }, 'id_device_in_rack', idDeviceInRack)
                            .then(function () {
                                if (idFormFactor === '2') {
                                    updateValue('devices_in_racks', 'is_tower', '1', 'id_device_in_rack', idDeviceInRack)
                                            .then(function () {
                                                dfd.resolve(idDeviceInRack);
                                                dfd.always($parentEl.off('.rack', '**'));
                                                $parentEl.empty();
                                                if (callback && typeof (callback) === "function") {
                                                    callback();
                                                }
                                            })
                                }
                                else {
                                    $parentEl.empty();
                                    dfd.resolve(idDeviceInRack);
                                    dfd.always($parentEl.off('.rack', '**'));
                                    if (callback && typeof (callback) === "function") {
                                        callback();
                                    }
                                }

                            });
                }
            }
            setTimeout(function () {
                $('input.size').css({'border': 'solid 1px #ccc'});
                $('input.ip').css({'border': 'solid 1px #ccc'});
            }, 2000);

        });
        $parentEl.on('click.rack', '#closeForm', function () {
            $(this).closest('#addForm').remove();
            $parentEl.off('.rack', '**');
        });
        $parentEl.on('change.rack', 'select.form-factor', function () {
            switch ($(this).val()) {
                case '1':
                    $parentEl.find('.size')
                            .val('')
                            .removeAttr('disabled');
                    break;
                case '2':
                    $parentEl.find('.size')
                            .val('11')
                            .attr('disabled', 'disabled');
                    break;
                case '3':
                    $parentEl.find('.size')
                            .val('0')
                            .attr('disabled', 'disabled');
                    break;
            }
        });
        modelList.changeElement(function (event, idModel) {
            var size, idFormFactor;
            console.log(event);
            if (idModel !== '0') {
                size = getValue('device_model', 'size_in_unit', 'id_model', idModel);
                idFormFactor = getValue('device_model', 'id_formfactor', 'id_model', idModel);
                $parentEl.find('.size')
                        .val(size)
                        .attr('disabled', 'disabled');
                $parentEl.find('select.form-factor')
                        .attr('disabled', 'disabled')
                        .find('[value=' + idFormFactor + ']')
                        .attr('selected', 'selected');
            }
            else {
                $parentEl.find('.size')
                        .val('')
                        .removeAttr('disabled');
                $parentEl.find('select.form-factor')
                        .removeAttr('disabled')
                        .find('[value=1]')
                        .attr('selected', 'selected');
            }
        });
        return dfd.promise();
    };
};
var ParametrForm = function (idRack, topSlot, type) {
    var param;
    this.idRack = idRack;
    this.topSlot = topSlot;
    this.type = type;
    if (this.type === 'barcode' || typeof type === 'undefined') {
        param = {
            tableField: 'asset_harmonic',
            type: 'barcode',
            label: 'Barcode:'
        };
    }
    else if (this.type === 'sn') {
        param = {
            tableField: 'sn',
            type: 'sn',
            label: 'Serial Number:'
        };
    }
    this.getForm = function ($parentEl, callback) {
        var idRack = this.idRack,
                topSlot = this.topSlot,
                dfd = jQuery.Deferred();
        this.$parentEl = $parentEl;

        $.post("/ajax", {get_parametr_form: '1', slot: topSlot})
                .then(function (form) {
                    $parentEl.html(form);
                    $parentEl.find('td.parametr').text(param.label)
                    $parentEl.find('input[name="parametr"]').focus();

                    if (callback && typeof (callback) === "function") {
                        callback($parentEl);
                    }
                    dfd.resolve($parentEl);
                });
        return dfd.promise();
    };
    this.eventListener = function () {
        var $parentEl = this.$parentEl,
                idRack = this.idRack,
                rackName = getValue('rack', 'name', 'id_rack', idRack),
                newRackLocation = "Rack " + rackName + " slot " + topSlot,
                dfd = jQuery.Deferred();

        $parentEl.on('submit.barcode', '#parametrForm', function (e) {
            e.preventDefault();
            var value = $(this).find('input[name="parametr"]').val().trim(),
                    idDeviceInRack, idDevice,
                    ids = getValueListSync('device_list', 'id_device', param.tableField, value);
            /*check for existence device in db with such param*/
            if (ids != '0') {
                for (var i in ids) {
                    (function () {
                        var idDevice = ids[i];
                        var idSubmitButton = 'moveSubmit' + idDevice;
                        getDeviceInfo(idDevice)
                                .then(function (device) {
                                    var idModel = device['id_model'],
                                            idLocation = device['id_location'],
                                            numOfUnit = device['size_in_unit'],
                                            idDeviceInRack, ip;
                                    $parentEl.find('button[type="submit"]')
                                            .attr('disabled', 'disabled');
                                    /*"4" - id of storage location*/
                                    if (idLocation !== '4' || ids.length > 1) {
                                        var oldLocation = device['descr'];
                                        warnMessage(
                                                $parentEl.find('.info-field'),
                                                '<br>Device is used in other location </b>.<br>\
                                                 Model: <b>' + device['model'] + '</b>, location: <b>' + device['descr'] + '</b><br><br>\
                                                 <center><b>Do you want move device to new location?</b></center>\
                                                 <center>\
                                                    <button id="moveSubmit" type="button" data-id-model=' + idModel + ' class="btn btn-default a-btn btn-lg">Ok</button>\
                                                    <button id="moveReset" type="button" class="btn a-btn btn-lg btn-default">Cancel</button>\
                                                </center>'
                                                ,
                                                function () {
                                                    $parentEl.find('input[name="parametr"]').focus();
                                                    $parentEl.find('button[type="submit"]')
                                                            .removeAttr('disabled');
                                                    $parentEl.find('.info-field').empty();
                                                }
                                        );
                                        $parentEl.find('#moveSubmit').attr('id', idSubmitButton)
                                        $parentEl.on('click.barcode', '#' + idSubmitButton, function () {
                                            var mngIp;
                                            if (!checkEmptySpaceInRack(idRack, topSlot, numOfUnit)) {
                                                dangerMessage($parentEl.find('.info-field'), 'This device cannot insert in this unit. Not enough place');
                                            }
                                            else {
                                                mngIp = getValue('devices_in_racks', 'mng_ip', 'id_device', idDevice);
                                                deleteValue('devices_in_racks', 'id_device', idDevice)
                                                        .then(function () {
                                                            return insertValueListAsync('devices_in_racks', {mng_ip: mngIp, id_device: idDevice, unit: topSlot, size_in_unit: numOfUnit, id_rack: idRack, id_model: idModel});
                                                        })
                                                        .then(function (id) {
                                                            idDeviceInRack = id
                                                            /*"1" - id of rack location*/
                                                            return updateValue('device_list', 'id_location', '1', 'id_device', idDevice);
                                                        })
                                                        .then(function () {
                                                            addDeviceEvent(idDevice, 'Move device from "' + oldLocation + '" to "' + newRackLocation + '"');
                                                            dfd.resolve(idDeviceInRack);
                                                        });
                                            }
                                            $parentEl.off('click.barcode', '#moveSubmit');
                                        });
                                        $parentEl.on('click.barcode', '#moveReset', function () {
                                            $(this).closest('.info-field').empty();
                                            $parentEl.find('button[type="submit"]')
                                                    .removeAttr('disabled');
                                        });
                                    }
                                    /*Device locate in Storage -  Add to rack*/
                                    else {
                                        if (checkEmptySpaceInRack(idRack, topSlot, numOfUnit)) {
                                            ip = getValue('interfaces', 'ip', 'id_device', idDevice);
                                            insertValueListAsync('devices_in_racks', {mng_ip: ip, id_device: idDevice, unit: topSlot, size_in_unit: numOfUnit, id_rack: idRack, id_model: idModel})
                                                    .then(function (id) {
                                                        idDeviceInRack = id;
                                                        /*"1" - id of rack location*/
                                                        return updateValue('device_list', 'id_location', '1', 'id_device', idDevice);
                                                    })
                                                    .then(function () {
                                                        addDeviceEvent(idDevice, 'Move device from "Storage" to "' + newRackLocation + '"');
                                                        dfd.resolve(idDeviceInRack);
                                                    })
                                        }
                                        else {
                                            dangerMessage($parentEl.find('.info-field'), 'This device cannot insert in this unit. Not enough place');
                                        }
                                    }
                                });
                    })();
                }
            }
            else {
                /*adding new device to db*/
                var insertForm = new insertDeviceIntoRack(idRack, topSlot);
                var form = new Form('device');
                insertForm.getForm($parentEl)
                        .then(function () {
                            $parentEl.prepend('<div  class="title"></div>');
                            infoMessage($parentEl.find('.title'),
                                    'Device with ' + param.type + ' <b>' + value + '</b> doesn`t exist in database, add it to rack.');
                            return insertForm.eventListener();
                        })
                        .then(function (id) {
                            idDeviceInRack = id;
                            var idModel = getValue('devices_in_racks', 'id_model', 'id_device_in_rack', idDeviceInRack),
                                    modelName = getValue('device_model', 'model', 'id_model', idModel);
                            if (param.type === 'barcode') {
                                return form.getForm($parentEl, {harmonicBarcode: value, model: modelName});
                            }
                            else if (param.type === 'sn') {
                                return form.getForm($parentEl, {sn: value, model: modelName});
                            }
                        })
                        .then(function () {
                            $parentEl.prepend('<div  class="title"></div>');
                            infoMessage($parentEl.find('.title'),
                                    'Device with ' + param.type + '<b>' + value + '</b> doesn`t exist in database, add it to stock.');
                            return form.eventListener();
                        })
                        .then(function (id) {
                            idDevice = id;
                            return updateValue('devices_in_racks', 'id_device', idDevice, 'id_device_in_rack', idDeviceInRack);
                        })
                        .then(function () {
                            return updateValue('device_list', 'id_location', '1', 'id_device', idDevice);
                        })
                        .then(function () {
                            return getValueAsync('devices_in_racks', 'mng_ip', 'id_device', idDevice);
                        })
                        .then(function (ip) {
                            insertValueListAsync('interfaces', {id_device: idDevice, ip: ip});
                            dfd.resolve();
                        });
            }
        });
        $parentEl.on('click.barcode', '#closeForm', function () {
            $(this).closest('#addForm').remove();
            $parentEl.off('.barcode', '**');
        });
        return dfd.promise();
    };

};