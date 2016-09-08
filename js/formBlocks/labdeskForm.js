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
