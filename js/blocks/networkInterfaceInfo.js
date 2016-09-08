var netInterfaceInfo = function ($parentEl, idDevice) {
    var dfd = jQuery.Deferred(),
            count, status, field, ip, host,interfaceType,
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
    getInterfaceList(idDevice)
            .then(function (interfaces) {
                count = Object.keys(interfaces).length;
                if (count === 1) {
                    for (var id in interfaces) {
                        console.log(interfaces);
                        ip = interfaces[id]['ip'];
                        host = (interfaces[id]['type_name']!=='hypervisor')
                                ? interfaces[id]['host']
                                :interfaces[id]['host']+' ('+interfaces[id]['type_name']+')';
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

    return dfd.promise();
}; 