var DeviceModules=function(idDevice){
    var getInfoFromDB = function (callback) {
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
    var getInfoFromDevice = function () {
        var dfd = $.Deferred(),
                modelName;
        getDeviceInfo(idDevice)
                .then(function (data) {
                    modelName = data['model'];
                    return getInterfaceList(idDevice)
                })
                .then(function (interfaces) {
                    var ip, info,
                            promise = $.when();
                    for (var id in interfaces) {
                        ip = interfaces[id]['ip'];
                        info = new GettingInfoFromDevice(modelName, ip);
                        if (info.abilityGettingInfo && (ip !== '' && ip !== '0.0.0.0')) {
                            promise = promise
                                    .then(function () {
                                        return ping(ip);
                                    })
                                    .then(function (ping) {
                                        if (!ping) {
                                            return $.Deferred().reject();
                                        }
                                        return info.getModulesInfo();
                                    })
                                    .then(
                                            function (modules) {
                                                if (modules) {
                                                    dfd.resolve(modules);
                                                    return $.Deferred();
                                                }
                                                return $.when();
                                            },
                                            function () {
                                                return $.when();
                                            }
                                    );
                        }
                    }
                    promise
                            .then(function () {
                                dfd.resolve(false);
                            });
                });
        return dfd.promise();
    }
    this.get = function () {   
        var db, device,
                snFromDB, snFromDevice, pnFromDB, pnFromDevice,existingDeviceInfo,
                mergeResult = [],
                dfd=$.Deferred();
        getInfoFromDB()
                .then(function (infoFromDB) {
                    db = infoFromDB;
                    return getInfoFromDevice();
                })
                .then(function (infoFromDevice) {
                    device=infoFromDevice;
                    existingDeviceInfo = (device) ? true : false;
                    for (var idModule in db) {
                        snFromDB = db[idModule]['sn'].trim();
                        pnFromDB = (db[idModule]['pn'] !== null) ? db[idModule]['pn'].trim() : '';
                        db[idModule]['pn'] = pnFromDB;
                        for (var i in device) {
                            snFromDevice = device[i]['sn'].trim();
                            pnFromDevice = device[i]['pn'].trim();
                            if (snFromDB === snFromDevice) {
                                db[idModule]['isPnEqual'] = (pnFromDevice === pnFromDB) ? true : false;
                                db[idModule]['pnFromDevice'] = pnFromDevice;
                                db[idModule]['status'] = 'fromBothBbAndDevice';
                                db[idModule]['descr'] = device[i]['descr'];
                                mergeResult.push(db[idModule]);
                                delete device[i];
                                delete db[idModule];
                                break;
                            }
                        }
                    }
                    for (var idModule in db) {
                        db[idModule]['status'] = 'fromDb';
                        db[idModule]['edit'] = existingDeviceInfo;
                        mergeResult.push(db[idModule]);
                    }
                    for (var i in device) {
                        device[i]['status'] = 'fromDevice';
                        mergeResult.push(device[i]);
                    }
                    dfd.resolve(mergeResult);
                });
                return dfd.promise();
    };
    this.changeStatusToFree = function (idModule) {
        return updateValue('module_list', 'id_device', '0', 'id_module', idModule);
    };
    this.insertToDevice = function (idModule) {
        return updateValue('module_list', 'id_device', idDevice, 'id_module', idModule);
    }
    this.checkInStock = function (sn) {
        sn = sn.trim();
        return $.ajax({
            url: '/get_module_by_sn',
            async: false,
            type: 'GET',
            data: {sn: sn},
            dataType: 'json'}).responseJSON;
    };
    this.checkInDevice = function (moduleSn) {
        var dfd = $.Deferred();
        getInfoFromDevice(idDevice)
                .then(function (modules) {
                    for (var i in modules) {
                        if (moduleSn.trim() === modules[i]['sn']) {
                            return getDeviceInfo(idDevice);
                        }
                    }
                    dfd.resolve(false);
                    return $.Deferred();
                })
                .then(function (device) {
                    dfd.resolve(device);
                });
        return dfd.promise();
    };   
};
var checkDeviceModulesChanges = function ($fieldForNotification,idDevice) {
    var dfd = $.Deferred();
    var notification=function(text){
        infoMessage($fieldForNotification,text);
//       $fieldForNotification.prepend() 
    };
    var modules = new DeviceModules(idDevice);
    modules.get(idDevice)
            .then(function (data) {
                if (data.length === 0) {
                    return dfd.resolve({id:idDevice,status:false});
                }
                for (var i in data) {
                    var module = data[i];
                    switch (module['status']) {
                        case 'fromBothBbAndDevice':
                            break;

                        case 'fromDb':
                            if (module['edit']) {
//                                modules.changeStatusToFree(module['id_module']);
//                                addModuleEvent(module['id_module'], 'Change status to "free"')
                                notification('Card/module with <b>' + module['sn'] + '</b> is no longer used in the device.<br>\
                        Unbinding...');
                            } else {
                            }
                            break;

                        case 'fromDevice':
                            if (module['sn'] !== '') {
                                var stockModules = modules.checkInStock(module['sn']);
                                if (stockModules) {
                                    if (objectLength(stockModules) === 1) {
                                        for (var idModule in stockModules) {
                                            var sn = stockModules[idModule]['sn'];
                                            if (stockModules[idModule]['id_device'] != '0') {

                                                /*Block resolve problem with ascync*/
                                                (function () {
                                                    var idModuleI = idModule,
                                                            moduleI = module,
                                                            snI = sn,
                                                            stockModulesI = stockModules;
                                                    modules.checkInDevice(stockModulesI[idModuleI]['id_device'], snI)
                                                            .then(function (device) {
                                                                if (!device) {
                                                                    if (stockModulesI[idModuleI]['model'] === moduleI['name'].trim()) {
//                                                            modules.insertToDevice(idModuleI);
                                                                        notification('Bind card/module with sn <b>' + snI + '</b>');
//                                                            getDeviceInfo(idDevice).then(function (d) {
//                                                                addModuleEvent(idModule, 'Bind with device <b>' + d['model'] + ', sn - ' + d['sn'] + '</b>');
//                                                            });
                                                                    }
                                                                    else {
                                                                        notification('Candidate for binding But have different model name');
                                                                    }
                                                                }
                                                                else {
                                                                    /*find unknow module cards*/
                                                                    notification('Card/module with sn <b>' + snI + '</b>\
                                                           exist and  is located into other device <b>' + device['model'] + '</b>.<br>\
                                                           Device is located in <b>' + device['descr'] + '</b>');
                                                                }
                                                            });
                                                })();
                                            }
                                            else {
//                                    modules.insertToDevice(idModule, idDevice);
//                                    getDeviceInfo(idDevice).then(function (d) {
//                                        addModuleEvent(idModule, 'Bind with device <b>' + d['model'] + ', sn - ' + d['sn'] + '</b>')
//                                    })
                                                notification('Bind card/module with sn <b>' + sn + '</b>');
                                            }
                                        }
                                    }
                                    else {
                                        notification('Find more than one modules with this Sn');
                                        
                                    }
                                }
                                else {
                                    notification('Find new module/card');
                                }
                            }
                            else {
                                notification('Find new module/card');
                            }
                            break;
                    }
                }
                dfd.resolve({id:idDevice,status:true});
            });
            return dfd.promise();
};
var deviceModuleTable = function ($parentEl, idDevice) {
        var dfd = jQuery.Deferred(),
            infoFromDevice, infoFromDB,
            body = ('\
                        <div class="section-header">\
                            <a class=" collapsed" data-toggle="collapse"  href="#cardsCollapse" aria-expanded="true" aria-controls="cardsCollapse">\
                                Device cards\
                            </a>\
                            <span class="glyphicon glyphicon-chevron-down arrow"></span>\
                        </div>\
                        <div id="cardsCollapse" class="section-content collapse in">\
                            <div class="loading"></div>\
                        </div>\
                        <div class="addition-info"></div>\
                        <div class="notification"></div>\
                        <div class="request"></div>\
                        <div id="addModuleToDB"></div>\
                        ');
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
    var getMondulesInfoFromDevice = function (idDevice) {
        var dfd = $.Deferred(),
                modelName;
        var checkModulesFromInterface = function (ip, infoDevice, promise) {
            promise = promise
                    .then(function () {
                        return ping(ip);
                    })
                    .then(function (ping) {
                        if (!ping) {
                            return $.Deferred().reject();
                        }
                        return infoDevice.getModulesInfo();
                    })
                    .then(
                            function (modules) {
                                if (modules) {
                                    dfd.resolve(modules);
                                    return $.Deferred();
                                }
                                return $.when();
                            },
                            function () {
                                return $.when();
                            }
                    );
            return promise;
        }
        getDeviceInfo(idDevice)
                .then(function (data) {
                    modelName = data['model'];
                    return getInterfaceList(idDevice);
                })
                .then(function (interfaces) {
                    var ip, info,
                            promise = $.when();
                    for (var id in interfaces) {
                        ip = interfaces[id]['ip'];
                        info = new GettingInfoFromDevice(modelName, ip);
                        if (info.abilityGettingInfo && (ip !== '' && ip !== '0.0.0.0')) {
                            promise = checkModulesFromInterface(ip, info, promise);
                        }
                    }
                    promise
                            .then(function () {
                                dfd.resolve(false);
                            });
                });
        return dfd.promise();
    }
    var mergeInfo = function (infoFromDB, infoFromDevice) {
        var db = infoFromDB,
                device = infoFromDevice,
                snFromDB, snFromDevice, pnFromDB, pnFromDevice,
                mergeResult = [],
                existingDeviceInfo = (device) ? true : false;
        for (var idModule in db) {

            snFromDB = db[idModule]['sn'].trim();
            pnFromDB = (db[idModule]['pn'] !== null) ? db[idModule]['pn'].trim() : '';
            db[idModule]['pn'] = pnFromDB;
            for (var i in device) {
                snFromDevice = device[i]['sn'].trim();
                pnFromDevice = device[i]['pn'].trim();
                if (snFromDB === snFromDevice) {
                    db[idModule]['isPnEqual'] = (pnFromDevice === pnFromDB) ? true : false;
                    db[idModule]['pnFromDevice'] = pnFromDevice;
                    db[idModule]['status'] = 'fromBothBbAndDevice';
                    db[idModule]['descr'] = device[i]['descr'];
                    mergeResult.push(db[idModule]);
                    delete device[i];
                    delete db[idModule];
                    break;
                }
            }
        }
        for (var idModule in db) {
            db[idModule]['status'] = 'fromDb';
            db[idModule]['edit'] = existingDeviceInfo;
            mergeResult.push(db[idModule]);
        }
        for (var i in device) {
            device[i]['status'] = 'fromDevice';
            mergeResult.push(device[i]);
        }
        return mergeResult;
    };
    var changeModuleStatusToFree = function (idModule) {
        return updateValue('module_list', 'id_device', '0', 'id_module', idModule);
    };
    var insertModuleToDevice = function (idModule, idDevice) {
        return updateValue('module_list', 'id_device', idDevice, 'id_module', idModule);
    }
    var checkModuleInStock = function (sn) {
        sn = sn.trim();
        return $.ajax({
            url: '/get_module_by_sn',
            async: false,
            type: 'GET',
            data: {sn: sn},
            dataType: 'json'}).responseJSON;
    };
    var checkModuleInDevice = function (idDevice, moduleSn) {
        var dfd = $.Deferred()
        console.log(idDevice)
        getMondulesInfoFromDevice(idDevice)
                .then(function (modules) {
                    for (var i in modules) {
                        if (moduleSn.trim() === modules[i]['sn']) {
                            return getDeviceInfo(idDevice);
                        }
                    }
                    dfd.resolve(false);
                    return $.Deferred();
                })
                .then(function (device) {
                    dfd.resolve(device);
                })
        return dfd.promise();
    }
    
    
    var addPnTd = function (pnFromDevice, pnFromDb) {

        var devicePn = pnFromDevice.trim(),
                dbPn = pnFromDb.trim(),
                title = 'update database with this card';
        if (dbPn === devicePn) {
            return '<td>' + devicePn + '</td>';
        }
        else {
            if (devicePn !== '') {
                return    '<td class="info edit" data-item="pn">\
                          <span class="value">' + devicePn + '</span>\
                          <span class="glyphicon glyphicon-pencil td-icon update-el" data-toggle="tooltip" title="' + title + '"></span>\
                    </td>';
            }
            else {
                return '<td class="warning">' + dbPn + '</td>';
            }
        }
    };
    var addTrWithUnknowModule = function (module) {
        var $table = $parentEl.find('#modules'),
                title = 'add module to database',
                $tr = '<tr class="warning new-modules">\
                                <td class="edit">\
                                    <span class="name">' + module['name'] + '</span>\
                                   <span class="glyphicon glyphicon-plus td-icon add-module" data-toggle="tooltip" title="' + title + '"></span>\
                                </td>\
                               <td class="sn">' + module['sn'] + '</td>\
                               <td class="pn">' + module['pn'] + '</td>\
                               <td>' + module['descr'] + '</td>\
                           </tr>';
        $table.append($tr);
    };
    var addTrWithExistModule = function (module) {
        var $table = $parentEl.find('#modules');
        var $table = $parentEl.find('#modules');
        if (typeof module['pnFromDevice'] === 'undefined')
            module['pnFromDevice'] = module['pn'];
        if (typeof module['name'] !== 'undefined')
            module['model'] = module['name'];
        var $tr = '<tr data-id-module="' + module['id_module'] + '">';
        $tr += '<td class="model">' + module['model'] + '</td>';
        $tr += '<td>' + module['sn'] + '</td>';
        $tr += addPnTd(module['pnFromDevice'], module['pn']);
        $tr += '<td>' + module['descr'] + '</td>';
        $tr += '<td class="icon hide-td"><span class="glyphicon glyphicon-info-sign module-info" data-toggle="tooltip" title="show detail information"></span></td>'
        $tr += '</tr>';
        $table.append($tr);
    }
    var addTrWithExistModuleFromDb = function (module) {
        var $table = $parentEl.find('#modules');
        var $tr = '<tr data-id-module="' + module['id_module'] + '">';
        $tr += '<td class="model">' + module['model'] + '</td>';
        $tr += '<td>' + module['sn'] + '</td>';
        $tr += '<td>' + module['pn'] + '</td>';
        $tr += '<td class="icon hide-td"><span class="glyphicon glyphicon-info-sign module-info" data-toggle="tooltip" title="show detail information"></span></td>'
        $tr += '</tr>';
        $table.append($tr);
    }
    var notification = function (text) {
        infoMessage($parentEl.find('.notification'), text);
    }
    var requestForBinding = function (modules, sn, descr) {
        var $table, $tr,
                SN = sn.trim(),
                body = '\<center><h5>Program want to bind card that found in device with cards that  are found into db by serial number</h5>\
                           <h5>Candidates with sn <b>"' + SN + '"</b>  for binding with device</h5></center>\
                <div class="list-group" data-sn=' + SN + '></div>';
        notification(body);
        $table = $parentEl.find('[data-sn="' + SN + '"]');
        $table.css({width: '50%', margin: 'auto'});
        for (var id in modules) {
            if (modules[id]['id_device'] === '0') {
                $tr = '<button type="button" class="list-group-item list-group-item-success" data-id-module="' + id + '">\
                    <b>' + modules[id]['model'] + '  </b>\
                    ' + modules[id]['pn'] + '\
                    <b>  free</b>\
                </button>';
                $table.append($tr);
            }
            else {
                (function () {
                    var module = modules[id];
                    checkModuleInDevice(module['id_device'], SN)
                            .then(function (device) {
                                if (!device) {
                                    changeModuleStatusToFree(module['id_module']);
                                    $tr = '<button type="button" class="list-group-item list-group-item-success" data-id-module="' + module['id_module'] + '">\
                                    <b>' + module['model'] + '  </b>\
                                    ' + module['pn'] + '\
                                    <b>  free</b>\
                                </button>';
                                }
                                else {
                                    $tr = '<button type="button" class="list-group-item list-group-item-info disabled" data-id-module="' + module['id_module'] + '">\
                                    <b>' + module['model'] + '  </b>\
                                    ' + module['pn'] + '<br>\
                                    <sm>is used by device \
                                     ' + device['model'] + ', ' + device['descr'] + '</sm>\
                                </button>';
                                }
                                $table.append($tr);
                            });
                })();

            }
        }
        $parentEl.on('click.request', '[data-sn="' + SN + '"] button', function () {
            var idModule = $(this).data('idModule'),
                    $notificationField = $(this).closest('.alert');
            modules[idModule]['descr'] = descr;
            insertModuleToDevice(idModule, idDevice);
            addTrWithExistModule(modules[idModule]);
            $notificationField.slideUp();
            getDeviceInfo(idDevice).then(function (d) {
                addModuleEvent(idModule, 'Bind with device <b>' + d['model'] + ', sn - ' + d['sn'] + '</b>')
            })
            $parentEl.on('click.request', '[data-sn="' + SN + '"] button');
        });
    };
    var createTable = function ($parentEl, data) {
        var $table, $tr, sn;
        $parentEl.html('<table id="modules" class="table table-bordered table-responsive table-hover "></table>');
        $table = $parentEl.find('#modules');
        if (data.length === 0) {
            return false;
        }
        for (var i in data) {
            var module = data[i];
            switch (module['status']) {
                case 'fromBothBbAndDevice':
                    addTrWithExistModule(module);
                    break;

                case 'fromDb':
                    if (module['edit']){
                        changeModuleStatusToFree(module['id_module']);
                        addModuleEvent(module['id_module'], 'Change status to "free"')
                        notification('Card/module with sn <b>' + module['sn'] + '</b> is no longer used in the device.<br>\
                        Unbinding...');
                    } 
                    else {
                        addTrWithExistModuleFromDb(module);
                    }
                    break;

                case 'fromDevice':
                    if (module['sn'] !== '') {
                        var stockModules = checkModuleInStock(module['sn']);
                        if (stockModules) {
                            var  oneModuleHave=(objectLength(stockModules) === 1);
                            if (oneModuleHave) {
                                for (var idModule in stockModules) {                                   
                                    var sn = stockModules[idModule]['sn'],
                                         moduleFree=stockModules[idModule]['id_device'] === '0';
                                    if (!moduleFree) {
                                        /*Block resolve problem with ascync*/
                                        (function () {
                                            var idModuleI = idModule,
                                                    moduleI = module,
                                                    snI = sn,
                                                    stockModulesI = stockModules;
                                            checkModuleInDevice(stockModulesI[idModuleI]['id_device'], snI)
                                                    .then(function (device) {
                                                        if (!device) {
                                                            if (stockModulesI[idModuleI]['model'] === moduleI['name'].trim()) {
                                                                insertModuleToDevice(idModuleI, idDevice);
                                                                moduleI['id_module'] = idModuleI;
                                                                addTrWithExistModule(moduleI);
                                                                notification('Bind card/module with sn <b>' + snI + '</b>');
                                                                getDeviceInfo(idDevice).then(function (device) {
                                                                    addModuleEvent(idModule, 'Bind with device <b>' + device['model'] + ', sn - ' + device['sn'] + '</b>')
                                                                })
                                                            }
                                                            else {
                                                                requestForBinding(stockModulesI, moduleI['sn'], moduleI['descr']);
                                                            }
                                                        }
                                                        else {
                                                            addTrWithUnknowModule(moduleI);
                                                            notification('Card/module with sn <b>' + snI + '</b>\
                                                           exist and  is located into other device <b>' + device['model'] + '</b>.<br>\
                                                           Device is located in <b>' + device['descr'] + '</b>');
                                                        }
                                                    });
                                        })();

                                    }
                                    else {
                                        insertModuleToDevice(idModule, idDevice);
                                        module['id_module'] = idModule;
                                        addTrWithExistModule(module);
                                        getDeviceInfo(idDevice).then(function (d) {
                                            addModuleEvent(idModule, 'Bind with device <b>' + d['model'] + ', sn - ' + d['sn'] + '</b>')
                                        })
                                        notification('Bind card/module with sn <b>' + sn + '</b>');
                                    }
                                }
                            }
                            else {
                                requestForBinding(stockModules, module['sn'], module['descr']);
                            }
                        }
                        else {
                            addTrWithUnknowModule(module);
                        }
                    }
                    else {
                        addTrWithUnknowModule(module);
                    }
                    break;
            }
        }
        return true;
    };
    $parentEl.on('click.innerCards', '.add-module', function () {
        var $tr = $(this).closest('tr'),
                moduleModel = $tr.find('.name').text().trim(),
                sn = $tr.find('td.sn').text().trim(),
                pn = $tr.find('td.pn').text().trim();
        var form = new Form('module');
        form.getForm($('#addModuleToDB'), {model: moduleModel, sn: sn, pn: pn})
                .then(function () {
                    infoMessage($('#addModuleToDB'), '<center>Add module/card to database</center> ');
                    slideToEl($('#modalWindow'), $('#addForm'));
                    return form.eventListener();
                })
                .then(function (idModule) {
                    /*insert card to device*/
                    getDeviceInfo(idDevice).then(function(d){addModuleEvent(idModule,'Bind with device <b>'+d['model']+', sn - '+d['sn']+'</b>')});
                    return updateValue('module_list', 'id_device', idDevice, 'id_module', idModule);
                })
                .then(function () {
                    $tr.removeClass('warning')
                            .find('span.add-module')
                            .remove();
                });
    });
    $parentEl.on('click.innerCards', '.update-el', function () {
        var $tr = $(this).closest('tr'),
                $td = $(this).closest('td'),
                item = $td.data('item'),
                value = $td.find('.value').text().trim(),
                idModule = $tr.data('idModule'),
                idModel = getValue('module_list', 'id_model', 'id_module', idModule),
                idPn;
        if (item === 'pn') {
            idPn = getValue('module_pn', 'id_module_pn', 'pn_name', value);
            if (idPn != 0) {
                updateValue('module_list', 'id_module_pn', idPn, 'id_module', idModule)
                        .then(function () {
                            $td.removeClass('info').text(value);
                        });
            } else {
                $.confirm('<center>P/N <b> ' + value + '</b> does not exist in database.<br> Add to database?</center>')
                        .then(function () {
                            return insertValueListAsync('module_pn', {pn_name: value, id_model: idModel});
                        })
                        .then(function (id) {
                            return updateValue('module_list', 'id_module_pn', id, 'id_module', idModule);
                        })
                        .then(function () {
                            $td.removeClass('info').text(value);
                        });
            }
        }
    });
    $parentEl.on('click.innerCards', '.module-info', function () {
        var $tr = $(this).closest('tr'),
                modelName = $tr.find('.model').text().trim(),
                idModule = $tr.data('idModule'),
                $body,
                body ='\
                            <div class="row">\
                                <div id="moduleInfoPanel" class="col-md-offset-2  col-md-8">\
                                    <button type="button" class="close-module-info-panel close"><span>&times;</span></button>\
                                    <br>\
                                    <div class="alert alert-info"><center><b> Information panel for card/module</b></center></div>\
                                    <div class="title"></div>\
                                    <div id="moduleInfo"></div>\
                                    <div id="moduleDescr"></div>\
                                    <div id="modelDescr"></div>\
                                    <div id="historyModuleEvents"></div>\
                                </div>\
                            </div>\
                        </div>';
        $tr.closest('table').find('tr').removeClass('info');
        
        $parentEl.find('.addition-info').html(body);
        $body=$parentEl.find('#moduleInfoPanel');
        $body.css({border:'solid 1px #ccc',padding:'10px'});
        
        $tr.addClass('info');
        getMainInfo($parentEl.find('#moduleInfo'), 'module', idModule)
                .then(function () {
                    return deviceDescription($parentEl.find('#moduleDescr'), 'module', idModule);
                })
                .then(function () {
                    return modelDescription($parentEl.find('#modelDescr'), 'module', modelName);
                })
                .then(function () {
                    return historyEvents($parentEl.find('#historyModuleEvents'), 'module', idModule);
                })
                .then(function () {
                    return $parentEl.find('.addition-info').slideDown();
                })
                .then(function () {
                    slideToEl($parentEl, $parentEl.find('#moduleInfoPanel'));
                });
                
                
        $parentEl.on('click.modulePanel', '#moduleInfoPanel .close-module-info-panel', function () {
            var $body = $(this).closest('.addition-info');
            $body.slideUp(function () {
                $tr.removeClass('info');
                $(this).empty();
            });
            $parentEl.off('click.modulePanel','**');
        });
    });
    $parentEl.html(body);
    $.loading($parentEl.find('.loading'));
    getMondulesInfoFromDB(idDevice)
            .then(function (data) {
                infoFromDB=data;
                return getMondulesInfoFromDevice(idDevice);
            })
            .then(function (data) {
                infoFromDevice=data;
                var status=createTable($parentEl.find('.section-content'),mergeInfo(infoFromDB, infoFromDevice));
                if(!status){$parentEl.empty()};
                dfd.resolve($parentEl);
                dfd.always($parentEl.off('.cards', '**'));
            });
    return dfd.promise();
};