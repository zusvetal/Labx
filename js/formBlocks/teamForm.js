var TeamForm = function (callback) {
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
        this.$parentEl = $parentEl;
        $.post(
                "/ajax",
                {
                    get_team_form: '1'
                },
        function (data) {
            $parentEl.html(data);
            for (var option in options) {
                $('#' + option + ' input').val(options[option]);
            }
            dfd.resolve($parentEl);
            if (callback && typeof (callback) === "function") {
                callback();
            }
        });
        return dfd.promise()
    };
    this.eventListener = function () {
        var $parentEl = this.$parentEl;
        var dfd = jQuery.Deferred();
        $parentEl.on('click.team', 'button.submit-team', function () {
            var name = $parentEl.find('#name input').val().trim(),
                    idGlobalLocation = getIdGlobalLocation(),
                    idTeam;
            if (name !== '') {
                getValueAsync('team', 'id_team', 'team_name', name)
                        .then(function (id) {
                            idTeam = id;
                            return getValueAsync('team', 'id_global_location', 'team_name', name)
                        })
                        .then(function (idGlobal) {
                            if (idTeam && idGlobalLocation === idGlobal) {
                                warnMessage($parentEl.find('.info-field'), 'Team <b>' + name + '</b> already exist', function () {
                                    $parentEl.find('#name input').focus();
                                });
                                return false;
                            }
                            else {
                                idTeam = insertValueList('team', {'team_name': name, id_global_location: idGlobalLocation});
                                dfd.resolve(idTeam);
                                dfd.always($parentEl.off('.team', '**'));
                                if (callback && typeof (callback) === "function") {
                                    callback(idTeam);
                                }
                                $parentEl.empty();
                            }
                        })
            }
            else {
                $parentEl.find('#name input').focus();
            }
        });
        $parentEl.on('click.team', '#closeForm', function () {
            $(this).closest('#addForm').remove();
            $parentEl.off('.team', '**');
        });
        return dfd.promise();
    };
}