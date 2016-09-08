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
                    idGlobalLocation = getIdGlobalLocation(),
                    labName = labList.getInputVal();

            if (!numOfUnitPattern.test(numOfUnit) || numOfUnit == '0') {
                $parentEl.find('input.number-of-units').css({'border': 'solid 2px red'});
                setTimeout(function () {
                    $parentEl.find('input.number-of-units').css({'border': 'solid 1px #ccc'});
                }, 2000);
                permission = false;
            }
            if (rackName !== '' && permission === true) {
                var promise = $.when();
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
                                    return updateValue('labs', 'id_global_location', idGlobalLocation, 'id_lab', idLab);
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