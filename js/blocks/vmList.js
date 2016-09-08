var vmList = function ($parentEl, idDevice) {
    var checkHypervisor = function (idDevice) {
        return getInterfaceList(idDevice)
                .then(function (interfaces) {
                    if (objectLength(interfaces) === 0) {
                        return $.Deferred().reject();
                    }
                    for (var interface in interfaces) {
                        if (interfaces[interface].type_name === 'hypervisor') {
                            return true;
                        }
                        return $.Deferred().reject();
                    }
                })
    }
    var writeSectionBody=function(){
            var body = ('\
                <div class="section-header">\
                     <a class=" collapsed" data-toggle="collapse"  href="#cardsCollapse" aria-expanded="true" aria-controls="cardsCollapse">\
                         Vm list\
                     </a>\
                     <span class="glyphicon glyphicon-chevron-down arrow"></span>\
                     </div>\
                     <div id="cardsCollapse" class="section-content collapse in">\
                         <div class="loading"></div>\
                     </div>\
                     <div id="vmEdit" style="display:none"></div>\
                 </div>\
                 ');
        $parentEl.html(body);
    }
    var getVMListTemplate = function (idDevice) {
        return $.get('/get_vm_device_list', {id_device: idDevice});
    }
    var writeVMListTemplate = function (vmListTemplate) {
        $parentEl.find('.section-content').html(vmListTemplate);
    }
    var pingVMHost=function($trVM){
            var pingOkHtml ='<span class="ping ok" data-toggle="tooltip" title="device availiable"></span>',
                pingFailHtml ='<span class = "ping fail" data-toggle = "tooltip" title = "device not availiable"></span>',
                ipVM = $trVM.find('[data-item="virt_ip"]').text().trim();
        console.log(ipVM,$trVM);
       return  ping(ipVM)
                    .then(function (ping) {
                        if (ping) {
                            $trVM.find('.ping-status')
                                    .html(pingOkHtml);
                        }
                        else {
                            $trVM.find('.ping-status')
                                    .html(pingFailHtml);
                        }
                    })
    }
    var pingVMHosts = function () {
        var promise = $.when();
        $parentEl.find('.vm').each(function () {
            var $trVM = $(this);
                pingVMHost($trVM)
//            promise = promise
//                    .then(function () {
//                        return pingVMHost($trVM);
//                    })
        })
        return promise;
    }
    var getVMRow = function (idVirtualMashine) {
    return  $.get(
            '/get_vm_device_tr',
            {
                id_virtual_mashine:  idVirtualMashine
            }
    );
};
    /********************Events**********************************/
    $parentEl.on('click.vmDevice', 'span.edit-device-host', function (event) {
        event.preventDefault();
        var $btn = $(this),
                $tr = $btn.closest('tr.vm'),
                idInterface = $tr.data('idInterface'),
                idVirtualMashine = $tr.data('idVirtualMashine'),
                $formField = $parentEl.find('#vmEdit'),
                form = new VMForm(idInterface),
                $trs = $btn.closest('table').find('tr.vm');
        highlightingRowRemove($trs);
        highlightRow($tr);
        form.getForm($formField, {id_virtual_mashine: idVirtualMashine})
                .then(function (data) {
                    return $formField.slideDown();
                })
                .then(function (data) {
                    return slideToEl($('#modalWindow'), $formField);
                })
                .then(function () {
                    return form.eventListener();
                })
                .then(
                        function () {
                            return $formField.slideUp();
                        },
                        function () {
                            highlightingRowRemove($tr);
                        }
                )
                .then(function () {
                    $formField.empty();
                    highlightingRowRemove($tr);
                    return getVMRow(idVirtualMashine);
                })
                .then(function (vmRowHtml) {
                    var $trNew = $(vmRowHtml).replaceAll($tr);
                    pingVMHost($trNew);
                })
    })
    $parentEl.on('click.vmDevice', 'span.remove-device-host', function (event) {
        event.preventDefault();
        var $btn = $(this),
                $tr = $btn.closest('tr.vm'),
                idInterface = $tr.data('idInterface'),
                idVirtualMashine = $tr.data('idVirtualMashine'),
                $formField = $parentEl.find('#vmEdit');

        $.confirm('Do you want to remove VM')
                .then(function () {
                    return deleteValue('virtual_mashines', 'id_virtual_mashine', idVirtualMashine);
                })
                .then(function () {
                    return $tr.fadeOut();
                })
                .then(function () {
                    return $tr.remove();
                })
    })
    /******************Execution vmList()***********************/
    return checkHypervisor(idDevice)
            .then(
                    function (status) {
                        return getVMListTemplate(idDevice);
                    },
                    function () {
                        console.log('device haven`t hypervisor');
                    }
            )
            .then(function () {
                writeSectionBody();
                return getVMListTemplate(idDevice);
            })
            .then(function (vmListTemplate) {
                writeVMListTemplate(vmListTemplate);
            })
            .then(function () {
                pingVMHosts();
            })

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
