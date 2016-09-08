var DeleteNotification = function ($parentEl) {
    var showMessage = function (title, body) {
        var dfd = $.Deferred(),
                modal = new Modal(),
                template = '<div class="alert alert-warning">\
                        <center>\
                            <span class="glyphicon glyphicon-warning-sign alert-icon"></span><br>\
                            ' + title + '\
                            </div>\
                        <center>\
                        <div>\
                            ' + body + '\
                        </div>'
        modal.getModal($parentEl)
                .then(function () {
                    modal.addBody(template);
                    modal.show();
                    dfd.resolve();
                });
        return dfd.promise();
    }
    this.devicesInRack = function (devices) {
        var devicesCount = devices.length;
        return showMessage('<b>Remained ' + devicesCount + ' devices in the rack.<br>\
                                You cannot delete this item.</b>', '');
    }
    this.devicesInLabdesk = function (devices) {
        var devicesCount = devices.length;
        return showMessage('<b>Remained ' + devicesCount + ' devices in the labdesk.<br>\
                                 You cannot delete this item.</b>', '');
    }
    this.racksInLab = function (racks) {
        var racksCount = racks.length / 2;
        return showMessage('<b>Remained ' + racksCount + ' racks in the lab.<br>\
                                You cannot delete this item.</b>', '');
    }
    this.devicesInStock = function (devices) {
        var devicesCount = devices.length;
        return showMessage('<b>Remained ' + devicesCount + ' devices which have model.<br>\
                                You cannot delete this item.</b>', '');
    }
    this.modulesInStock = function (modules) {
        var modulesCount = modules.length;
        return showMessage('<b>Remained ' + modulesCount + ' modules/cards which have model.<br>\
                                You cannot delete this item.</b>', '');
    }
    this.devicesOnEmployee = function (devices) {
        var devicesCount = devices.length;
        return showMessage('<b>' + devicesCount + ' devices are assigned on Employee .<br>\
                                You cannot delete this item.</b>', '');
    }
    this.devicesOnTeam = function (devices) {
        var devicesCount = devices.length;
        return showMessage('<b>' + devicesCount + ' devices in team possetion.<br>\
                                You cannot delete this item.</b>', '');
    }
}
var CheckingAssets = function () {
    this.devicesInRack = function (idRack) {
        var dfd = $.Deferred(),
                allDevices = [],
                idBackRack;
        getValues('rack', 'id_rack', idRack)
                .then(function (rack) {
                    console.log(rack);
                    if (rack === 0) {
                        throw('Rack with id_rack = ' + idRack + ' not exist');
                    }
                    else if (rack.id_back_rack == '0') {
                        throw('Rack with id_rack=' + idRack + ' doesn`t have back side');
                    }
                    else {
                        idBackRack = rack.id_back_rack;
                        return getFullValues('devices_in_racks', 'id_rack', idRack);
                    }
                })
                .then(function (frontDevices) {
                    allDevices = allDevices.concat(frontDevices);
                    return getFullValues('devices_in_racks', 'id_rack', idBackRack);
                })
                .then(function (backDevices) {
                    allDevices = allDevices.concat(backDevices);
                    dfd.resolve(allDevices);
                });

        return dfd.promise();
    }
    this.devicesInLabdesk = function (idLabdesk) {
        return getFullValues('devices_in_labdesks', 'id_labdesk', idLabdesk);
    }
    this.racksInLab = function (idLab) {
        return getFullValues('rack', 'id_lab', idLab);
    }
    this.devicesInStock = function (idModel) {
        return getFullValues('device_list', 'id_model', idModel);
    }
    this.modulesInStock = function (idModel) {
        return getFullValues('module_list', 'id_model', idModel);
    }
    this.devicesOnEmployee = function (idEmployee) {
        return getFullValues('device_list', 'id_owner', idEmployee);
    }
    this.devicesOnTeam = function (idTeam) {
        return getFullValues('device_list', 'id_team', idTeam);
    }
}

