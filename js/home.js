var setLocation = function (curLoc) {
    try {
        history.pushState(null, null, curLoc);
        return;
    } catch (e) {
    }
    location.hash = '#' + curLoc;
}
var getIdGlobalLocation = function () {
    return $.ajax({
        url: "/ajax",
        async: false,
        type: "POST",
        data: {
            get_id_global_location: '1',
        },
        dataType: "text"
    }
    ).responseText.trim();
};
var updateValueList = function (table, values, where_col, where_value, callback) {
    return $.post(
            "/ajax",
            {
                update_value_list: '1',
                table: table,
                values: values,
                where_col: where_col,
                where_value: where_value
            },
    function (data) {
        if (data.trim() !== '1') {
            alert('Error - ' + data);
        }
        else if (typeof callback !== 'undefined') {
            callback(data);
        }
    });
};
var updateValue = function (table, item, value, where_col, where_value, callback) {
    return $.post(
            "/ajax",
            {
                update_value: '1',
                table: table,
                col: item,
                value: value,
                where_col: where_col,
                where_value: where_value
            },
    function (data) {
        if (data.trim() !== '1') {
            alert('Error when trying update database  ' + data);
        }
        else if (typeof callback !== 'undefined') {
            callback(data);
        }
    });
};
var deleteValue = function (table, where_col, where_value, callback) {

    return $.post(
            "/ajax",
            {
                delete_value: '1',
                table: table,
                where_col: where_col,
                where_value: where_value
            },
    function (data) {
        if (typeof callback !== 'undefined') {
            callback(data);
        }
    });
};
var insertValueList = function (table, values) {
    return $.ajax({
        url: "/ajax",
        async: false,
        type: "POST",
        data: {
            insert_value_list: '1',
            table: table,
            values: values
        },
        dataType: "text"
    }
    ).responseText.trim();
};
var insertValue = function (table, col, value) {
    return $.ajax({
        url: "/ajax",
        async: false,
        type: "POST",
        data: {
            insert_value: '1',
            table: table,
            col: col,
            value: value
        },
        dataType: "text"
    }
    ).responseText.trim();
};
var getValue = function (table, col, where_col, where_value) {
    return $.ajax({
        url: "/ajax",
        async: false,
        type: "POST",
        data: {
            get_value: '1',
            table: table,
            col: col,
            where_col: where_col,
            where_value: where_value
        },
        dataType: "text"
    }
    ).responseText.trim();
};
var getValueAsync = function (table, col, where_col, where_value, callback) {
    return $.post(
            "/ajax",
            {
                get_value_async: '1',
                table: table,
                col: col,
                where_col: where_col,
                where_value: where_value
            },
    function (data) {
        if (typeof callback !== 'undefined') {
            callback(data);
        }
    },
            "json"
            );

};
var getValueList = function (table, col, where_col, where_value, callback) {
    return $.post(
            "/ajax",
            {
                get_value_list: '1',
                table: table,
                col: col,
                where_col: where_col,
                where_value: where_value
            },
    function (data) {
        if (typeof callback !== 'undefined') {
            callback(data);
        }
    },
            "json"
            );

};
var getValues = function (table, where_col, where_value) {
    return $.post(
            "/ajax",
            {
                get_values: '1',
                table: table,
                where_col: where_col,
                where_value: where_value
            },
    function (data) {
        if (typeof callback !== 'undefined') {
            callback(data);
        }
    },
            "json"
            )

};
var highLightNewEntry = function (element) {
    $(element).addClass('new-entry');
    setTimeout(function () {
        $(element).addClass('hover');
    }, 1000);
};
var slideToEl = function ($from, $to) {
    $from.animate({
        scrollTop: $to.offset().top
    }, 1000);
};
var recountNumber = function ($fields) {
    var num = 0;
    $fields.each(function () {
        ++num;
        $(this).text(num);
    });
};
var ping = function (ip, callback) {
    return $.post(
            "/utils/ping.php",
            {
                ip: ip
            },
    function (data) {
        if (typeof callback !== 'undefined') {
            callback(data);
        }
    },
            "json"
            );
};
var createTable = function (idTable, objList) {
    var table = '<table class="table" id="' + idTable + '">';
    for (var item in objList) {
        table += '<tr>\
                    <td>' + item + '</td>\
                    <td>' + objList[item] + '</td>\
        </tr>';
    }
    table += '</table>';
    return table;
};
var infoMessage = function ($parentEl, warningString, callback) {
    $parentEl.prepend('<div  class="alert alert-info">\
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
                    <span aria-hidden="true">&times;</span>\
                </button>\
                    ' + warningString + '\
            </div>');
    $parentEl.find('.alert').on('closed.bs.alert', function () {
        if (typeof callback !== 'undefined') {
            callback();
        }
    });
};
var successMessage = function ($parentEl, warningString, callback) {
    $parentEl.prepend('<div  class="alert alert-success">\
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
                    <span aria-hidden="true">&times;</span>\
                </button>\
                <strong>Well done!</strong> ' + warningString + '\
            </div>');
    $parentEl.find('.alert').on('closed.bs.alert', function () {
        if (typeof callback !== 'undefined') {
            callback();
        }
    });
};
var warnMessage = function ($parentEl, warningString, callback) {
    $parentEl.prepend('<div  class="alert alert-warning">\
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
                    <span aria-hidden="true">&times;</span>\
                </button>\
                <strong>Warning!</strong> ' + warningString + '\
            </div>');
    $parentEl.find('.alert').on('closed.bs.alert', function () {
        if (typeof callback !== 'undefined') {
            callback();
        }
    });
};
var dangerMessage = function ($parentEl, warningString, callback) {
    $parentEl.prepend('<div  class="alert alert-danger">\
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
                    <span aria-hidden="true">&times;</span>\
                </button>\
                <strong>Warning!</strong> ' + warningString + '\
            </div>');
    $parentEl.find('.alert').on('closed.bs.alert', function () {
        if (typeof callback !== 'undefined') {
            callback();
        }
    });
};
var checkFreeIp = function (ip) {
    var device,
            response;
    if (ip === '0.0.0.0' || ip === '') {
        return true
    }
    response = $.ajax({
        url: "/ajax",
        async: false,
        type: "POST",
        data: {
            check_ip: '1',
            ip: ip
        },
        dataType: "text"
    }
    ).responseText.trim();
    if (response !== '0') {
        /*device = JSON.parse(response);
         warningMessage('<br>Device exist with ip ' + device['mng_ip'] + ':<br>\
         Model ' + device['model'] + ', in rack ' + device['name'] + ', slot ' + device['unit']);
         $('.ip').css({'border': 'solid 2px red'});*/
        return false;
    }
    else {
        return true
    }

}
var getDeviceInfo = function (idDevice, callback) {
    return  $.post(
            "/ajax",
            {
                device_json_info: '1',
                id_device: idDevice
            },
    function (data) {
        if (typeof callback !== 'undefined') {
            callback(data);
        }
    },
            "json"
            );
};
var getDeviceThatUseIp = function (ip) {
    var device,
            response;
    if (ip === '0.0.0.0' || ip === '') {
        return false
    }
    response = $.ajax({
        url: "/ajax",
        async: false,
        type: "POST",
        data: {
            check_ip: '1',
            ip: ip
        },
        dataType: "text"
    }
    ).responseText.trim()
    if (response !== '0') {
        return JSON.parse(response);
    }
    else {
        return false
    }

}
var getInterfaceList = function (idDevice, callback) {
    return $.post(
            "/ajax",
            {
                get_interface_list: '1',
                id_device: idDevice
            },
    function (data) {
        if (typeof callback !== 'undefined') {
            callback(data);
        }
    },
            "json"

            );
}
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
var Modal = function () {
    this.object = $('#modalWindow');
    this.getModal = function ($parentEl, callback) {
        return $.post(
                "/ajax",
                {
                    get_modal_window: '1'
                },
        function (data) {
            $parentEl.html(data);
            if (typeof callback !== 'undefined') {
                callback($parentEl);
            }
        });
    };
    this.show = function () {
        $('#modalWindow').modal({show: true});

    };
    this.hide = function () {
        $('#modalWindow').modal('hide');

    };
    this.setTitle = function (text) {
        $('#modalTitle').html(text);
    };
    this.addActionButton = function (name, id) {
        $('#modalFooter').append('<button id="' + id + '" type="button" class="btn btn-primary">' + name + '</button>');
    };
    this.addBody = function (body) {
        return  $('#modalBody').html(body);
    };
    this.getBodyField = function () {
        return $('#modalBody');
    };
    this.setWidth = function (width) {
        $('#modalDialog').css('width', width);
    };
};
var List = function (table, idField, searchField) {
    this.table = table;
    this.idField = idField;
    this.searchField = searchField;
    this.getElementsDropDown = function ($parentEl, callback) {
        this.$parentEl = $parentEl;
        var modelName = $parentEl.text(),
                eventListener = this.eventListener,
                getLiveSearchList = this.getLiveSearchList;
       return  $.post(
                "/ajax",
                {
                    elements_dropdown: '1',
                    table: table,
                    id_col: idField,
                    search_col: searchField

                },
        function (data) {
            $parentEl.html(data);
            $parentEl.find('input').val(modelName);
            if (typeof callback !== 'undefined') {
                callback($parentEl);
            }
            eventListener($parentEl, getLiveSearchList);
        });
    };
    this.eventListener = function ($parentEl, getLiveSearchList) {
        $parentEl.on('keyup.search', 'input.search-element', function (event) {
            var noCharKey = [37, 38, 39, 40, 13, 16, 17, 18, 20, 19, 33, 34];
            var key = event.keyCode,
                    inputValue = $(this).val().trim(),
                    $itemField = $parentEl.find('ul.search-element-list'),
                    $searchButton = $parentEl.find('button.search-element'),
                    $input = $parentEl.find('input.search-element'),
                    idElement;
            if (key === 40) {
                $itemField.slideDown()
                        .find('li:nth-of-type(1) a')
                        .focus();
                return false;
            }
            if ($.inArray(key, noCharKey) == -1) {
                getLiveSearchList(inputValue, function (data) {
                    if (data.trim() !== '0') {
                        var listOfElement = JSON.parse(data);
                        var list = '';
                        for (var id_element in listOfElement) {
                            list += '<li><a href="#searchInput" data-id-element="' + id_element + '">' + listOfElement[id_element] + '</a></li>';
                        }
                        $itemField.html(list)
                                .slideDown();
                    }
                    else {
                        $itemField.slideUp();
                    }
                    /*check existing of elements in database*/
                    getValueAsync(table, idField, searchField, inputValue)
                            .then(function (idElement) {
                                if (idElement) {
                                    $input.attr('data-id-element', idElement);
                                    $itemField.slideUp()
                                    $parentEl.trigger('changeElement', [idElement]);
                                }
                            });
                });
            } else {
                $itemField.slideUp();
                return false;
            }
            $(this).attr('data-id-element', '0');
            $parentEl.trigger('changeElement', ['0']);
        });

        $parentEl.on('keydown.search', 'ul.search-element-list a', function (event) {

            var key = event.keyCode,
                    $input = $parentEl.find('input.search-element'),
                    $target = $(this),
                    $itemField = $parentEl.find('ul.search-element-list'),
                    value = $target.text(),
                    idElement;

            //$target = $(event.target);
            // console.log(event);
            switch (key) {

                case 37:
                    //left
                    event.preventDefault();
                    $input.focus();
                    $itemField.slideUp();
                    break;
                case 40:
                    //down
                    event.preventDefault();
                    $target.closest('li')
                            .next()
                            .find('a')
                            .focus();
                    break;
                case 38:
                    //up
                    var $prevEl = $target.closest('li')
                            .prev()
                            .find('a');
                    event.preventDefault();
                    if ($prevEl.length === 0) {
                        $input.focus();
                        $itemField.slideUp();
                    }
                    else {
                        $prevEl.focus();
                    }
                    break;
                case 13:
                    //enter
                    event.preventDefault();
                    idElement = $target.data('idElement');
                    $input.attr('data-id-element', $target.data('idElement'))
                            .focus()
                            .val(value);
                    $parentEl.trigger('changeElement', [idElement])
                    $itemField.slideUp();

                    break;

            }
        });

        $parentEl.on('click.search', 'ul.search-element-list a', function (event) {
            var $item = $(this),
                    $input = $parentEl.find('input.search-element'),
                    value = $item.text(),
                    idElement = $item.attr('data-id-element');
            event.preventDefault();
            $input.val(value);
            $input.focus();
            $input.attr('data-id-element', idElement);
            $parentEl.trigger('changeElement', [idElement]);
            $item.closest('ul.search-element-list')
                    .slideUp();
        });

        $parentEl.on('click.search', 'button.search-element', function (event) {
            var $itemField = $parentEl.find('ul.search-element-list');
            // event.preventDefault();
            if ($itemField.is(":visible")) {
                $itemField.slideUp();
            }
            else {
                $itemField.slideDown()
                        .find('li:nth-of-type(1) a')
                        .focus();

            }
        });
    };
    this.changeElement = function (callback) {
        this.$parentEl.on('changeElement', callback);
    };
    this.checkInDb = function (elementName) {
        var result = getValue(table, idField, searchField, elementName);
        return result === '0' ? false : result;
    };
    this.getLiveSearchList = function (inputValue, callback) {
        $.post(
                "/ajax",
                {
                    search_list: '1',
                    value: inputValue,
                    table: table,
                    search_col: searchField,
                    id_col: idField
                },
        function (data) {
            if (typeof callback !== 'undefined') {
                callback(data);
            }
        });
    };
    this.destroyEvents = function () {
        this.$parentEl.unbind('.search');
    };
    this.addElementToDb = function (elementName) {
        /*return id of adding to database element*/
        return insertValue(table, searchField, elementName);
    };
    this.getInputVal = function () {
        if (this.$parentEl.find('input.search-element').val() !== undefined) {
            return this.$parentEl.find('input.search-element').val().trim();
        }
        return false;
    };
    this.setInputVal = function (value) {
        return this.$parentEl.find('input.search-element').val(value);
    };
    this.getElementId = function () {
        return this.$parentEl.find('input.search-element').attr('data-id-element');
    };
    this.setElementId = function (id) {
        return this.$parentEl.find('input.search-element').attr('data-id-element', id);
    };
    this.focusToInputField = function () {
        this.$parentEl.find('input.search-element').focus();
    };
    this.addClassToInputField = function (className) {
        this.$parentEl.find('input.search-element').addClass(className);
    };
    this.removeElementsDropDown = function () {
        if (this.$parentEl) {
            this.destroyEvents();
            if (this.$parentEl.find('input').length > 0) {
                this.$parentEl.text(this.getInputVal());
            }
        }
    }

};
var GettingInfoFromDevice = function (modelName, ip) {
    var
            patternPVR = /pvr.[78]\d{2,3}/i,
            patternPVR2900 = /pvr.2\d{2,3}/i,
            patternEllipse = /ellipse.[123]\d{2,3}/i,
            patternCisco = /cisco.\w*[3]\d{2,3}[\w\s-]*/i,
            patternJuniper = /juniper.[\w\s-]*/i,
            patternProsrteam1000 = /prostream.1000/i,
            patternProsrteam9000 = /prostream.9[0,1]00/i,
            patternEnensys = /enensys.[\w\s\d]*/i,
            patternProstreamPsm3600 = /prostream psm 3600/i,
            patternPDU = /switched pdu.[\w\s\d]/i,
            patternNSG_Pro = /nsg[\s,-]pro/i,
            patternNSG9000_40G = /nsg[\s,-]*9000[\s,-]40g/i,
            patternNSG9000_6G = /nsg[\s,-]*9000[\s,-]6g/i,
            scriptPath;
    this.modelName = modelName;
    this.ip = ip;
    this.abilityGettingInfo = true;
    if (patternPVR.test(modelName)) {
        this.scriptPath = "/snmp/pvr";
    }
    else if (patternPVR2900.test(modelName)) {
        this.scriptPath = "/snmp/pvr_2900";
    }
    else if (patternEllipse.test(modelName)) {
        this.scriptPath = "/snmp/ellipse";
    }
    else if (patternCisco.test(modelName)) {
        this.scriptPath = "/snmp/cisco";
    }
    else if (patternJuniper.test(modelName)) {
        this.scriptPath = "/snmp/juniper";
    }
    else if (patternProsrteam1000.test(modelName)) {
        this.scriptPath = "/snmp/prostream1000";
    }
    else if (patternProsrteam9000.test(modelName)) {
        this.scriptPath = "/xml/prostream9000";
    }
    else if (patternEnensys.test(modelName)) {
        this.scriptPath = "/snmp/enensys";
    }
    else if (patternProstreamPsm3600.test(modelName)) {
        this.scriptPath = "/snmp/prostream_psm_3600";
    }
    else if (patternNSG9000_6G.test(modelName)) {
        this.scriptPath = "/snmp/nsg9000_6g";
    }
    else if (patternNSG9000_40G.test(modelName)) {
        this.scriptPath = "/snmp/nsg9000_40g";
    }
    else if (patternNSG_Pro.test(modelName)) {
        this.scriptPath = "/snmp/nsg_pro";
    }
    else if (patternPDU.test(modelName)) {
        this.scriptPath = "/snmp/pdu";
    }
    else {
        this.abilityGettingInfo = false;
    }

    this.general = function (callback) {
        return  $.post(
                this.scriptPath,
                {
                    get_info: '1',
                    ip: this.ip
                },
        callback,
                "json"
                );
    };

    this.getModulesInfo = function (callback) {
        return $.post(
                this.scriptPath,
                {
                    get_modules_info: '1',
                    ip: this.ip
                },
        callback,
                "json"
                );
    };

    this.sn = function () {
        return $.ajax({
            url: this.scriptPath,
            async: false,
            type: "POST",
            data: {
                get_sn: '1',
                ip: this.ip
            },
            dataType: "text"
        }).responseText.trim();
    };
};
var generalDeviceInfoTable = function ($parentEl, idDevice) {
    var dfd = jQuery.Deferred();
    var ip, info, sn, access;
    var modelName = getValue('device_model', 'model', 'id_model', getValue('device_list', 'id_model', 'id_device', idDevice));
    getInterfaceList(idDevice)
            .then(function (interfaces) {
                //console.log(interfaces);
                if (interfaces) {
                    for (var id in interfaces) {
                        ip = interfaces[id]['ip'];
                    }
                    info = new GettingInfoFromDevice(modelName, ip);
                    if (info.abilityGettingInfo && (ip !== '' && ip !== '0.0.0.0')) {
                        ping(ip)
                                .then(function (ping) {
                                    access = ping;
                                    console.log('ping: ' + ping);
                                    if (!ping) {
                                        dfd.reject('device not availiable');
                                        return false;
                                    }
                                    return info.general();
                                })
                                .then(function (data) {
                                    console.log(data);
                                    sn = data['S/N'];
                                    $parentEl.html('<div class="section-header">\
                                                        <a class=" collapsed" data-toggle="collapse"  href="#genInfoCollaps" aria-expanded="true" aria-controls="genInfoCollapse">\
                                                            Info From Device\
                                                        </a>\
                                                        <span class="glyphicon glyphicon-chevron-down arrow"></span>\
                                                    </div>\
                                                  <div id="genInfoCollaps"" class="section-content collapse in"></div>\
                                                    ');
                                    $parentEl.find('.section-content').html(createTable('deviceInfoTable', data));
                                    /*check S/N into database*/
                                    return getValueAsync('device_list', 'sn', 'id_device', idDevice)
                                })
                                .then(function (dbSn) {
                                    if (!dbSn && access) {
                                        updateValue('device_list', 'sn', sn, 'id_device', idDevice);
                                        $parentEl.prepend('<div class="info-message"></div>')

                                        infoMessage($parentEl.find('.info-message'),
                                                'Serial number ' + sn + ' add to database'
                                                );

                                    }
                                    dfd.resolve($parentEl);
                                })
                    }
                    else {

                        dfd.reject('can`t get info from device');
                    }
                }
                else {
                    dfd.reject('device haven`t network interface');
                    /*
                     * need be
                     * information from db
                     * 
                     * */
                }

            });
    return dfd.promise();
};
var deviceModuleTable = function ($parentEl, idDevice) {
    var getMondulesInfoFromDB = function (idDevice, callback) {
        return $.post(
                "/ajax",
                {
                    get_modules_info: '1',
                    id_device: idDevice
                },
        callback,
                "json"
                );
    };
    var checkModuleInStock = function (sn) {
        var idModule = getValue('module_list', 'id_module', 'sn', sn);
        return (idModule !== '0') ? idModule : false;
    };
    var checkNewModulesInStock = function ($newModules, idDevice) {
        $newModules.each(function () {
            var idModule,
                    $tr = $(this),
                    sn = $tr.find('.sn').text().trim();
            if (sn !== '') {
                if (idModule = checkModuleInStock(sn)) {
                    updateValue('module_list', 'id_device', idDevice, 'id_module', idModule, function () {
                        $tr.removeClass('warning')
                                .find('.add-module')
                                .remove();
                        alert('bind modules sn ' + sn + ' with new device into device');
                    });
                }
            }
        });
    };
    var pnTd = function (pnFromDevice, pnFromDb) {
        var title = 'add element to database';
        if (pnFromDb.trim() == pnFromDevice.trim()) {
            return '<td>' + pnFromDevice + '</td>';
        }
        else {
            if (pnFromDevice !== '') {
                return    '<td class="info edit" data-item="pn">\
                          <span class="value">' + pnFromDevice + '<span>\
                          <span class="glyphicon glyphicon-pencil td-icon update-el"  title="' + title + '"></span>\
                    </td>';
            }
            else {
                return '<td class="warning">' + pnFromDb + '</td>';
            }
        }
    };
    var createModulesTable = function (infoFromDB, infoFromDevice) {
        var db = infoFromDB,
                device = infoFromDevice,
                sn, exist, pnFromDevice, nameFromDevice, descr, title, tr,
                table = '\
                            <table id="modules" class="table table-bordered">';
        if (db.length !== '0') {
            for (var idModule in db) {
                exist = false;
                sn = db[idModule]['sn'].trim();
                if (sn !== '') {
                    /*check sn into array getting from device*/
                    for (var i in device) {
                        if (device[i]['sn'].trim() == sn) {
                            pnFromDevice = device[i]['pn'];
                            descr = device[i]['descr'];
                            nameFromDevice = device[i]['name'];
                            exist = true;
                            delete device[i];
                            break;
                        }
                    }
                    if (exist) {
                        title = 'add element to database';
                        tr = '<tr data-id-module="' + idModule + '">';
                        tr += (db[idModule]['model'] === nameFromDevice) ?
                                '<td>' + nameFromDevice + '</td>' :
                                '<td class="info edit" data-item="model">\
                                    <span class="value">' + nameFromDevice + '<span>\
                                    <span class="glyphicon glyphicon-pencil td-icon"></span>\
                                </td>';
                        tr += '<td>' + sn + '</td>';
                        tr += pnTd(pnFromDevice, db[idModule]['pn']);
                        tr += '<td>' + descr + '</td>';
                        table += tr;

                    }
                    else {
                        table += '<tr class="danger" data-id-module="' + idModule + '">\
                               <td>' + db[idModule]['model'] + '</td>\
                               <td>' + db[idModule]['sn'] + '</td>\
                               <td>' + db[idModule]['pn'] + '</td>\
                               <td></td>\
                           </tr>';
                    }
                }
                else {
                    table += '<tr class="" data-id-module="' + idModule + '">\
                               <td>' + db[idModule]['model'] + '</td>\
                               <td class="danger">' + db[idModule]['sn'] + '</td>\
                               <td>' + db[idModule]['pn'] + '</td>\
                               <td></td>\
                           </tr>';
                }
            }
        }
        for (var j in device) {
            title = 'add module to database';
            table += '<tr class="warning new-modules">\
                                <td class="edit">\
                                    <span class="name">' + device[j]['name'] + '<span>\
                                   <span class="glyphicon glyphicon-plus td-icon add-module" title="' + title + '"></span>\
                                </td>\
                               <td class="sn">' + device[j]['sn'] + '</td>\
                               <td class="pn">' + device[j]['pn'] + '</td>\
                               <td>' + device[j]['descr'] + '</td>\
                           </tr>';
        }
        table += '</table>';
        return table;
    };
    //$parentEl.off('.cards', '**');
    $parentEl.on('click.cards', '.add-module', function () {
        var $tr = $(this).closest('tr'),
                moduleModel = $tr.find('.name').text().trim(),
                sn = $tr.find('td.sn').text().trim(),
                pn = $tr.find('td.pn').text().trim();
        var form = new Form('module');
        form.getForm($('#addModuleToDB'), {model: moduleModel, sn: sn, pn: pn})
                .then(function () {
                    $('#modalWindow').animate({
                        scrollTop: $('#addForm').offset().top
                    }, 1000);
                    return form.eventListener();
                })
                .then(function (idModule) {
                    return updateValue('module_list', 'id_device', idDevice, 'id_module', idModule);
                })
                .then(function () {
                    $tr.removeClass('warning')
                            .find('span.add-module')
                            .remove();
                    $('#modules').prepend($tr);
                });
    });
    $parentEl.on('click.cards', '.update-el', function () {
        var $tr = $(this).closest('tr'),
                $td = $(this).closest('td'),
                item = $td.data('item'),
                value = $td.find('.value').text(),
                idModule = $tr.data('idModule');
        updateValue('module_list', item, value, 'id_module', idModule, function () {
            $td.removeClass('info')
                    .text(value);
        });
    });

    var dfd = jQuery.Deferred();
    var infoFromDevice, ip, info;
    var modelName = getValue('device_model', 'model', 'id_model', getValue('device_list', 'id_model', 'id_device', idDevice));
    $parentEl.html('\
    <div class="section-header">\
        <a class=" collapsed" data-toggle="collapse"  href="#cardsCollapse" aria-expanded="true" aria-controls="cardsCollapse">\
            Device cards\
        </a>\
        <span class="glyphicon glyphicon-chevron-down arrow"></span>\
    </div>\
    <div id="cardsCollapse" class="section-content collapse in"></div>\
    <div id="addModuleToDB"></div>\n\
    ');
    getInterfaceList(idDevice)
            .then(function (interfaces) {
                //console.log(interfaces);
                if (interfaces) {
                    for (var id in interfaces) {
                        ip = interfaces[id]['ip'];
                    }
                    info = new GettingInfoFromDevice(modelName, ip);
                    if (info.abilityGettingInfo && (ip !== '' && ip !== '0.0.0.0')) {
                        ping(ip)
                                .then(function (ping) {
                                    // console.log(ping,ip);
                                    if (!ping) {
                                        dfd.reject('device not availiable');
                                        return false;
                                    }
                                    return info.getModulesInfo();
                                })
                                .then(function (info) {
                                    infoFromDevice = info;
                                    //console.log(info);
                                    if (!infoFromDevice) {
                                        dfd.reject('device haven\'t inner card');
                                        return false;
                                    }
                                    return  getMondulesInfoFromDB(idDevice);
                                })
                                .then(function (infoFromDB) {
//                                    console.log(infoFromDB);
                                    var $newModules = $parentEl.find('.section-content').html(createModulesTable(infoFromDB, infoFromDevice));
                                    if ($newModules.length !== 0) {
                                        checkNewModulesInStock($newModules, idDevice);
                                    }
                                    dfd.resolve($newModules);
                                    //dfd.always($parentEl.off('.cards', '**'));
                                });
                    }
                    else {

                        dfd.reject('can`t get info from device');
                    }
                }
                else {
                    dfd.reject('device haven`t network interface');
                    /*
                     * need be
                     * information from db
                     * 
                     * */
                }

            });
    return dfd.promise();
};
var netInterfaceInfo = function ($parentEl, idDevice) {
    var dfd = jQuery.Deferred(),
            count, status, field, ip, host,
            field = '\
                        <center>\
                            <div class="int-info edit">\
                                <span class="glyphicon glyphicon-chevron-up show-hide"></span>\
                                <span class="glyphicon glyphicon-edit edit-descr"></span>\
                                <div class="status"></div>\
                                <div class="medium">\
                                    <span class="ip-address"></span>\
                                    <span class="host"></span>\
                                </div>\
                                <div class="description"></div>\
                            </div>\
                        </center>';
    getInterfaceList(idDevice)
            .then(function (interfaces) {
                count = Object.keys(interfaces).length;
                if (count === 1) {
                    for (var id in interfaces) {
                        ip = interfaces[id]['ip'];
                        host = interfaces[id]['host'];
                        ping(ip)
                                .then(function (ping) {
                                    status = ping ?
                                            '<div class="positive big">device available</div>' :
                                            '<div class="negative big">device not available</div>';
                                    $parentEl.html(field)
                                            .find('.status')
                                            .html(status);
                                    $parentEl.find('.ip-address')
                                            .html('<a href="http://' + ip + '" target="_blank">' + ip + '</a>')
                                    $parentEl.find('.host')
                                            .text(host);
                                    dfd.resolve($parentEl);
                                });
                    }
                }
                else if (count > 1) {
                    $parentEl.html('<div id="intList" class="medium">');
                    for (var id in interfaces) {
                        ip = interfaces[id]['ip'];
                        host = interfaces[id]['host'];
                        $parentEl.find('#intList')
                                .append(field);
                        var $intField = $parentEl.find('center:last-of-type()')

                        $intField
                                .find('.ip-address')
                                .html('<a href="http://' + ip + '" target="_blank">' + ip + '</a>');
                        $intField
                                .find('.host')
                                .text(host);
                        $intField
                                .find('.description')
                                .attr('data-id-interface', id);
                        $intField
                                .find('.int-info')
                                .addClass('info-datasheet');
                    }
                }
                $parentEl.find('#intList center').each(function () {
                    var $tr = $(this),
                            ip = $tr.find('.ip-address a').text().trim();
                    ping(ip)
                            .then(function (ping) {
                                status = ping ?
                                        '<div class="positive big">available</div>' :
                                        '<div class="negative big">not available</div>';
                                $tr.find('.status')
                                        .html(status);
                            });
                });
                dfd.resolve($parentEl);
//                dfd.always($parentEl.off('.descr', '**'))
            });
    $parentEl.on('click.descr', 'span.show-hide', function () {
        var $icon = $(this),
                $descr = $icon.closest('.int-info').find('.description'),
                idInterface = $descr.data('idInterface'),
                text;

        if ($descr.is(':hidden')) {
            $icon
                    .addClass('glyphicon-chevron-down')
                    .removeClass('glyphicon-chevron-up');
            if ($descr.is(':empty')) {
                text = getValue('interfaces', 'comment', 'id_interface', idInterface);
                text = (text !== '0') ? text : '';
                $descr.html(text);
            }
            $descr.slideDown();
        }
        else {
            $icon
                    .addClass('glyphicon-chevron-up')
                    .removeClass('glyphicon-chevron-down');
            $descr.slideUp();
        }
    });
    $parentEl.on('click.descr', 'span.edit-descr', function () {
        var $icon = $(this),
                $descr = $icon.closest('.int-info').find('.description'),
                idInterface = $descr.data('idInterface'),
                text = getValue('interfaces', 'comment', 'id_interface', idInterface);
        text = (text !== '0') ? text : '';
        $descr.html('<textarea class="descr" placeholder="Interface description"></textarea>\
                     <center><button class="btn a-btn submit">Write</button></center>');

        $descr
                .find('textarea')
                .val(text);
        if ($descr.is(':hidden')) {
            $icon
                    .closest('.int-info')
                    .find('.show-hide')
                    .click();
        }
    });
    $parentEl.on('click.descr', '.submit', function () {
        var $button = $(this),
                $descrField = $button.closest('.description'),
                idInterface = $descrField.data('idInterface'),
                text = $descrField.find('textarea').val();
        updateValueList('interfaces', {comment: text}, 'id_interface', idInterface)
                .then(function () {
                    $descrField.html(text);
                });
    });
    return dfd.promise();
};
var getMainInfo = function ($parentEl, type, id) {
    var param,
            dfd = jQuery.Deferred();
    if (type === 'device' || this.type === '') {
        param = {
            table: 'device_list',
            type: 'device',
            idField: 'id_device'
        };
    }
    else if (type === 'module') {
        param = {
            table: 'module_list',
            type: 'module',
            idField: 'id_module'
        };
    }
    /*comment action*/
    $parentEl.on('click.info', '.write', function () {
        var $content = $parentEl.find('.section-content'),
                $header = $parentEl.find('.section-header');
        $(this).addClass('hide');
        $parentEl.find('.section-header')
                .find('.save')
                .removeClass('hide');
        console.log($parentEl, $content)
        $content.summernote();
        $header.find('a').attr('data-toggle', false);
    });

    $parentEl.on('click.info', '.save', function () {
        var $btn = $(this),
                $content = $parentEl.find('.section-content'),
                $header = $parentEl.find('.section-header'),
                text = $content.summernote('code');
        updateValue(param.table, 'comment', text, param.idField, id, function (data) {
            $content.summernote('destroy');
            $header
                    .find('.save')
                    .addClass('hide');
            $header
                    .find('.write')
                    .removeClass('hide');
        });
        $header.find('a').attr('data-toggle', 'collapse');
    });
    $.post(
            "/ajax",
            {
                get_info: type,
                id: id
            },
    function (body) {
        dfd.resolve($parentEl.html(body));
    });
    return dfd.promise();
};
var patchPanelForm = function ($parentEl, idRack, topSlot, callback) {
    var dfd = $.Deferred();
    var modelList = new List('patchpanel_model', 'id_model', 'name');
    var body = '<div id="addForm" class="border"><div id="searchField"></div>\
               <div align="right">\
                    <button type="button" class="btn btn-primary submit">Insert patch panel</button>\
               </div></div>';
    $parentEl.html(body);
    modelList.getElementsDropDown($parentEl.find('#searchField'));
    $parentEl.off('click.panel', 'button.submit');
    $parentEl.on('click.panel', 'button.submit', function () {
        var idModel = modelList.getElementId(),
                idPatchpanel;
        if (idModel !== '0') {
            idPatchpanel = insertValue('patchpanel_list', 'id_model', idModel);
            updateValue('patchpanel_list', 'id_rack', idRack, 'id_patchpanel', idPatchpanel)
                    .then(function () {
                        return updateValue('patchpanel_list', 'unit', topSlot, 'id_patchpanel', idPatchpanel);
                    })
                    .then(function () {
                        $parentEl.empty();
                        dfd.resolve($parentEl);
                        if (callback && typeof (callback) === "function") {
                            callback();
                        }
                    });
        }
        else {
            modelList.focusToInputField();
        }
    });
    return dfd.promise();
};
var LabdeskForm = function (idLabdesk) {
    var modelList = new List('device_model', 'id_model', 'model');
    this.getForm = function ($parentEl, callback) {
        var dfd = jQuery.Deferred();
        this.$parentEl = $parentEl;
        $.post('/ajax', {get_labdesk_device_form: '1'})
                .then(function (body) {
                    $parentEl.html(body);
                    return modelList.getElementsDropDown($parentEl.find('#searchField'));
                })
                .then(function () {
                    if (callback && typeof (callback) === "function") {
                        callback($parentEl);
                    }
                    dfd.resolve($parentEl);
                })
        return dfd.promise();
    }
    this.eventListener = function (callback) {
        var dfd = jQuery.Deferred(),
                $parentEl = this.$parentEl;
        $parentEl.on('click.add', 'button.submit-labdesk-device', function () {
            var idModel = modelList.getElementId(),
                    $btn = $(this),
                    modelName = modelList.getInputVal(),
                    idDeviceInLabdesk,
                    modelForm = new ModelForm('device');
            if (modelName !== '') {
                var promise = $.when();
                if (idModel === '0') {
                    promise = promise
                            .then(function () {
                                return $.confirm("<center>" + modelName + " not exist in the db.\n Add '" + modelName + "' to model database?</center>");
                            })
                            .then(
                                    function () {
                                        /*model form*/
                                        $btn.hide();
                                        $parentEl.find('input').attr('disabled', 'disabled');
                                        $parentEl.find('button').attr('disabled', 'disabled');
                                        $('#modalWindow').css('overflow-y', 'auto');
                                        infoMessage($parentEl.find('.info-field'),
                                                "<center> Add model <b>" + modelName + "</b> to database.</center>");
                                        return modelForm.getForm($parentEl.find('#modelForm'), {model: modelName}, slideToEl($('#modalWindow'), $parentEl.find('.info-field')));
                                    },
                                    function () {
                                        modelList.focusToInputField();
                                        return $.Deferred();
                                    }
                            )
                            .then(function () {
                                return modelForm.eventListener();
                            })
                            .then(function (id) {
                                idModel = id;
                                return $.when();
                            })                          
                }
                promise
                        .then(function () {
                            idDeviceInLabdesk = insertValue('devices_in_labdesks', 'id_model', idModel);
                            return updateValue('devices_in_labdesks', 'id_labdesk', idLabdesk, 'id_device_in_labdesk', idDeviceInLabdesk);
                        })
                        .then(function () {
                            $parentEl.empty();
                            dfd.resolve(idDeviceInLabdesk);
                            dfd.always($parentEl.off('.add', '**'));
                            if (callback && typeof (callback) === "function") {
                                callback(idDeviceInLabdesk);
                            }
                        });
            }
            else {
                modelList.focusToInputField();
                return false;
            }
        });
        return dfd.promise();
    }
    this.getBody = function () {
        return this.$parentEl.find('#addForm');
    };
    this.modelName = function () {
        return modelList.getInputVal();
    };
};
var interfaceForm = function () {
    this.getForm = function ($parentEl, idDevice, callback) {
        var dfd = jQuery.Deferred();
        this.$parentEl = $parentEl;
        this.idDevice = idDevice;
        $.post(
                "/ajax",
                {
                    get_interface_form: '1',
                    id_device: idDevice
                },
        function (form) {
            $parentEl.html(form);
            dfd.resolve($parentEl);
            if (callback && typeof (callback) === "function") {
                callback();
            }
        });
        return dfd.promise();
    };
    this.eventListener = function (callback) {
        var dfd = jQuery.Deferred(),
                $parentEl = this.$parentEl,
                idDevice = this.idDevice,
                intForm = '\
                <div class="interface" data-id-interface="0" >\
                    <button type="button" class="close field remove-interface"><span>&times;</span></button>\
                    <table class="table no-border">\
                        <tr>\
                            <td class="name">IP:</td>\
                            <td>\
                                <input type="text" class="form-control ip" value="">\
                            </td>\
                        </tr>\
                        <tr>\
                            <td class="name">Hostname:</td>\
                            <td>\
                                <input type="text" class="form-control hostname" value="">\
                            </td>\
                        </tr>\
                        <tr>\
                            <td class="name">Type:</td>\
                            <td class="type">\
                                <select class="form-control int-type">\
                                    <option value="1">Physical</option>\
                                    <option value="3">Hypervisor</option>\
                                </select>\
                            </td>\
                        </tr>\
                    </table>\
                    <div class="info-field"></div>\
                    <div class="wrap-add-virtual" align="right"></div>\
                 </div>',
                virtForm = '\
                   <div class="virt" data-id-virtual-mashine="0">\
                    <button type="button" class="close field remove-virtual"><span>&times;</span></button>\
                    <table class="table no-border">\
                        <tr>\
                            <td class="name">Ip:</td>\
                            <td>\
                                <input name="virt_ip" type="text" class="form-control" value="">\
                            </td>\
                        </tr>\
                        <tr>\
                            <td class="name">Hostname:</td>\
                            <td>\
                                <input name="virt_host" type="text" class="form-control" value="">\
                            </td>\
                        </tr>\
                        <tr>\
                            <td class="name">OS:</td>\
                            <td>\
                                <input name="os" type="text" class="form-control" value="">\
                            </td>\
                        </tr>\
                    </table>\
                    <div class="info-virt-field"></div>\
                </div>\
                 ';
        $parentEl.off('.interface', '**');
        $parentEl.on('click.interface', '.add-interface', function () {
            $(this).before(intForm);
        });
        $parentEl.on('click.interface', '.add-virtual', function () {
            $(this).before(virtForm);
        });
        $parentEl.on('click.interface', '.remove-interface', function () {

            var $interface = $(this).closest('.interface'),
                    idInterface = $interface.data('idInterface');
            if (idInterface !== 0) {
                $.confirm("Do you want to remove network interface")
                        .then(function () {
                            return deleteValue('interfaces', 'id_interface', idInterface)
                        })
                        .then(function () {
                            return $interface.fadeOut();
                        })
                        .then(function () {
                            $interface.remove()

                        })
            }
            else {
                $interface.fadeOut(function () {
                    $interface.remove()
                });
            }
        });
        $parentEl.on('click.interface', '.remove-virtual', function () {
            var $interface = $(this).closest('.virt'),
                    idVirtualMashine = $interface.data('idVirtualMashine');
            if (idVirtualMashine !== 0) {
                $.confirm("Do you want to remove virtual host")
                        .then(function () {
                            return  deleteValue('virtual_mashines', 'id_virtual_mashine', idVirtualMashine);
                        })
                        .then(function () {
                            return $interface.fadeOut();
                        })
                        .then(function () {
                            $interface.remove();

                        })
            }
            else {
                $interface.fadeOut(function () {
                    $interface.remove()
                });
            }
        });
        $parentEl.on('change.interface', 'select.int-type', function () {
            var $intField = $(this).closest('.interface');

            switch ($(this).val()) {
                case '1':
                    $intField.find('.add-virtual')
                            .fadeOut();
                    break;
                case '3':
                    console.log($(this).val(), $intField);
                    $intField.find('.wrap-add-virtual')
                            .html('<a class="btn a-btn add-virtual">\
                                    <span class="glyphicon glyphicon-plus small black"></span>Add virtual host\
                                  </a>')
                    break;
            }
        });
        $parentEl.on('click.interface', '.submit', function () {
            var ipPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                    count = 0,
                    valid = true;

            /*check ip interface addresss*/
            $parentEl.find('.ip').each(function () {
                var $input = $(this),
                        $interface = $input.closest('.interface'),
                        ip = $input.val().trim();
                count++;
                /*ip field validation*/
                if (ip !== '' && ip !== '0.0.0.0') {
                    if (!ipPattern.test(ip)) {
                        $input.css({'border': 'solid 2px red'});
                        setTimeout(function () {
                            $input.css({'border': 'solid 1px #ccc'});
                        }, 2000);
                        valid = false;
                    }
                    else {
                        /*chek availiability ip*/
                        var ipCurrent = getValue('interfaces', 'ip', 'id_interface', $interface.data('idInterface'));
                        var device = getDeviceThatUseIp(ip);
                        if (device && (ip !== ipCurrent)) {
                            warnMessage(
                                    $interface.find('.info-field'),
                                    '<br>Device exist with ip <b>' + ip + '</b>.<br>\
                             Model: <b>' + device['model'] + '</b>, location: <b>' + device['descr'] + '</b>',
                                    function () {
                                        $input.focus();
                                    }

                            );
                            valid = false;
                        }
                    }

                }
                else {
                    $input.focus();
                    valid = false;
                    return false;
                }
                /*Check Virtual hosts addresses*/
                if ($interface.find('.virt').length > 0) {
                    $interface.find('.virt').each(function () {
                        var $virt = $(this),
                                $input = $virt.find('[name="virt_ip"]'),
                                ip = $input.val().trim(),
                                idVirtualMashine = $virt.data('idVirtualMashine');
                        /*ip field validation*/
                        if (ip !== '' && ip !== '0.0.0.0') {
                            if (!ipPattern.test(ip)) {
                                $input.css({'border': 'solid 2px red'});
                                setTimeout(function () {
                                    $input.css({'border': 'solid 1px #ccc'});
                                }, 2000);
                                valid = false;
                            }
                            else {
                                /*chek availiability ip*/
                                var ipCurrent = getValue('virtual_mashines', 'virt_ip', 'id_virtual_mashine', idVirtualMashine);
                                var device = getDeviceThatUseIp(ip);
                                if (device && (ip !== ipCurrent)) {
                                    warnMessage(
                                            $virt.find('.info-virt-field'),
                                            '<br>Device exist with ip <b>' + ip + '</b>.<br>\
                             Model: <b>' + device['model'] + '</b>, location: <b>' + device['descr'] + '</b>',
                                            function () {
                                                $input.focus();
                                            }
                                    );
                                    valid = false;
                                }
                            }
                        }
                        else {
                            $input.focus();
                            valid = false;
                            return false;
                        }
                    });
                }
            });
            if (valid === true) {
                /*insert/update interface value*/
                $parentEl.find('.interface').each(function (index) {
                    var $interface = $(this),
                            ip = $interface.find('.ip').val().trim(),
                            host = $interface.find('.hostname').val().trim(),
                            idType = $interface.find('.type :selected').val(),
                            idInterface = $interface.data('idInterface') !== 0 ? $interface.data('idInterface') : insertValue('interfaces', 'id_device', idDevice);
                    console.log($interface.data('idInterface'), idInterface, idDevice);
                    updateValueList('interfaces', {ip: ip, host: host, id_type: idType}, 'id_interface', idInterface)
                            .then(function () {
                                if ((count - 1) === index) {
                                    $parentEl.empty();
                                    if (callback && typeof (callback) === "function") {
                                        callback();
                                    }
                                    dfd.resolve(ip);
                                    dfd.always($parentEl.off('.interface', '**'));
                                }
                                /*insert/update virtual hosts value*/
                                if ($interface.find('.virt').length > 0) {
                                    $interface.find('.virt').each(function () {
                                        var $virt = $(this),
                                                ip = $virt.find('[name="virt_ip"]').val().trim(),
                                                host = $virt.find('[name="virt_host"]').val().trim(),
                                                os = $virt.find('[name="os"]').val().trim(),
                                                idVirtualMashine = $virt.data('idVirtualMashine') !== 0 ? $virt.data('idVirtualMashine') : insertValue('virtual_mashines', 'id_interface', idInterface);
                                        console.log(ip, host, os, idVirtualMashine);
                                        updateValueList('virtual_mashines', {virt_ip: ip, virt_host: host, os: os}, 'id_virtual_mashine', idVirtualMashine);
                                    });
                                }
                            });
                });
            }
            else {
                return false;
            }
        });
        return dfd.promise();
    };

};

var Form = function (type, callback) {
    var param,
            idGlobalLocation = getIdGlobalLocation();
    this.type = type;

    if (this.type === 'device' || this.type === '') {
        param = {
            tableModel: 'device_model',
            type: 'device',
            tableList: 'device_list',
            idField: 'id_device'
        };
    }
    else if (this.type === 'module') {
        param = {
            tableModel: 'module_model',
            type: 'module',
            tableList: 'module_list',
            idField: 'id_module'
        };
    }
    var modelList = new List(param.tableModel, 'id_model', 'model');
    var ownerList = new List('staff', 'id_employee', 'employee_name');
    var teamList = new List('team', 'id_team', 'team_name');

    this.getForm = function ($parentEl, options, callback) {
        /*define method argument*/
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        else if (options === undefined) {
            options = {};
        }
        /***********************************/
        var dfd = jQuery.Deferred(),
                /*form can be for add new device or edit old*/
                action = (options.id !== undefined) ? 'update' : 'insert';
        this.$parentEl = $parentEl;
        this.id = options.id;
        this.action = action;

        $.post(
                "/ajax",
                {
                    get_add_new_to_stock: param.type
                },
        function (data) {
            $parentEl.html(data);
            if (action === 'update')
            {
                getValues(param.tableList, param.idField, options.id)
                        .then(function (values) {
                            if (values) {
                                console.log(values);
                                /*Section with dropdown elements*/
                                ownerList.getElementsDropDown($('#deviceOwner'), function () {
                                    ownerList.setElementId(values.id_owner);
                                    if (values.id_owner !== '0') {
                                        ownerList.setInputVal(getValue('staff', 'employee_name', 'id_employee', values.id_owner));
                                    }

                                });
                                modelList.getElementsDropDown($('#modelDevice'), function () {
                                    modelList.setElementId(values.id_model);
                                    if (values.id_model !== '0') {
                                        modelList.setInputVal(getValue(param.tableModel, 'model', 'id_model', values.id_model));
                                    }
                                });
                                teamList.getElementsDropDown($('#deviceTeam'), function () {
                                    teamList.setElementId(values.id_team);
                                    if (values.id_team !== '0') {
                                        teamList.setInputVal(getValue('team', 'team_name', 'id_team', values.id_team));
                                    }
                                });
                                /*device/card description section*/
                                if (values.comment !== undefined) {
                                    $parentEl.find('#comment').html(values.comment)
                                    /*Add editor for textarea element*/
                                    $parentEl.find('#comment').summernote();
                                }
                                /*other field*/
                                for (var value in values) {
                                    $parentEl.find('[name=' + value + ']').val(values[value]);
                                }
                                dfd.resolve($parentEl);
                                if (callback && typeof (callback) === "function") {
                                    callback();
                                }
                            }
                        });
            }
            else if (action === 'insert') {
                ownerList.getElementsDropDown($('#deviceOwner'), function () {
                    if (options.owner !== undefined) {
                        ownerList.setInputVal(options.owner);
                        ownerList.setElementId(getValue('staff', 'id_employee', 'employee_name', options.owner));
                    }
                });
                modelList.getElementsDropDown($('#modelDevice'), function () {
                    if (options.model !== undefined) {
                        modelList.setInputVal(options.model);
                        modelList.setElementId(getValue(param.tableModel, 'id_model', 'model', options.model));
                    }
                });
                teamList.getElementsDropDown($('#deviceTeam'), function () {
                    if (options.team !== undefined) {
                        teamList.setInputVal(options.team);
                        teamList.setElementId(getValue('team', 'id_team', 'team_name', options.team));
                    }
                });
                for (var option in options) {
                    $parentEl.find('#' + option + ' input').val(options[option]);
                }
                $parentEl.find('#comment').summernote();
                dfd.resolve($parentEl);
                if (callback && typeof (callback) === "function") {
                    callback();
                }
            }
        });
        return dfd.promise();
    };
    this.eventListener = function () {
        var $parentEl = this.$parentEl,
                action = this.action,
                idElement = this.id,
                modelForm = new ModelForm('device'),
                dfd = jQuery.Deferred();
        $parentEl.on('click.form', 'button.submit', function () {
            var $btn = $(this),
                    $form = $btn.closest('#addForm'),
                    $inputs = $form.find('.value'),
                    idEmployee = ownerList.getElementId(),
                    idModel = modelList.getElementId(),
                    idTeam = teamList.getElementId(),
                    comment = $parentEl.find('#comment').summernote('code'),
                    item,
                    value,
                    modelName,
                    count,
                    modelName = modelList.getInputVal(),
                    ownerName = ownerList.getInputVal(),
                    teamName = teamList.getInputVal();

            if (modelName !== '') {
                /**checking the existence of team and owner**/
                var promise = $.when();
                if (idEmployee === '0' && ownerName !== '') {
                    promise = promise
                            .then(function () {
                                return $.confirm("<center><b>" + ownerName + "</b> not exist in the db.\n Add employee <b>'" + ownerName + "'</b> to database?</center>");
                            })
                            .then(
                                    function (result) {
                                        idEmployee = ownerList.addElementToDb(ownerName);
                                    },
                                    function (result) {
                                        return $.when();
                                    }
                            );
                }
                if (idTeam === '0' && teamName !== '') {
                    promise = promise
                            .then(function () {
                                return $.confirm("center><b>" + teamName + "</b> not exist in the db.\n Add team <b>'" + teamName + "'</b> to database?</center>");
                            })
                            .then(
                                    function (result) {
                                        idTeam = teamList.addElementToDb(teamName);
                                    },
                                    function (result) {
                                        return $.when();
                                    }
                            );
                }
                if (idModel === '0') {
                    promise = promise
                            .then(function () {
                                return $.confirm("<center><b>" + modelName + "</b> not exist in the db.<br/> Add <b>'" + modelName + "'</b> to model database?</center>");
                            })
                            .then(
                                    function () {
                                        /*model form*/
                                        $btn.hide();
                                        $form.find('input').attr('disabled', 'disabled');
                                        $form.find('button').attr('disabled', 'disabled');
                                        $('#modalWindow').css('overflow-y', 'auto');
                                        infoMessage($parentEl.find('.info-field'),
                                                "<center> Add model <b>" + modelName + "</b> to database.</center>");
                                        return modelForm.getForm($parentEl.find('#modelForm'), {model: modelName}, slideToEl($('#modalWindow'), $parentEl.find('.info-field')));
                                    },
                                    function () {
                                        /*focus on model name input and exit from chain*/
                                        modelList.focusToInputField();
                                        return $.Deferred();
                                    }
                            )
                            .then(function () {
                                return modelForm.eventListener();
                            })
                            .then(function (id) {
                                idModel = id;
                                return $.when();
                            })
                }
                if (action === 'insert') {
                    promise = promise
                            .then(function () {
                                idElement = insertValue(param.tableList, 'id_model', idModel);
                                return $.when();
                            })
                }
                promise = promise
                        .then(function () {
                            return updateValueList(param.tableList,
                                    {id_model: idModel,
                                        id_team: idTeam,
                                        id_owner: idEmployee,
                                        id_global_location: idGlobalLocation,
                                        sn: $parentEl.find('[name="sn"]').val(),
                                        pn: $parentEl.find('[name="pn"]').val(),
                                        asset_gl: $parentEl.find('[name="asset_gl"]').val(),
                                        asset_harmonic: $parentEl.find('[name="asset_harmonic"]').val(),
                                        comment: comment
                                    },
                            param.idField, idElement);
                        });
                console.log(promise);
                promise
                        .then(function () {
                            $parentEl.empty();
                            console.log('resolve', idElement)
                            dfd.resolve(idElement);
                            dfd.always($parentEl.off('.form', '**'));
                            if (callback && typeof (callback) === "function") {
                                callback(idElement);
                            }
                        });
            }
            else {
                modelList.focusToInputField();
            }

        });
        $parentEl.on('click.form', '#closeForm', function () {
            $(this).closest('#addForm').remove();
            $parentEl.off('.form', '**');
        });
        return dfd.promise();
    };
};
var RackForm = function () {
    var labList = new List('labs', 'id_lab', 'lab_name');
    this.getForm = function ($parentEl, callback) {
        var dfd = jQuery.Deferred();
        this.$parentEl = $parentEl;
        $.post(
                "/ajax",
                {
                    get_add_new_rack: '1'
                },
        function (data) {
            $parentEl.html(data);
            labList.getElementsDropDown($parentEl.find('#location'))
            dfd.resolve($parentEl);
            if (callback && typeof (callback) === "function") {
                callback();
            }
        });
        return dfd.promise()
    };
    this.eventListener = function (callback) {
        var $parentEl = this.$parentEl;
        var dfd = jQuery.Deferred();
        $parentEl.on('click.rack', 'button.submit', function () {
            var $form = $(this).closest('#addForm'),
                    $inputs = $form.find('.value'),
                    idLab = labList.getElementId(),
                    rackName = $form.find('.rack-name').val().trim(),
                    numOfUnit = $form.find('.number-of-units').val().trim(),
                    idRack, idBackRack,
                    numOfUnitPattern = /^\d+$/,
                    permission = true,
                    idGlobalLocation=getIdGlobalLocation(),
                    labName = labList.getInputVal();

            if (!numOfUnitPattern.test(numOfUnit) || numOfUnit == '0') {
                $parentEl.find('input.number-of-units').css({'border': 'solid 2px red'});
                setTimeout(function () {
                    $parentEl.find('input.number-of-units').css({'border': 'solid 1px #ccc'});
                }, 2000);
                permission = false;
            }
            if (rackName !== '' && permission === true) {
                var promise=$.when();
                /**checking the existence of labs**/
                if (idLab === '0') {
                    if (labName === '') {
                        infoMessage($parentEl.find('.info-field'), 'Choose <b>location</b> or add new one', function () {
                            labList.focusToInputField();
                        });
                        return false;
                    }
                    else {
                        promise = promise
                                .then(function () {
                                    return $.confirm("<center><b>" + labName + "</b> not exist in the db.<br/> Add lab <b>'" + labName + "'</b> to database?</center>");
                                })
                                .then(
                                        function () {
                                            idLab = labList.addElementToDb(labName);
                                            return $.when();
                                        },
                                        function () {
                                            infoMessage($parentEl.find('.info-field'), 'Choose location or add new one', function () {
                                                labList.focusToInputField();
                                            });
                                            return $.Deferred();
                                        }
                                )
                                .then(function () {
                                    return updateValue('labs','id_global_location',idGlobalLocation,'id_lab',idLab);
                                })
                    }
                }
                promise
                        .then(function () {
                            idBackRack = insertValueList('rack', {'name': rackName + ' back', number_of_unit: numOfUnit, id_lab: idLab});
                            idRack = insertValueList('rack', {'name': rackName, number_of_unit: numOfUnit, id_back_rack: idBackRack, id_lab: idLab});
                            dfd.resolve(idRack);
                            dfd.always($parentEl.off('.rack', '**'));
                            if (callback && typeof (callback) === "function") {
                                callback(idRack);
                            }
                            $parentEl.empty();
                        });
            }
            else {
                $form.find('.rack-name').focus();
            }
        });
        $parentEl.on('click.rack', '#closeForm', function () {
            $(this).closest('#addForm').remove();
            $parentEl.off('.rack', '**');
        });
        return dfd.promise();
    };
};
var EmployeeForm = function () {
    var teamList = new List('team', 'id_team', 'team_name');
    this.getForm = function ($parentEl, options, callback) {
        if (typeof options === 'function') {
            /*define method argument*/
            callback = options;
            options = {};
        }
        else if (options === undefined) {
            options = {};
        }
        /***********************************/
        var action = (options.id_employee !== undefined) ? 'update' : 'insert',
                dfd = jQuery.Deferred();
        this.$parentEl = $parentEl;
        this.idEmployee = options.id_employee;
        this.action = action;
        $.post(
                "/ajax",
                {
                    get_employee_form: '1'
                },
        function (data) {
            $parentEl.html(data);
            if (action === 'update') {
                getValues('staff', 'id_employee', options.id_employee)
                        .then(function (values) {
                            if (values) {
                                console.log(values);
                                /*team name section*/
                                teamList.getElementsDropDown($parentEl.find('#team'), function () {
                                    teamList.setElementId(values.id_team);
                                    getValueAsync('team', 'team_name', 'id_team', values.id_team)
                                            .then(function (id) {
                                                if (id) {
                                                    teamList.setInputVal(id);
                                                }
                                            })
                                });
                                /*other field*/
                                for (var value in values) {
                                    $parentEl.find('input[name=' + value + ']').val(values[value]);
                                }
                            }
                            dfd.resolve($parentEl);
                            if (callback && typeof (callback) === "function") {
                                callback();
                            }
                        });
            } else if (action === 'insert') {
                teamList.getElementsDropDown($parentEl.find('#team'), function () {
                    if (options.team !== undefined) {
                        teamList.setInputVal(options.team);
                        teamList.setElementId(getValue('team', 'id_team', 'team_name', options.team));
                    }
                });
                for (var option in options) {
                    $('#' + option + ' input').val(options[option]);
                }
                dfd.resolve($parentEl);
                if (callback && typeof (callback) === "function") {
                    callback();
                }
            }
        });
        return dfd.promise();
    };
    this.eventListener = function (callback) {
        var $parentEl = this.$parentEl,
                dfd = jQuery.Deferred(),
                action = this.action,
                idEmployee = this.idEmployee;
        $parentEl.on('click.employee', 'button.submit-employee', function () {
            var idTeam = teamList.getElementId(),
                    name = $parentEl.find('#name input').val().trim(),
                    teamName = teamList.getInputVal(),
                    idGlobalLocation = getIdGlobalLocation();
            if (name !== '') {
                var promise = $.when();
                if (idTeam === '0') {
                    if (teamName === '') {
                        promise = promise
                                .then(function () {
                                    return $.when();
                                });
                    }
                    else {
                        promise = promise
                                .then(function () {
                                    return $.confirm("<center><b>" + teamName + "</b> not exist in the db.<br/> Add team <b>'" + teamName + "'</b> to database?</center>");
                                })
                                .then(
                                        function () {
                                            idTeam = teamList.addElementToDb(teamName);
                                            return $.when();
                                        },
                                        function () {
                                            teamList.focusToInputField();
                                            return $.Deferred();
                                        }
                                )
                                .then(function () {
                                    return updateValue('team', 'id_global_location', idGlobalLocation, 'id_team', idTeam);
                                })
                    }
                }
                if (action === 'insert') {
                    promise = promise
                            .then(function () {
                                idEmployee = insertValue('staff', 'employee_name', name);
                                return $.when();
                            })
                }
                promise 
                        .then(function () {
                            return updateValueList('staff', {employee_name: name, id_team: idTeam,id_global_location:idGlobalLocation}, 'id_employee', idEmployee);
                        })
                        .then(function () {
                            dfd.resolve(idEmployee);
                            dfd.always($parentEl.off('.employee', '**'));
                            if (callback && typeof (callback) === "function") {
                                callback(idEmployee);
                            }
                            $parentEl.empty();
                        });
            }
        });
        $parentEl.on('click.employee', '#closeForm', function () {
            $(this).closest('#addForm').remove();
            $parentEl.off('.employee', '**');
        });
        return dfd.promise();
    };
};
var TeamForm = function (callback) {
    this.getForm = function ($parentEl, options, callback) {
        /*define method argument*/
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        else if (options === undefined) {
            options = {};
        }
        /***********************************/
        var dfd = jQuery.Deferred();
        this.$parentEl = $parentEl;
        $.post(
                "/ajax",
                {
                    get_team_form: '1'
                },
        function (data) {
            $parentEl.html(data);
            for (var option in options) {
                $('#' + option + ' input').val(options[option]);
            }
            dfd.resolve($parentEl);
            if (callback && typeof (callback) === "function") {
                callback();
            }
        });
        return dfd.promise()
    };
    this.eventListener = function () {
        var $parentEl = this.$parentEl;
        var dfd = jQuery.Deferred();
        $parentEl.on('click.team', 'button.submit-team', function () {
            var name = $parentEl.find('#name input').val().trim(),
                    idGlobalLocation = getIdGlobalLocation(),
                    idTeam;
            if (name !== '') {
                getValueAsync('team', 'id_team', 'team_name', name)
                        .then(function (id) {
                            idTeam = id;
                            return getValueAsync('team', 'id_global_location', 'team_name', name)
                        })
                        .then(function (idGlobal) {
                            if (idTeam && idGlobalLocation === idGlobal) {
                                warnMessage($parentEl.find('.info-field'), 'Team <b>' + name + '</b> already exist', function () {
                                    $parentEl.find('#name input').focus();
                                });
                                return false;
                            }
                            else {
                                idTeam = insertValueList('team', {'team_name': name, id_global_location: idGlobalLocation});
                                dfd.resolve(idTeam);
                                dfd.always($parentEl.off('.team', '**'));
                                if (callback && typeof (callback) === "function") {
                                    callback(idTeam);
                                }
                                $parentEl.empty();
                            }
                        })
            }
            else {
                $parentEl.find('#name input').focus();
            }
        });
        $parentEl.on('click.team', '#closeForm', function () {
            $(this).closest('#addForm').remove();
            $parentEl.off('.team', '**');
        });
        return dfd.promise();
    };
}
var insertDeviceIntoRack = function (idRack, topSlot, callback) {
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
                        function () {
                            $('#modalWindow').animate({
                                scrollTop: $('.info-field').offset().top
                            }, 1000);
                        })
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
var insertOverBarcodeForm = function (idRack, topSlot, callback) {
    this.idRack = idRack;
    this.topSlot = topSlot;
    this.getForm = function ($parentEl, callback) {
        var idRack = this.idRack,
                topSlot = this.topSlot;
        var dfd = jQuery.Deferred();
        this.$parentEl = $parentEl;

        $.post(
                "/ajax",
                {
                    get_barcode_form: '1',
                    slot: topSlot
                },
        function (form) {
            $parentEl.html(form);
            $parentEl.find('.barcode').focus();
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
                dfd = jQuery.Deferred();

        $parentEl.on('click.barcode', 'button.submit-barcode', function () {
            var barcode = $parentEl.find('.barcode').val().trim(),
                    numOfUnit,
                    idDevice, idLocation, deviceInfo, idModel, idDeviceInRack, modelName, ip;
            idDevice = getValue('device_list', 'id_device', 'asset_harmonic', barcode);
            if (idDevice !== '0') {
                idModel = getValue('device_list', 'id_model', 'id_device', idDevice);
                idLocation = getValue('device_list', 'id_location', 'id_device', idDevice);
                numOfUnit = getValue('device_model', 'size_in_unit', 'id_model', idModel);
                /*"4" - id of storage location*/
                if (idLocation !== '4') {
                    getDeviceInfo(idDevice)
                            .then(function (device) {
                                $parentEl.find('.submit-barcode')
                                        .attr('disabled', 'disabled');
                                if (device) {
                                    warnMessage(
                                            $parentEl.find('.info-field'),
                                            '<br>Device is used in other location </b>.<br>\
                                                 Model: <b>' + device['model'] + '</b>, location: <b>' + device['descr'] + '</b><br><br>\
                                                 <center><b>Do you want move device to new location?</b></center>\
                                                 <center><a id="moveSubmit" data-id-model=' + idModel + ' class="btn a-btn btn-lg">Ok</a><a id="moveReset" class="btn a-btn btn-lg">Cancel</a></center>'
                                            ,
                                            function () {
                                                $parentEl.find('.barcode').focus();
                                                $parentEl.find('.submit-barcode')
                                                        .removeAttr('disabled');
                                                $parentEl.find('.info-field').empty();

                                            }
                                    );

                                }
                            });
                    $parentEl.on('click.barcode', '#moveSubmit', function () {
                        var mngIp
                        if (!checkEmptySpaceInRack(idRack, topSlot, numOfUnit)) {
                            dangerMessage($parentEl.find('.info-field'), 'This device cannot insert in this unit. Not enough place');
                        }
                        else {
                            mngIp = getValue('devices_in_racks', 'mng_ip', 'id_device', idDevice);
                            deleteValue('devices_in_racks', 'id_device', idDevice)
                                    .then(function () {
                                        idDeviceInRack = insertValueList('devices_in_racks', {mng_ip: mngIp, id_device: idDevice, unit: topSlot, size_in_unit: numOfUnit, id_rack: idRack, id_model: idModel})
                                        /*"1" - id of rack location*/
                                        updateValue('device_list', 'id_location', '1', 'id_device', idDevice, function () {
                                            dfd.resolve(idDeviceInRack);
                                        });
                                    })
                        }
                        $parentEl.off('click.barcode', '#moveSubmit');
                    });
                    $parentEl.on('click.barcode', '#moveReset', function () {
                        $(this).closest('.info-field').empty();
                        $parentEl.find('.submit-barcode')
                                .removeAttr('disabled');
                    });
                }
                /*Add to rack*/
                else {
                    if (!checkEmptySpaceInRack(idRack, topSlot, numOfUnit)) {
                        dangerMessage($parentEl.find('.info-field'), 'This device cannot insert in this unit. Not enough place');
                    }
                    else {
                        ip = getValue('interfaces', 'ip', 'id_device', idDevice);
                        idDeviceInRack = insertValueList('devices_in_racks', {mng_ip: ip, id_device: idDevice, unit: topSlot, size_in_unit: numOfUnit, id_rack: idRack, id_model: idModel})
                        /*"1" - id of rack location*/
                        updateValue('device_list', 'id_location', '1', 'id_device', idDevice, function () {
                            dfd.resolve(idDeviceInRack);
                        });
                    }
                }
            }
            else {
                var insertForm = new insertDeviceIntoRack(idRack, topSlot);
                var form = new Form('device');
                insertForm.getForm($parentEl)
                        .then(function () {
                            $parentEl.prepend('<div  class="title"></div>')
                            infoMessage($parentEl.find('.title'),
                                    'Device with barcode <b>' + barcode + '</b> doesn`t exist in database, add it to rack.');
                            return insertForm.eventListener();
                        })
                        .then(function (id) {
                            idDeviceInRack = id;
                            idModel = getValue('devices_in_racks', 'id_model', 'id_device_in_rack', idDeviceInRack);
                            modelName = getValue('device_model', 'model', 'id_model', idModel);
                            return form.getForm($parentEl, {harmonicBarcode: barcode, model: modelName});
                        })
                        .then(function () {
                            $parentEl.prepend('<div  class="title"></div>')
                            infoMessage($parentEl.find('.title'),
                                    'Device with barcode <b>' + barcode + '</b> doesn`t exist in database, add it to stock.');
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
                            insertValueList('interfaces', {id_device: idDevice, ip: getValue('devices_in_racks', 'mng_ip', 'id_device', idDevice)})
                            dfd.resolve();
                        })
            }
        });
        $parentEl.on('click.barcode', '#closeForm', function () {
            $(this).closest('#addForm').remove();
            $parentEl.off('.barcode', '**');
        });
        return dfd.promise();
    };

};
var ModelForm = function (type) {
    var param;
    this.type = type;

    if (this.type === 'device' || this.type === '') {
        param = {
            table: 'device_model',
            pnTable: 'device_pn',
            idPnField: 'id_device_pn'
        };
    }
    else if (this.type === 'module') {
        param = {
            table: 'module_model',
            pnTable: 'module_pn',
            idPnField: 'id_module_pn'
        };
    }
    var typeList = new List('device_type', 'id_device_type', 'name');

    this.getForm = function ($parentEl, options, callback) {
        /*define method argument*/
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        else if (options === undefined) {
            options = {};
        }
        /***********************************/
        var dfd = jQuery.Deferred(),
                /*form can be for add new device or edit old*/
                action = (options.idModel !== undefined) ? 'update' : 'insert';
        this.idModel = options.idModel;
        this.action = action;
        this.$parentEl = $parentEl;
        $.post(
                "/ajax",
                {
                    get_model_form: '1',
                    type: type
                },
        function (data) {
            $parentEl.html(data);
            /*fill form with option values*/
            if (action === 'update')
            {
                getValues(param.table, 'id_model', options.idModel)
                        .then(function (values) {
                            if (values) {
                                console.log(values)
                                /*image seaction*/
                                if (values.icon_name !== '') {
                                    $parentEl
                                            .find('#imgField')
                                            .attr('data-icon', values.icon_name)
                                            .html('<button type="button" class="close"><span>&times;</span></button>\
                                                 <img src="/icon/' + values.icon_name + '"/>');
                                }
                                else {
                                    $parentEl
                                            .find('#imgField')
                                            .html('<div class="fileUpload btn btn-primary">\
                                                     <span>Upload</span>\
                                                    <input type="file" class="upload-img" accept="image/*" />\
                                                 </div>');
                                }
                                /*device_type section*/
                                typeList.getElementsDropDown($parentEl.find('#type'), function () {
                                    typeList.setElementId(values.id_device_type);
                                    if (values.id_device_type !== '0') {
                                        typeList.setInputVal(getValue('device_type', 'name', 'id_device_type', values.id_device_type));
                                    }
                                });
                                /*other field*/
                                for (var value in values) {
                                    $parentEl.find('[name=' + value + ']').val(values[value]);
                                }
                                /*form factor select*/
                                if (values.id_formfactor !== undefined) {
                                    $parentEl.find('select[name="id_formfactor"] [value=' + values.id_formfactor + ']')
                                            .attr('selected', 'selected');
                                    if (values.id_formfactor !== '1') {
                                        $parentEl.find('#size input')
                                                .val('0')
                                                .attr('disabled', 'disabled')
                                                .closest('tr')
                                                .fadeOut();
                                    }
                                }
                                /*model description section*/
                                if (values.model_comment !== undefined) {
                                    $parentEl.find('#comment').html(values.model_comment)
                                    /*Add editor for textarea element*/
                                    $parentEl.find('#comment').summernote();
                                }
                            }
                            return getValueList(param.pnTable, param.idPnField, 'id_model', options.idModel)
                        })
                        .then(function (pns) {
                            $parentEl.find('#pn')
                                    .html('<tr>\
                                                <td>Part number:</td>\
                                                <td class="pn">\
                                                    <span class="glyphicon glyphicon-plus add-pn small"></span>\
                                                </td>\
                                            </tr>');
                            for (var i in pns) {
                                var pnName = getValue(param.pnTable, 'pn_name', param.idPnField, pns[i]);
                                $parentEl.find('#pn')
                                        .append('<tr>\
                                                    <td></td>\
                                                    <td class="pn addition">\
                                                        <input data-id-pn="' + pns[i] + '" type="text" class="value form-control" value="' + pnName + '">\
                                                        <span class="glyphicon glyphicon-remove small remove-pn-db"></span>\
                                                </td>\
                                            </tr>');
                            }
                            dfd.resolve($parentEl);
                            if (callback && typeof (callback) === "function") {
                                callback();
                            }
                        });
            } else if (action === 'insert') {
                typeList.getElementsDropDown($parentEl.find('#type'), function () {
                    if (options.type !== undefined) {
                        typeList.setInputVal(options.type);
                        typeList.setElementId(getValue('device_type', 'id_device_type', 'name', options.type));
                    }
                });
                for (var option in options) {
                    $parentEl.find('[name=' + option + ']').val(options[option]);
                }
                $parentEl.find('#comment').summernote();
                if (options.id_formfactor !== undefined) {
                    $parentEl.find('select[name="id_formfactor"] [value=' + options.id_formfactor + ']')
                            .attr('selected', 'selected');
                }
                dfd.resolve($parentEl);
                if (callback && typeof (callback) === "function") {
                    callback();
                }
            }
        });
        return dfd.promise();
    };
    this.eventListener = function () {
        var $parentEl = this.$parentEl,
                action = this.action,
                idModel = this.idModel,
                dfd = jQuery.Deferred();

        $parentEl.on('click.model', '.remove-pn-db', function () {
            var  
                    $btn=$(this),
                    $tr=$btn.closest('tr'),
                    $input =$btn.closest('tr').find('input'),            
                    pnName = $input.val(),
                    idPn = $input.data('idPn');
            $.confirm('<center>Do yo really want to remove part number ' + pnName + ' from device model ?</center>')
                    .then(function () {
                        return  deleteValue(param.pnTable, param.idPnField, idPn);
                    })
                    .then(function () {
                        return $tr.fadeOut('slow');
                    })
                    .then(function () {
                        $tr.remove();
                    });
        });
        $parentEl.on('click.model', '#imgField .close', function () {
            $parentEl
                    .find('#imgField')
                    .attr('data-icon', '')
                    .html('<div class="fileUpload btn btn-primary">\
                                <span>Upload</span>\
                                <input type="file" class="upload-img" accept="image/*" />\
                           </div>');
        });
        $parentEl.on('click.model', '.add-pn', function () {
            $parentEl.find('#pn')
                    .append('<tr><td></td>\
                            <td class="pn addition">\
                             <input data-id-pn="0"  type="text" class="value form-control">\
                             <span class="glyphicon glyphicon-remove small remove-pn"></span>\
                            </td></tr>');
        });
        $parentEl.on('change.model', 'select.form-factor', function () {
            switch ($(this).val()) {
                case '1':
                    $parentEl.find('#size input')
                            .val('')
                            .removeAttr('disabled')
                            .closest('tr')
                            .fadeIn();
                    break;
                case '2':
                    $parentEl.find('#size input')
                            .val('0')
                            .attr('disabled', 'disabled')
                            .closest('tr')
                            .fadeOut();
                    break;
                case '3':
                    $parentEl.find('#size input')
                            .val('0')
                            .attr('disabled', 'disabled')
                            .closest('tr')
                            .fadeOut();
                    break;
            }
        });
        $parentEl.on('click.model', 'button.submit-model', function (e) {
            var name = $parentEl.find('#name input').val().trim(),
                    idType = typeList.getElementId(),
                    comment = $parentEl.find('#comment').summernote('code'),
                    iconName = $parentEl.find('#imgField').data('icon'),
                    size_pattern = /^\d+$/,
                    permission = true,
                    pnNames = [];
            if (type === 'device') {
                var idFormFactor = $parentEl.find('#formFactor select').val(),
                        size = $parentEl.find('#size input').val().trim();

                if (idFormFactor === '1') {
                    if (size === '0' || !size_pattern.test(size)) {
                        $parentEl.find('#size input').css({'border': 'solid 2px red'}).focus();
                        setTimeout(function () {
                            $parentEl.find('#size input').css({'border': 'solid 1px #ccc'});
                        }, 2000);
                        permission = false;
                        return false;
                    }
                }
                if (name === '') {
                    $parentEl.find('#name input').focus();
                    return false;
                }
            }

            $parentEl.find('.pn input')
                    .each(function () {
                        pnNames[pnNames.length] = $(this).val();
                    });
            if (permission) {
                if (action === 'update') {
                    updateValueList(param.table, {model: name, icon_name: iconName, id_device_type: idType, model_comment: comment}, 'id_model', idModel)
                            .then(function () {
                                $parentEl.find('.pn input')
                                        .each(function () {
                                            var idPn = $(this).data('idPn'),
                                                    pnName = $(this).val().trim();
                                            /*update exist part number*/
                                            if (idPn !== 0) {
                                                updateValueList(param.pnTable, {pn_name: pnName}, param.idPnField, idPn);
                                            }
                                            /*add new part number for this model*/
                                            else if (pnName !== '') {
                                                insertValueList(param.pnTable, {pn_name: pnName, id_model: idModel});
                                            }
                                        });
                                if (type === 'device')
                                {
                                    updateValueList(param.table, {id_formfactor: idFormFactor, size_in_unit: size}, 'id_model', idModel)
                                            .then(function () {
                                                dfd.resolve(idModel);
                                            });
                                } else if (type === 'module') {
                                    dfd.resolve(idModel);
                                }
                            });
                }
                /*add new device/module*/
                else if (action === 'insert') {
                    if (type === 'device')
                    {
                        idModel = insertValueList(param.table,
                                {model: name,
                                    icon_name: iconName,
                                    id_device_type: idType,
                                    id_formfactor: idFormFactor,
                                    size_in_unit: size,
                                    model_comment: comment
                                }
                        );
                    } else if (type === 'module')
                    {
                        idModel = insertValueList(param.table,
                                {model: name,
                                    icon_name: iconName,
                                    id_device_type: idType,
                                    model_comment: comment
                                }
                        );
                    }
                    for (var pnName in pnNames) {
                        insertValueList(param.pnTable, {pn_name: pnName, id_model: idModel});
                    }
                }
                dfd.resolve(idModel);
            }
        });
        $parentEl.on('click.model', '#closeForm', function () {
            $(this).closest('#addForm').remove();
            $parentEl.off('.model', '**');
        });
        return dfd.promise();
    };

};
var VMForm = function (idInterface) {
    var dfd = jQuery.Deferred();
    this.idInterface = idInterface
    this.getForm = function ($parentEl, options, callback) {
        /*define method argument*/
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        else if (options === undefined) {
            options = {};
        }
        /***********************************/
        /*form can be for add new vm or edit old*/
        var action = (options.id_virtual_mashine !== undefined) ? 'update' : 'insert';
        this.idVirtualMashine = options.id_virtual_mashine;
        this.action = action;
        this.$parentEl = $parentEl;
        $.post(
                "/ajax",
                {
                    get_vm_form: '1',
                },
                function (data) {
                    $parentEl.html(data);
                    /*fill form with option values*/
                    if (action === 'update')
                    {
                        getValues('virtual_mashines', 'id_virtual_mashine', options.id_virtual_mashine)
                                .then(function (values) {
                                    if (values) {
                                        /*model description section*/
                                        if (values.virt_comment !== undefined) {
                                            $parentEl.find('#comment').html(values.virt_comment)
                                            /*Add editor*/
                                            $parentEl.find('#comment').summernote();
                                        }
                                        /*other field*/
                                        for (var value in values) {
                                            $parentEl.find('[name=' + value + ']').val(values[value]);
                                        }

                                    }
                                })
                    } else if (action === 'insert') {
                        for (var option in options) {
                            $parentEl.find('[name=' + option + ']').val(options[option]);
                        }
                        $parentEl.find('#comment').summernote();
                        dfd.resolve($parentEl);
                        if (callback && typeof (callback) === "function") {
                            callback();
                        }
                    }
                });
    }
    this.eventListener = function () {
        var $parentEl = this.$parentEl,
                action = this.action,
                idInterface = this.idInterface,
                idVirtualMashine = this.idVirtualMashine,
                ipPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                dfd = jQuery.Deferred();
        $parentEl.on('click.vm', 'button.submit-vm', function (e) {
            var $ipInput = $parentEl.find('[name="virt_ip"]'),
                    comment = $parentEl.find('#comment').summernote('code'),
                    ip = $ipInput.val(),
                    os = $parentEl.find('[name="virt_host"]').val(),
                    host = $parentEl.find('[name="os"]').val(),
                    valid = true;
            /*ip field validation*/
            if (ip !== '' && ip !== '0.0.0.0') {
                if (!ipPattern.test(ip)) {
                    $ipInput.css({'border': 'solid 2px red'});
                    setTimeout(function () {
                        $ipInput.css({'border': 'solid 1px #ccc'});
                    }, 2000);
                    valid = false;
                }
                else {
                    /*chek availiability ip*/
                    var ipCurrent = getValue('virtual_mashines', 'virt_ip', 'id_virtual_mashine', idVirtualMashine);
                    var device = getDeviceThatUseIp(ip);
                    if (device && (ip !== ipCurrent)) {
                        warnMessage(
                                $parentEl.find('.info-field'),
                                '<br>Device exist with ip <b>' + ip + '</b>.<br>\
                             Model: <b>' + device['model'] + '</b>, location: <b>' + device['descr'] + '</b>',
                                function () {
                                    $ipInput.focus();
                                }
                        );
                        valid = false;
                    }
                }

            }
            else {
                $ipInput.focus();
                valid = false;
                return false;
            }
            if (valid) {
                if (action === 'update') {
                    updateValueList('virtual_mashines', {virt_ip: ip, virt_host: host, virt_comment: comment, os: os}, 'id_virtual_mashine', idVirtualMashine)
                            .then(function () {
                                dfd.resolve(idVirtualMashine);
                                dfd.always($parentEl.off('.vm', '**'));
                            });
                }
                /*add new device/module*/
                else if (action === 'insert') {
                    idVirtualMashine = insertValueList('virtual_mashines',
                            {virt_ip: ip,
                                virt_host: host,
                                virt_comment: comment,
                                os: os,
                                id_interface: idInterface
                            }
                    );
                }
                dfd.resolve(idVirtualMashine);
                dfd.always($parentEl.off('.vm', '**'));
            }
        });
        return dfd.promise();
    }
}
var FreeEquipList = function (type, idLocation) {
    this.type = type;
    this.idLocation = idLocation;
    this.getList = function ($parentEl, modelName, callback) {
        var dfd = jQuery.Deferred();
        this.$parentEl = $parentEl;

        $.post(
                "/ajax",
                {
                    get_free_equipment: '1',
                    type: type,
                    model: modelName
                },
        function (list) {
            $parentEl.html(list);
            dfd.resolve($parentEl);
            if (callback && typeof (callback) === "function") {
                callback();
            }
        });
        return dfd.promise();
    };
    this.addElement = function (param) {
        $parentEl = this.$parentEl;
        var tr = '\
            <tr  data-id-element="' + param.id + '">\
            <td  data-item="model">' + param.model + '</td>\
            <td  data-item="asset_harmonic">' + param.assetHarmonic + '</td>  \
            <td  data-item="asset_gl">' + param.assetGl + '</td>\
            <td  data-item="sn">' + param.sn + '</td>\
            <td  data-item="owner">' + param.owner + '</td>\
        </tr>\
    ';
        $parentEl.find('table')
                .append(tr);
        $parentEl.find('table  tr:nth-last-of-type(1)')
                .click();

    };
    this.chooseElement = function (sn) {
        $parentEl = this.$parentEl;
        $parentEl.find('[data-item="sn"]')
                .each(function () {
                    var $td = $(this);
                    if ($td.text().trim() === sn) {
                        $td.closest('tr').click();
                        return true;
                    }
                });
        return false;
    };
    this.eventListener = function (callback) {
        var $parentEl = this.$parentEl;
        var dfd = jQuery.Deferred();

        /*choose element for binding*/
        $parentEl.on('click.free', '#unusedDeviceTable tr', function () {
            var $tr = $(this),
                    $table = $tr.closest('#unusedDeviceTable'),
                    idElement = $tr.attr('data-id-element');
            $table.find('tr').removeClass('info');
            $tr.addClass('info');
            $parentEl.find(".bind").slideDown();
            $table.attr('data-id-element', idElement);
            $parentEl.find('.bind').focus();

        });

        /*bind choosing element*/
        $parentEl.on('click.free', 'button.bind', function () {
            var idElement = $parentEl.find('#unusedDeviceTable').data('idElement');
            if (type === 'device') {
                updateValue('device_list', 'id_location', idLocation, 'id_device', idElement)
                        .then(function () {
                            $parentEl.empty();
                            $parentEl.off('.free', '**');
                            dfd.resolve(idElement);
                            if (callback && typeof (callback) === "function") {
                                callback(idElement);
                            }
                        });
            }
            else if (type === 'module') {
                updateValue('module_list', 'id_device', idLocation, 'id_module', idElement)
                        .then(function () {
                            $parentEl.empty();
                            $parentEl.off('.free', '**');
                            dfd.resolve(idElement);
                            if (callback && typeof (callback) === "function") {
                                callback(idElement);
                            }
                        });
            }

        });

        return dfd.promise();
    };
};
var getLeftRackMenu = function ($parentEl, callback) {
    return $parentEl.load(
            "/html/sections/rack_left_menu.html",
            function (data) {
                if (typeof callback !== 'undefined') {
                    callback(data);
                }
            });
};
var getRack = function ($parentEl, idRack, callback) {
    return $.post(
            "/rack.php",
            {
                get_rack: '1',
                id_rack: idRack
            },
    function (rackHtml) {
        $parentEl.html(rackHtml);
        if (typeof callback !== 'undefined') {
            callback($parentEl);
        }
    });
};
var showDeviceInRack = function ($parentEl, idDevice) {
    var dfd = jQuery.Deferred();
    getValues('devices_in_racks', 'id_device', idDevice)
            .then(function (device) {
                if (device) {
                    return $.post('/rack.php',
                            {get_rack: '1', id_rack: device.id_rack, id_device_in_rack: device.id_device_in_rack});
                }
                $parentEl.html('<b>Device is not in the rack</b>')
                dfd.resolve($parentEl);
            })
            .then(function (rackHtml) {
                $parentEl.html(rackHtml)
                dfd.resolve($parentEl);
            })
    return dfd.promise();
}
var getVirtualHosts = function ($parentEl, idInterface, callback) {
    return $.post(
            "/ajax",
            {
                get_virtual_hosts: '1',
                id_interface: idInterface
            },
    function (html) {
        $parentEl.html(html);
        if (typeof callback !== 'undefined') {
            callback($parentEl);
        }
    });
};
var getGlobalLocations = function ($parentEl, callback) {
    var dfd = jQuery.Deferred();
    $.post(
            "/ajax",
            {
                get_global_locations: '1'
            },
    function (html) {
        $parentEl.html(html);
        if (typeof callback !== 'undefined') {
            callback($parentEl);
        }
    });
    $parentEl.on('click.locations', '.site', function () {
        dfd.resolve($(this).data('idGlobalLocation'));
        dfd.always($parentEl.off('.locations', '**'));
    });
    return dfd.promise();
};
var getTransferStatus = function ($parentEl, callback) {
    var dfd = jQuery.Deferred();
    $.post(
            "/ajax",
            {
                get_transfer_status: '1'
            },
    function (html) {
        $parentEl.html(html);
        if (typeof callback !== 'undefined') {
            callback($parentEl);
        }
    });
    $parentEl.on('click.transfer', '.list-group-item', function () {
        var id = $(this).data('id');
        dfd.resolve(id);
        dfd.always($parentEl.off('.transfer', '**'));
    });
    return dfd.promise();
};
var getWorkStatus = function ($parentEl, callback) {
    var dfd = jQuery.Deferred();
    $.post(
            "/ajax",
            {
                get_work_status: '1'
            },
    function (html) {
        $parentEl.html(html);
        if (typeof callback !== 'undefined') {
            callback($parentEl);
        }
    });
    $parentEl.on('click.work', '.list-group-item', function () {
        var id = $(this).data('id');
        dfd.resolve(id);
        dfd.always($parentEl.off('.work', '**'));
    });
    return dfd.promise();
};
var modelDescription = function ($parentEl, type, modelName, callback) {
    var dfd = jQuery.Deferred();
    $.post(
            "/ajax",
            {
                get_model_descr: '1',
                model: modelName,
                type: type
            },
    function (html) {
        $parentEl.html(html);
        console.log($parentEl.find('#modelDescriptionCollapse p'));
        if ($parentEl.find('#modelDescriptionCollapse p').html() === '') {

            $parentEl.empty()
        }
        if (typeof callback !== 'undefined') {
            callback($parentEl);
        }
        dfd.resolve();
    });
    return dfd.promise();
};



/******************************************************************************/
/************************* Ajax Setup *****************************************/
/******************************************************************************/
$.ajaxSetup({
    timeout: 10000,
    error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown, jqXHR.responseText);
        alert(textStatus + '-------' + errorThrown + '----' + jqXHR.responseText);
    }
});
/*Check  user loging*/
$(document).ajaxSuccess(function (e, xnr, set) {
    if (xnr.responseText.trim() === 'user not logged already') {
        document.location.replace('/login');
    }
});
/*************************************************************************************/



/*$(selector).exist()*/
jQuery.fn.exists = function () {
    return $(this).length;
};


/******************************************************************************/
/************************* Up scroling ********************/
/******************************************************************************/

$(document).ready(function () {
// hide #back-top first
    $("#back-top").hide();

// fade in #back-top
    $(function () {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $('#back-top').fadeIn();
            } else {
                $('#back-top').fadeOut();
            }
        });
// scroll body to 0px on click
        $('#back-top a').click(function () {
            $('body,html').animate({
                scrollTop: 0
            }, 800);
            return false;
        });
    });
});



//$(document).ready(function () {
//    $(document).on('click', '.section-header', function (e) {
//        var $header = $(this),
//                $targetEl = $(e.target),
//                $edit = $header.find('.write'),
//                $content = $header.find('+.section-content');
//        if (!$content.hasClass('show')) {
//            $header.find('.arrow')
//                    .removeClass('glyphicon-chevron-up')
//                    .addClass('glyphicon-chevron-down');
//            $content.slideDown(function () {
//                $edit.removeClass('hide');
//                $(this).addClass('show');
//            });
//
//        } else {
//            $header.find('.arrow')
//                    .removeClass('glyphicon-chevron-down')
//                    .addClass('glyphicon-chevron-up');
//            $content.slideUp(function () {
//                $edit.addClass('hide');
//                $(this).removeClass('show');
//            });
//        }
//    });
//});

/******************************************************************************/
/*************************  Activate tooltips *********************************/
/******************************************************************************/

$(function () {
    $(document).tooltip({
        selector: '[data-toggle="tooltip"]',
        placement: 'bottom'

    });
});
/******************************************************************************/
/*************************  Collapse sections *********************************/
/******************************************************************************/
$(document).on('hide.bs.collapse', '.section-content', function () {
    var $content = $(this),
            $header = $content.prev('.section-header');
    $content.css("display", "");
    $header.find('.arrow')
            .removeClass('glyphicon-chevron-down')
            .addClass('glyphicon-chevron-up');
    $header.find('.write').hide();

});
$(document).on('show.bs.collapse', '.section-content', function () {
    var $content = $(this),
            $header = $content.prev('.section-header');
    $header.find('.arrow')
            .removeClass('glyphicon-chevron-up')
            .addClass('glyphicon-chevron-down');
    $header.find('.write').show();

});
/******************************************************************************/
/*************************  Confirm modal window *****************************/
/******************************************************************************/

jQuery.altConfirm = function () {
    var box = '<div id="confirmWindow" class="modal static" id="confirm" data-backdrop="static" tabindex="-1" role="dialog">';
    box += '<div class="modal-dialog info">';
    box += '<div class="modal-content">';
    box += '<div class="modal-body"> </div>';
    box += '<div class="modal-footer">';
    box += '<button type="button" class="btn btn-danger no" data-dismiss="modal">No</button>';
    box += '<button type="button" class="btn btn-primary ok"  data-dismiss="modal">Ok</button>';
    box += '</div>';
    box += '</div>';
    box += '</div>';
    box += '</div>';
    $("body").append(box);

    jQuery.confirm = function (dialog, callback) {
        var deferred = jQuery.Deferred();
        $('#confirmWindow .modal-body').html(dialog.replace(/\n/, "<br />"));
        $('#confirmWindow.modal').modal();
        $('#confirmWindow .no').on('click', function () {
            $('#confirmWindow').off('hidden.bs.modal')
            $('#confirmWindow').on('hidden.bs.modal', function (e) {
                console.log('reject')
                if (typeof callback !== 'undefined') {
                    callback(false);
                }
                deferred.reject();
            })
            $(this).modal('hide');

        });
        $('#confirmWindow .ok').off('click');
        $('#confirmWindow .ok').on('click', function () {
            $('#confirmWindow').off('hidden.bs.modal')
            $('#confirmWindow').on('hidden.bs.modal', function (e) {
                console.log('resolve')
                if (typeof callback !== 'undefined') {
                    callback(true);
                }
                deferred.resolve();
            })
            $(this).modal('hide');

        });
        return  deferred.promise();
    };
};

$(document).ready(function () {
    $.altConfirm();
});


