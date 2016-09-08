var Form = function (type, callback) {
    var param,
            idGlobalLocation = getIdGlobalLocation();
    this.type = type;
    if (this.type === 'device' || this.type === '') {
        param = {
            tableModel: 'device_model',
            type: 'device',
            tableList: 'device_list',
            idField: 'id_device',
            tablePn: 'device_pn',
            idPnField: 'id_device_pn'
        };
    }
    else if (this.type === 'module') {
        param = {
            tableModel: 'module_model',
            type: 'module',
            tableList: 'module_list',
            idField: 'id_module',
            tablePn: 'module_pn',
            idPnField: 'id_module_pn'
        };
    }
    var ownerList = new List('staff', 'id_employee', 'employee_name');
    var teamList = new List('team', 'id_team', 'team_name');
    var modelList = new List(param.tableModel, 'id_model', 'model', {width: '9'});
    var pnList = new List(param.tablePn, param.idPnField, 'pn_name', {addition: {col: 'id_model', value: '0'}});
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

        var dfd = jQuery.Deferred(),
                /*form can be for add new device or edit old*/
                action = (options.id !== undefined) ? 'update' : 'insert';
        this.$parentEl = $parentEl;
        this.id = options.id;
        this.action = action;

        $.post(
                "/ajax",
                {
                    get_add_new_to_stock: param.type
                },
        function (data) {
            $parentEl.html(data);
            if (action === 'update')
            {
                getValues(param.tableList, param.idField, options.id)
                        .then(function (values) {
                            if (values) {
                                /*Section with dropdown elements*/
                                console.log(values);
                                pnList = new List(param.tablePn, param.idPnField, 'pn_name', {addition: {col: 'id_model', value: values.id_model}});
                                pnList.getElementsDropDown($parentEl.find('#pn'), function () {
                                    pnList.setElementId(values[param.idPnField]);
                                    if (values[param.idPnField] !== '0') {
                                        pnList.setInputVal(getValue(param.tablePn, 'pn_name', param.idPnField, values[param.idPnField]));
                                    }
                                });
                                ownerList.getElementsDropDown($parentEl.find('#deviceOwner'), function () {
                                    ownerList.setElementId(values.id_owner);
                                    if (values.id_owner !== '0') {
                                        ownerList.setInputVal(getValue('staff', 'employee_name', 'id_employee', values.id_owner));
                                    }

                                });
                                modelList.getElementsDropDown($parentEl.find('#modelDevice'), function () {
                                    modelList.setElementId(values.id_model);
                                    if (values.id_model !== '0') {
                                        modelList.setInputVal(getValue(param.tableModel, 'model', 'id_model', values.id_model));
                                    }
                                });
                                teamList.getElementsDropDown($parentEl.find('#deviceTeam'), function () {
                                    teamList.setElementId(values.id_team);
                                    if (values.id_team !== '0') {
                                        teamList.setInputVal(getValue('team', 'team_name', 'id_team', values.id_team));
                                    }
                                });
                                /*device/card description section*/
                                if (values.comment !== undefined) {
                                    $parentEl.find('#comment').html(values.comment)
                                    /*Add editor for textarea element*/
                                    $parentEl.find('#comment').summernote();
                                }
                                /*other field*/
                                for (var value in values) {
                                    $parentEl.find('[name=' + value + ']').val(values[value]);
                                }
                                dfd.resolve($parentEl);
                                if (callback && typeof (callback) === "function") {
                                    callback();
                                }
                            }
                        });
            }
            else if (action === 'insert') {
                pnList.getElementsDropDown($parentEl.find('#pn'), function () {
                    if (options.pn !== undefined) {
                        pnList.setInputVal(options.pn);
                        pnList.setElementId(getValue(param.tablePn, param.idPnField, 'pn_name', options.pn));
                    }
                });
                ownerList.getElementsDropDown($parentEl.find('#deviceOwner'), function () {
                    if (options.owner !== undefined) {
                        ownerList.setInputVal(options.owner);
                        ownerList.setElementId(getValue('staff', 'id_employee', 'employee_name', options.owner));
                    }
                });
                modelList.getElementsDropDown($parentEl.find('#modelDevice'), function () {
                    if (options.model !== undefined) {
                        modelList.setInputVal(options.model);
                        modelList.setElementId(getValue(param.tableModel, 'id_model', 'model', options.model));
                    }
                });
                teamList.getElementsDropDown($parentEl.find('#deviceTeam'), function () {
                    if (options.team !== undefined) {
                        teamList.setInputVal(options.team);
                        teamList.setElementId(getValue('team', 'id_team', 'team_name', options.team));
                    }
                });
                for (var option in options) {
                    $parentEl.find('#' + option + ' input').val(options[option]);
                }
                $parentEl.find('#comment').summernote();
                dfd.resolve($parentEl);
                if (callback && typeof (callback) === "function") {
                    callback();
                }
            }
        });
        return dfd.promise();
    };
    this.eventListener = function () {
        var $parentEl = this.$parentEl,
                action = this.action,
                idElement = this.id,
                modelForm = new ModelForm(param.type),
                dfd = jQuery.Deferred();
        $parentEl.on('click.form', 'button.submit', function () {
            var $btn = $(this),
                    $form = $btn.closest('#addForm'),
                    $inputs = $form.find('.value'),
                    idEmployee = ownerList.getElementId(),
                    idModel = modelList.getElementId(),
                    idTeam = teamList.getElementId(),
                    idPn = pnList.getElementId(),
                    comment = $parentEl.find('#comment').summernote('isEmpty')?'':
                            $parentEl.find('#comment').summernote('code'),
                    idGlobalLocation=getIdGlobalLocation(),
                    item,
                    value,
                    modelName,
                    count,
                    pn = pnList.getInputVal(),
                    modelName = modelList.getInputVal(),
                    ownerName = ownerList.getInputVal(),
                    teamName = teamList.getInputVal();
            if (modelName !== '') {
                /**checking the existence of team and owner**/
                var promise = $.when();
                if (idModel === '0') {
                    promise = promise
                            .then(function () {
                                return $.confirm("<center>Model <b> " + modelName + "</b> not exist in the db.<br/> Add <b>'" + modelName + "'</b> to model database?</center>");
                            })
                            .then(
                                    function () {
                                        /*model form*/
                                        $btn.hide();
                                        $form.find('input').attr('disabled', 'disabled');
                                        $form.find('button').attr('disabled', 'disabled');
                                        $('#modalWindow').css('overflow-y', 'auto');
                                        infoMessage($parentEl.find('.info-field'),
                                                "<center> Add model <b>" + modelName + "</b> to database.</center>");
                                        return modelForm.getForm($parentEl.find('#modelForm'), {model: modelName}, slideToEl($('#modalWindow'), $parentEl.find('.info-field')));
                                    },
                                    function () {
                                        /*focus on model name input and exit from chain*/
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
                            });
                }
                if (idPn === '0' && pn !== '') {
                    promise = promise
                            .then(function () {
                                return $.confirm("<center>P/N  <b>" + pn + "</b> for model <b>" + modelName + "</b> not exist in the db.\n Add P/N <b>'" + pn + "'</b> to database?</center>");
                            })
                            .then(
                                    function () {
                                        idPn = pnList.addElementToDb(pn, {id_model: idModel});

                                    },
                                    function () {
                                        return $.when();
                                    }
                            );
                }
                if (idEmployee === '0' && ownerName !== '') {
                    promise = promise
                            .then(function () {
                                return $.confirm("<center>Employee <b>" + ownerName + "</b> not exist in the db.\n Add employee <b>'" + ownerName + "'</b> to database?</center>");
                            })
                            .then(
                                    function (result) {
                                        idEmployee = ownerList.addElementToDb(ownerName,{id_global_location:idGlobalLocation});
                                    },
                                    function (result) {
                                        return $.when();
                                    }
                            );
                }
                if (idTeam === '0' && teamName !== '') {
                    promise = promise
                            .then(function () {
                                return $.confirm("<center>Team <b>" + teamName + "</b> not exist in the db.\n Add team <b>'" + teamName + "'</b> to database?</center>");
                            })
                            .then(
                                    function (result) {
                                        idTeam = teamList.addElementToDb(teamName,{id_global_location:idGlobalLocation});
                                    },
                                    function (result) {
                                        return $.when();
                                    }
                            );
                }
                if (action === 'insert') {
                    promise = promise
                            .then(function () {
                                idElement = insertValue(param.tableList, 'id_model', idModel);
                                return $.when();
                            });
                }
                promise = promise
                        .then(function () {
                            var updateParams = {id_model: idModel,
                                id_team: idTeam,
                                id_owner: idEmployee,
                                id_global_location: idGlobalLocation,
                                sn: $parentEl.find('[name="sn"]').val(),
                                pn: $parentEl.find('[name="pn"]').val(),
                                asset_gl: $parentEl.find('[name="asset_gl"]').val(),
                                asset_harmonic: $parentEl.find('[name="asset_harmonic"]').val(),
                                comment: comment
                            };
                            updateParams[param.idPnField] = idPn;
                            return updateValueList(param.tableList, updateParams, param.idField, idElement);
                        });
                promise
                        .then(function () {
                            $parentEl.empty();
                            console.log('resolve, id: ', idElement);
                            dfd.resolve(idElement);
                            dfd.always($parentEl.off('.form', '**'));
                            if (callback && typeof (callback) === "function") {
                                callback(idElement);
                            }
                        });
            }
            else {
                modelList.focusToInputField();
            }

        });
        $parentEl.on('click.form', '#closeForm', function () {
            $(this).closest('#addForm').remove();
            $parentEl.off('.form', '**');
            dfd.reject(idElement);
        });
        modelList.changeElement(function (event, idModel) {
            pnList.destroyEvents();
            pnList = new List(param.tablePn, param.idPnField, 'pn_name', {addition: {col: 'id_model', value: idModel}});
            pnList.getElementsDropDown($parentEl.find('#pn'));
        });
        return dfd.promise();
    };
};