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
