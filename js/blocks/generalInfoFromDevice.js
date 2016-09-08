var generalDeviceInfoTable = function ($parentEl, idDevice) {
    var dfd = jQuery.Deferred(),
            modelName, //= getValue('device_model', 'model', 'id_model', getValue('device_list', 'id_model', 'id_device', idDevice)),
        ip, info, sn, access,
        body='<div class="section-header">\
                    <a class=" collapsed" data-toggle="collapse"  href="#genInfoCollaps" aria-expanded="true" aria-controls="genInfoCollapse">\
                        Information got from the device\
                    </a>\
                    <span class="glyphicon glyphicon-chevron-down arrow"></span>\
                </div>\
                <div id="genInfoCollaps"" class="section-content collapse in">\
                   <div class="loading"></div>\
                </div>';
    var createTable = function (idTable, objList) {
        var table = '<table class="table"  id="' + idTable + '">';
        for (var item in objList) {
            table += '<tr>\
                    <td>' + item + '</td>\
                    <td>' + objList[item] + '</td>\
        </tr>';
        }
        table += '</table>';
        return table;
    }; 
    var getDeviceInfoFromInterface = function (ipDevice, infoDevice, oldPromise) {
        var newPromise = oldPromise
                .then(function () {
                    return ping(ipDevice);
                })
                .then(function (ping) {
                    if (!ping) {
                        return $.Deferred().reject();
                    }
                    return infoDevice.general();
                })
        return newPromise;
    }
    var printDeviceInfo = function (oldPromise) {
        var newPromise = oldPromise
                .then(
                        function (generalInfo) {
                            if (generalInfo) {
                                sn = generalInfo['S/N'];
                                $parentEl.find('.section-content')
                                        .html(createTable('deviceInfoTable', generalInfo));
                                $parentEl.find('#deviceInfoTable').css('font-style', 'italic');
                                return $.Deferred().resolve();
                            }
                            else {
                                return $.Deferred().reject();
                            }
                        },
                        function () {
                            return $.Deferred().reject();
                        }
                )
        return newPromise;
    }
    var getSnFromDb = function (oldPromise) {
        var newPromise = oldPromise
                .then(
                        function () {
                            return getValueAsync('device_list', 'sn', 'id_device', idDevice);
                        },
                        function () {
                            return $.Deferred().reject();
                        })
        return newPromise;
    }
    var writeSnToDb=function(oldPromise){
        var newPromise=oldPromise
                .then(
                        function (dbSn) {
                            if (!dbSn) {
                                updateValue('device_list', 'sn', sn, 'id_device', idDevice);
                                $parentEl.prepend('<div class="info-message"></div>');
                                infoMessage($parentEl.find('.info-message'),
                                        'Serial number ' + sn + ' add to database'
                                        );
                            }
                            return $.Deferred().resolve();
                        },
                        function () {
                            return $.Deferred().reject();
                        }
                )
        return newPromise;
    }
   

    $parentEl.html(body);
    $.loading($parentEl.find('.loading'));
    var promise = $.when();    
    getDeviceInfo(idDevice)
            .then(function (data) {
                modelName = data['model'];
                return getInterfaceList(idDevice);
            })
            .then(function (interfaces) {
                var info,
                        promise = $.when();
                for (var id in interfaces) {
                    var ip = interfaces[id]['ip'];
                    info = new GettingInfoFromDevice(modelName, ip);
                    if (info.abilityGettingInfo && (ip !== '' && ip !== '0.0.0.0')) {
                        promise = getDeviceInfoFromInterface(ip, info, promise);
                        promise = printDeviceInfo(promise);
                        promise = getSnFromDb(promise);
                        promise = writeSnToDb(promise);
                        promise = promise
                                .then(
                                        function () {
                                            dfd.resolve($parentEl);
                                            
                                            /*interrupt chain*/
                                            return $.Deferred();
                                        },
                                        function () {
                                            return $.when();
                                        }
                                );
                    }
                }
                promise
                        .then(function () {
                            $parentEl.empty();
                            dfd.resolve('impossible to get information from device');
                        });
            }); 
    return dfd.promise();
};
