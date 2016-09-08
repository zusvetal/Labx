var ModelForm = function (type) {
    var param;
    this.type = type;

    if (this.type === 'device' || this.type === '') {
        param = {
            table: 'device_model',
            pnTable: 'device_pn',
            idPnField: 'id_device_pn'
        };
    }
    else if (this.type === 'module') {
        param = {
            table: 'module_model',
            pnTable: 'module_pn',
            idPnField: 'id_module_pn'
        };
    }
    var typeList = new List('device_type', 'id_device_type', 'name');

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
                action = (options.idModel !== undefined) ? 'update' : 'insert';
        this.idModel = options.idModel;
        this.action = action;
        this.$parentEl = $parentEl;
        $.post(
                "/ajax",
                {
                    get_model_form: '1',
                    type: type
                },
        function (data) {
            $parentEl.html(data);
            /*fill form with option values*/
            if (action === 'update')
            {
                getValues(param.table, 'id_model', options.idModel)
                        .then(function (values) {
                            if (values) {
                                console.log(values)
                                /*image seaction*/
                                if (values.icon_name !== '') {
                                    $parentEl
                                            .find('#imgField')
                                            .attr('data-icon', values.icon_name)
                                            .html('<button type="button" class="close remove-form-image"><span>&times;</span></button>\
                                                 <img src="/icon/' + values.icon_name + '"/>');
                                }
                                else {
                                    $parentEl
                                            .find('#imgField')
                                            .html('<div class="fileUpload btn btn-primary">\
                                                     <span>Upload</span>\
                                                    <input type="file" class="upload-img" accept="image/*" />\
                                                 </div>');
                                }
                                /*device_type section*/
                                typeList.getElementsDropDown($parentEl.find('#type'), function () {
                                    typeList.setElementId(values.id_device_type);
                                    if (values.id_device_type !== '0') {
                                        typeList.setInputVal(getValue('device_type', 'name', 'id_device_type', values.id_device_type));
                                    }
                                });
                                /*other field*/
                                for (var value in values) {
                                    $parentEl.find('[name=' + value + ']').val(values[value]);
                                }
                                /*form factor select*/
                                if (values.id_formfactor !== undefined) {
                                    $parentEl.find('select[name="id_formfactor"] [value=' + values.id_formfactor + ']')
                                            .attr('selected', 'selected');
                                    if (values.id_formfactor !== '1') {
                                        $parentEl.find('#size input')
                                                .val('0')
                                                .attr('disabled', 'disabled')
                                                .closest('tr')
                                                .fadeOut();
                                    }
                                }
                                /*model description section*/
                                if (values.model_comment !== undefined) {
                                    $parentEl.find('#comment').html(values.model_comment)
                                    /*Add editor for textarea element*/
                                    $parentEl.find('#comment').summernote();
                                }
                            }
                            return getValueList(param.pnTable, param.idPnField, 'id_model', options.idModel)
                        })
                        .then(function (pns) {
                            $parentEl.find('#pn')
                                    .html('<tr>\
                                                <td>Part number:</td>\
                                                <td class="pn">\
                                                    <span class="glyphicon glyphicon-plus add-pn small"></span>\
                                                </td>\
                                            </tr>');
                            for (var i in pns) {
                                var pnName = getValue(param.pnTable, 'pn_name', param.idPnField, pns[i]);
                                $parentEl.find('#pn')
                                        .append('<tr>\
                                                    <td></td>\
                                                    <td class="pn addition">\
                                                        <input data-id-pn="' + pns[i] + '" type="text" class="value form-control" value="' + pnName + '">\
                                                        <span class="glyphicon glyphicon-remove small remove-pn-db"></span>\
                                                </td>\
                                            </tr>');
                            }
                            dfd.resolve($parentEl);
                            if (callback && typeof (callback) === "function") {
                                callback();
                            }
                        });
            } else if (action === 'insert') {
                typeList.getElementsDropDown($parentEl.find('#type'), function () {
                    if (options.type !== undefined) {
                        typeList.setInputVal(options.type);
                        typeList.setElementId(getValue('device_type', 'id_device_type', 'name', options.type));
                    }
                });
                for (var option in options) {
                    $parentEl.find('[name=' + option + ']').val(options[option]);
                }
                $parentEl.find('#comment').summernote();
                if (options.id_formfactor !== undefined) {
                    $parentEl.find('select[name="id_formfactor"] [value=' + options.id_formfactor + ']')
                            .attr('selected', 'selected');
                }
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
                idModel = this.idModel,
                dfd = jQuery.Deferred();

        $parentEl.on('click.model', '.remove-pn-db', function () {
            var
                    $btn = $(this),
                    $tr = $btn.closest('tr'),
                    $input = $btn.closest('tr').find('input'),
                    pnName = $input.val(),
                    idPn = $input.data('idPn');
            if (idPn !== 0) {
                $.confirm('<center>Do you really want to remove part number <b>' + pnName + '</b> from device model ?</center>')
                        .then(function () {
                            return  deleteValue(param.pnTable, param.idPnField, idPn);
                        })
                        .then(function () {
                            return $tr.fadeOut('slow');
                        })
                        .then(function () {
                            $tr.remove();
                        });
            }
            else{
                $tr.fadeOut('slow')
                        .then(function(){
                           $tr.remove(); 
                });
            }
        });
        $parentEl.on('click.model', '.add-pn', function () {
            $parentEl.find('#pn')
                    .append('<tr><td></td>\
                            <td class="pn addition">\
                             <input data-id-pn="0"  type="text" class="value form-control">\
                             <span class="glyphicon glyphicon-remove small remove-pn-db"></span>\
                            </td></tr>');
        });
        $parentEl.on('click.model', '.remove-form-image', function () {
            var $img = $parentEl.find('#imgField img'),
                    path = $img.attr('src').split('/'),
                    iconName = path[path.length - 1]; 
            if (idModel) {
                $.confirm('<center>Do you really want to remove image ?</center>')
                        .then(function () {
                            return  updateValue(param.table, 'icon_name', '', 'id_model', idModel);
                        })
                        .then(function () {
                            if (getValue(param.table, 'icon_name', 'icon_name', iconName) === '0') {
                                alert(iconName);
                                $img.fileManage('delete');
                            }
                            $parentEl
                                    .find('#imgField')
                                    .attr('data-icon', '')
                                    .html('<div class="fileUpload btn btn-primary">\
                                <span>Upload</span>\
                                <input type="file" class="upload-img" accept="image/*" />\
                           </div>');
                        });
            } else {
                $parentEl
                        .find('#imgField')
                        .attr('data-icon', '')
                        .html('<div class="fileUpload btn btn-primary">\
                                <span>Upload</span>\
                                <input type="file" class="upload-img" accept="image/*" />\
                           </div>');
            }     
        });
        $parentEl.on('click.model', 'input.upload-img', function () {
            var uploadDir = '/icon/';
            $(this).fileManage('upload', uploadDir, function ($el, fileName) {
                $parentEl.find('#imgField')
                        .attr('data-icon', fileName)
                        .html('\
                                    <button type="button" class="close remove-form-image"><span aria-hidden="true">&times;</span></button>\
                                    <img src="' + uploadDir + fileName + '"/>\
                               ');
                
            });

        });
        $parentEl.on('change.model', 'select.form-factor', function () {
            switch ($(this).val()) {
                case '1':
                    $parentEl.find('#size input')
                            .val('')
                            .removeAttr('disabled')
                            .closest('tr')
                            .fadeIn();
                    break;
                case '2':
                    $parentEl.find('#size input')
                            .val('0')
                            .attr('disabled', 'disabled')
                            .closest('tr')
                            .fadeOut();
                    break;
                case '3':
                    $parentEl.find('#size input')
                            .val('0')
                            .attr('disabled', 'disabled')
                            .closest('tr')
                            .fadeOut();
                    break;
            }
        });
        $parentEl.on('click.model', 'button.submit-model', function (e) {
            var name = $parentEl.find('#name input').val().trim(),
                    idType = typeList.getElementId(),

                    iconName = $parentEl.find('#imgField').data('icon'),
                    size_pattern = /^\d+$/,
                    permission = true,
                    pnNames = [],
                    comment = $parentEl.find('#comment').summernote('isEmpty') ?
                        '' :
                        $parentEl.find('#comment').summernote('code');
            if (type === 'device') {
                var idFormFactor = $parentEl.find('#formFactor select').val(),
                        size = $parentEl.find('#size input').val().trim();

                if (idFormFactor === '1') {
                    if (size === '0' || !size_pattern.test(size)) {
                        $parentEl.find('#size input').css({'border': 'solid 2px red'}).focus();
                        setTimeout(function () {
                            $parentEl.find('#size input').css({'border': 'solid 1px #ccc'});
                        }, 2000);
                        permission = false;
                        return false;
                    }
                }
                if (name === '') {
                    $parentEl.find('#name input').focus();
                    return false;
                }
            }

            $parentEl.find('.pn input')
                    .each(function () {
                        pnNames[pnNames.length] = $(this).val();
                    });
            if (permission) {
                if (action === 'update') {
                    updateValueList(param.table, {model: name, icon_name: iconName, id_device_type: idType, model_comment: comment}, 'id_model', idModel)
                            .then(function () {
                                /*Part number update*/
                                $parentEl.find('.pn input')
                                        .each(function () {
                                            var idPn = $(this).data('idPn'),
                                                    pnName = $(this).val().trim();
                                            /*update exist part number*/
                                            if (idPn !== 0 && pnName !=0 ) {
                                                updateValueList(param.pnTable, {pn_name: pnName}, param.idPnField, idPn);
                                            }
                                            /*add new part number for this model*/
                                            else if (pnName !== '' && pnName !=0) {
                                                insertValueList(param.pnTable, {pn_name: pnName, id_model: idModel});
                                            }
                                        });
                                if (type === 'device')
                                {
                                    updateValueList(param.table, {id_formfactor: idFormFactor, size_in_unit: size}, 'id_model', idModel)
                                            .then(function () {
                                                dfd.resolve(idModel);
                                            });
                                } else if (type === 'module') {
                                    dfd.resolve(idModel);
                                }
                            });
                }
                /*add new device/module*/
                else if (action === 'insert') {
                    if (type === 'device')
                    {
                        idModel = insertValueList(param.table,
                                {model: name,
                                    icon_name: iconName,
                                    id_device_type: idType,
                                    id_formfactor: idFormFactor,
                                    size_in_unit: size,
                                    model_comment: comment
                                }
                        );
                    } else if (type === 'module')
                    {
                        idModel = insertValueList(param.table,
                                {model: name,
                                    icon_name: iconName,
                                    id_device_type: idType,
                                    model_comment: comment
                                }
                        );
                    }
                    pnNames.forEach(function(pnName){
                        insertValueList(param.pnTable, {pn_name: pnName, id_model: idModel});
                    });
                }
                dfd.resolve(idModel);
            }
        });
        $parentEl.on('click.model', '#closeForm', function () {
            $(this).closest('#addForm').remove();
            $parentEl.off('.model', '**');
        });
        return dfd.promise();
    };

};