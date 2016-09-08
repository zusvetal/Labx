var EmployeeForm = function () {
    var teamList = new List('team', 'id_team', 'team_name');
    this.getForm = function ($parentEl, options, callback) {
        if (typeof options === 'function') {
            /*define method argument*/
            callback = options;
            options = {};
        }
        else if (options === undefined) {
            options = {};
        }
        /***********************************/
        var action = (options.id_employee !== undefined) ? 'update' : 'insert',
                dfd = jQuery.Deferred();
        this.$parentEl = $parentEl;
        this.idEmployee = options.id_employee;
        this.action = action;
        $.post(
                "/ajax",
                {
                    get_employee_form: '1'
                },
        function (data) {
            $parentEl.html(data);
            if (action === 'update') {
                getValues('staff', 'id_employee', options.id_employee)
                        .then(function (values) {
                            if (values) {
                                console.log(values);
                                /*team name section*/
                                teamList.getElementsDropDown($parentEl.find('#team'), function () {
                                    teamList.setElementId(values.id_team);
                                    getValueAsync('team', 'team_name', 'id_team', values.id_team)
                                            .then(function (id) {
                                                if (id) {
                                                    teamList.setInputVal(id);
                                                }
                                            })
                                });
                                /*other field*/
                                for (var value in values) {
                                    $parentEl.find('input[name=' + value + ']').val(values[value]);
                                }
                            }
                            dfd.resolve($parentEl);
                            if (callback && typeof (callback) === "function") {
                                callback();
                            }
                        });
            } else if (action === 'insert') {
                teamList.getElementsDropDown($parentEl.find('#team'), function () {
                    if (options.team !== undefined) {
                        teamList.setInputVal(options.team);
                        teamList.setElementId(getValue('team', 'id_team', 'team_name', options.team));
                    }
                });
                for (var option in options) {
                    $('#' + option + ' input').val(options[option]);
                }
                dfd.resolve($parentEl);
                if (callback && typeof (callback) === "function") {
                    callback();
                }
            }
        });
        return dfd.promise();
    };
    this.eventListener = function (callback) {
        var $parentEl = this.$parentEl,
                dfd = jQuery.Deferred(),
                action = this.action,
                idEmployee = this.idEmployee;
        $parentEl.on('click.employee', 'button.submit-employee', function () {
            var idTeam = teamList.getElementId(),
                    name = $parentEl.find('#name input').val().trim(),
                    teamName = teamList.getInputVal(),
                    idGlobalLocation = getIdGlobalLocation();
            if (name !== '') {
                var promise = $.when();
                if (idTeam === '0') {
                    if (teamName === '') {
                        promise = promise
                                .then(function () {
                                    return $.when();
                                });
                    }
                    else {
                        promise = promise
                                .then(function () {
                                    return $.confirm("<center><b>" + teamName + "</b> not exist in the db.<br/> Add team <b>'" + teamName + "'</b> to database?</center>");
                                })
                                .then(
                                        function () {
                                            idTeam = teamList.addElementToDb(teamName);
                                            return $.when();
                                        },
                                        function () {
                                            teamList.focusToInputField();
                                            return $.Deferred();
                                        }
                                )
                                .then(function () {
                                    return updateValue('team', 'id_global_location', idGlobalLocation, 'id_team', idTeam);
                                })
                    }
                }
                if (action === 'insert') {
                    promise = promise
                            .then(function () {
                                idEmployee = insertValue('staff', 'employee_name', name);
                                return $.when();
                            })
                }
                promise
                        .then(function () {
                            return updateValueList('staff', {employee_name: name, id_team: idTeam, id_global_location: idGlobalLocation}, 'id_employee', idEmployee);
                        })
                        .then(function () {
                            dfd.resolve(idEmployee);
                            dfd.always($parentEl.off('.employee', '**'));
                            if (callback && typeof (callback) === "function") {
                                callback(idEmployee);
                            }
                            $parentEl.empty();
                        });
            }
        });
        $parentEl.on('click.employee', '#closeForm', function () {
            $(this).closest('#addForm').remove();
            $parentEl.off('.employee', '**');
        });
        return dfd.promise();
    };
};