var VMForm = function (idInterface) {
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
        var dfd = jQuery.Deferred();
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
                    if (action === 'update') {
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
                                    dfd.resolve($parentEl);
                                    if (callback && typeof (callback) === "function") {
                                        callback();
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
        return dfd.promise();
    }
    this.eventListener = function () {
        var $parentEl = this.$parentEl,
                action = this.action,
                idInterface = this.idInterface,
                idVirtualMashine = this.idVirtualMashine,
                ipPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                dfd = jQuery.Deferred();
        $parentEl.on('click.vm', 'button.submit-vm', function (e) {
            console.log('submit');
            var $ipInput = $parentEl.find('[name="virt_ip"]'),
                    ip = $ipInput.val(),
                    host = $parentEl.find('[name="virt_host"]').val(),
                    os = $parentEl.find('[name="os"]').val(),
                    valid = true,
                    comment = $parentEl.find('#comment').summernote('isEmpty') ?
                        '' :
                        $parentEl.find('#comment').summernote('code');
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
        $parentEl.on('click.vm', '#closeForm', function () {
            $parentEl.empty();
            $parentEl.off('.vm', '**');
            dfd.reject();
        });
        return dfd.promise();
    }
}
