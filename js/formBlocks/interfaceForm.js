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
                            return getValues('interfaces', 'id_interface', idInterface)
                        })
                        .then(function (interface) {
                            if (interface) {
                                addDeviceEvent(idDevice, 'Remove interface with ip - "' + interface['ip'] + '", host - "' + interface['host'] + '" ');
                            }
                            return deleteValue('interfaces', 'id_interface', idInterface)
                        })
                        .then(function () {
                            return $interface.fadeOut();
                        })
                        .then(function () {
                            $interface.remove();
                        });
            }
            else {
                $interface.fadeOut(function () {
                    $interface.remove();
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
            
            var $interfaces=$parentEl.find('.interface');
            
            if (!$interfaces.exists()) {
                dfd.resolve();
                dfd.always($parentEl.off('.interface', '**'));
                
                return false;
            }
            
            if (valid) {
                /*insert/update interface value*/
                $interfaces.each(function (index) {
                    var $interface = $(this),
                            ip = $interface.find('.ip').val().trim(),
                            host = $interface.find('.hostname').val().trim(),
                            idType = $interface.find('.type :selected').val(),
                            idInterface = $interface.data('idInterface') !== 0 ? $interface.data('idInterface') : insertValue('interfaces', 'id_device', idDevice);
                    getValues('interfaces', 'id_interface', idInterface)
                            .then(function (interface) {
                                if (interface['ip'] === '' && interface['host'] === '') {
                                    addDeviceEvent(idDevice, 'Add new interface with ip - "' + ip + '", host - "' + host + '" ');
                                } else if (interface['ip'] !== ip || interface['host'] !== host) {
                                    addDeviceEvent(idDevice, 'Change interface  ip - "' + interface['ip'] + '", host - "' + interface['host'] + '"  to "' + ip + '", "' + host + '"');
                                }
                                return updateValueList('interfaces', {ip: ip, host: host, id_type: idType}, 'id_interface', idInterface);
                            })
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