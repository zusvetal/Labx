var category = $('#content').data('category'),
        table = category + '_model';
/******************************************************************************/
/***************************** Add model **********************************/
/******************************************************************************/
$('#content').on('click', 'span.add', function () {
    var modal = new Modal(),
            form = new ModelForm(category);
    modal.getModal($('#addNewModel'))
            .then(function () {
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    document.location.reload();
                });
                return form.getForm(modal.getBodyField())
            })
            .then(function () {
                modal.setWidth('30%');
                modal.setTitle('Add device model');
                modal.show()
                return form.eventListener();
            })
            .then(function () {
                modal.hide();
            })


});
/******************************************************************************/
/*************************** edit model   *************************************/
/******************************************************************************/
$('#content').on('click', 'span.edit-model', function () {
    var modal = new Modal(),
            form = new ModelForm(category),
            idModel=$(this).closest('tr').data('idModel'),
            $tr=$(this).closest('tr');
    modal.getModal($('#addNewModel'))
            .then(function () {
                $('#content').on('hidden.bs.modal', modal.object, function () {
                    document.location.reload();
                });
                return form.getForm(modal.getBodyField(),{idModel:idModel})
            })
            .then(function () {
                $tr.addBack('info');
                modal.setWidth('30%');
                modal.setTitle('Edit model information');
                modal.show()
                return form.eventListener();
            })
            .then(function () {
                modal.hide();
            })
});

/******************************************************************************/
/*************************** update model name  *******************************/
/******************************************************************************/
$('#content').on('dblclick', 'td.model-name', function () {
    var td = $(this),
            targetEl = event.target,
            value = $(td).text();
    if ($(targetEl).is('td')) {
        $(td).html('<input class="update input-value form-control" type="text">')
                .find('input').val(value);
    }
});

$('#content ').on('keypress', 'input.update', function (event) {
    var key = event.which,
            $input = $(this),
            modelName = $input.val(),
            idModel = $input.closest('tr')
            .data('idModel');
    if (key === 13) {   /*press Enter*/
        updateValue(table, 'model', modelName, 'id_model', idModel, function () {
            $input.closest('td').text(modelName);
        });
    }
});



/******************************************************************************/
/***************************** delete model **********************************/
/******************************************************************************/

$('table').on('click', '.remove', function () {
    var $tr = $(this).closest('tr'),
            idModel = $tr.attr('data-id-model'),
            $img=$tr.find('.img img');
    $.confirm("Do you want to remove this model?")
            .then(function () {
                $img.fileManage('delete');
                deleteValue(table, 'id_model', idModel);
                return $tr.fadeOut('slow')
            })
            .then(function () {
                $tr.remove();
            })
});




/******************************************************************************/
/************************** bind model with set port **************************/
/******************************************************************************/



var getPortSetList = function (idModel, modelName) {
    $.post(
            "/ajax",
            {
                get_port_set_list: '1'
            },
    function (data) {
        $('#portSetList').html(data);
        $('#setList').modal({show: true});
        $('#setList').data('idModel', idModel);
        $('#modelName').html(modelName);
    });
};

/*Open modal window*/
$('#content').on('click', 'td.port-set', function () {
    var tr = $(this).closest('tr'),
            idModel = $(tr).data('idModel'),
            modelName = $(tr).find('td:nth-of-type(2)').text();

    getPortSetList(idModel, modelName);
});

/*choose port set for model*/
$('#content').on('click', '#setList tr.item', function (e) {
    var target = e.target,
            tr = $(this),
            table = $(tr).closest('table'),
            idPortSet = $(tr).data('idPortSet');
    if (!$(target).hasClass("span.remove")) {
        $(table).find('tr').removeClass('info');
        $(tr).addClass('info');
        $(table).data('idPortSet', idPortSet);
        $(tr).closest(".modal-content")
                .find(".modal-footer").slideDown();
    }
});

/*submit choosing port set for models*/
$('#content').on('click', 'button.submit', function () {
    var idModel = $('#setList').data('idModel'),
            idPortSet = $('#setList').find('table').data('idPortSet'),
            portSet = $('tr[data-id-port-set="' + idPortSet + '"] td:nth-of-type(2)');
    updateValue(table, 'id_port_set', idPortSet, 'id_model', idModel);
    $('#setList').modal('hide');
    $('tr[data-id-model="' + idModel + '"] td.port-set').html(portSet);


});

/******************************************************************************/
/***************************** add set port **********************************/
/******************************************************************************/
var getPortList = function () {
    var ports;
    $.post(
            "/ajax",
            {
                get_port_list: '1'

            },
    function (data) {
        ports = JSON.parse(data.trim());
        for (idPort in ports) {
            $('#portList').append('<div class="port" data-id-port="' + idPort + '">' + ports[idPort] + '</div>');
        }
        $('#portList').append('<span class="add-port glyphicon glyphicon-plus"></span>');

    });
}
var insertPortListPortSet = function (idPort, idPortSet) {
    $.post(
            "/ajax",
            {
                'insert_port_list_port_set': '1',
                'id_port': idPort,
                'id_port_set': idPortSet

            },
    function (data) {
    });
};

$('#portSetList').on('click', 'span.add-port-set', function () {
    $('#portSetList table tr:nth-of-type(1)').before('\
                    <tr class="center new-item" id="portSetName">\
                        <td colspan="2" class="value"><input class="port-set input-value form-control" type="text" placeholder="port set name"></td>\
                    </tr>');
    $(this).slideUp();
});

$('#portSetList').on('keypress', 'input.port-set', function (event) {
    var key = event.which,
            input = $(this),
            tr = $(input).closest('tr'),
            value = $(input).val(),
            td = $(input).closest('td');
    if (key === 13) {   /*press Enter*/
        $(td).text(value);
        $(tr).after('\
                <tr class="new-item">\
                    <td id="portList"></td>\
                    <td id="portSet"></td>\
                </tr>\
                <tr class="center new-item">\
                    <td colspan="2">\
                        <button type="button" class="btn btn-primary add-port-set">add port set</button>\
                    </td>\
                </tr>\
');
        getPortList();
    }

});

$('#portSetList').on('click', '#portList div.port', function () {
    var port = $(this),
            tr = $(port).closest('tr');
    $('#portSet').append(port);
});

$('#portSetList').on('click', 'td#portSet div.port', function () {
    var port = $(this);
    $('#portList').append(port);
});

/** click add port set**/
$('#portSetList').on('click', 'button.add-port-set', function () {
    var port,
            idPort,
            tr = $(port).closest('tr'),
            portSetName = $('#portSetName').text().trim(),
            idPortSet = insertValue('port_set', 'name', portSetName),
            portSet = $('#portSet');
    $(portSet).find('div.port').each(function () {
        port = $(this),
                idPort = $(port).data('idPort');
        insertPortListPortSet(idPort, idPortSet);
    });
    $('#portSetList  tr:last-of-type()').after('\
                <tr class="item">\
                        <td class="name">' + portSetName + '</td>\
                        <td class="set-port"></td>\
                        <td class="hide-td"><span class="glyphicon glyphicon-remove remove"></span></td>\
                    </tr>');
    $('#portSetList table tr:last-of-type() td.set-port').html(portSet);
    $('span.add-port-set').slideDown(); /*add plus */
    $('#portSetList tr.new-item').slideUp().remove();
    tr = $('#portSetList table tr:last-of-type()');
    $(tr).attr('data-id-port-set', idPortSet)
    highLightNewEntry(tr);
});
/******************************************************************************/
/*****************************  delete set port **********************************/
/******************************************************************************/

$('#portSetList').on('click', '#setList .remove', function () {
    var $tr = $(this).closest('tr'),
            idPortSet = $tr.data('idPortSet');
    $.confirm("Do you want to remove this entry?")
            .then(function () {
                deleteValue('port_set', 'id_port_set', idPortSet);
                deleteValue('port_list_port_set', 'id_port_set', idPortSet);
                return updateValue('device_model', 'id_port_set', '0', 'id_port_set', idPortSet);
            })
            .then(function () {
                return  updateValue('module_model', 'id_port_set', '0', 'id_port_set', idPortSet);
            })
            .then(function () {
                return $tr.fadeOut('slow');
            })
            .then(function () {
                return $tr.remove();
            });

});



/******************************************************************************/
/***************************** add availiable ports **********************************/
/******************************************************************************/
$('#portSetList').on('click', 'span.add-port', function () {
    $(this).before('<div>\
                        <input type="text"  class="form-control add-port" placeholder="new port">\n\
                    </div>');
});


$('#portSetList').on('keypress', 'input.add-port', function (event) {
    var key = event.which,
            input = $(this),
            tr = $(input).closest('tr'),
            value = $(input).val(),
            div = $(input).closest('div'),
            idPort;
    if (key === 13) {   /*press Enter*/
        idPort = insertValue('port_list', 'name', value);
        $(div).text(value)
                .addClass('port')
                .attr('data-id-port', idPort);
    }

});

/******************************************************************************/
/***************************** upload image **********************************/
/******************************************************************************/

$('#content').on('click', 'input.upload', function () {
    var idModel = $(this).closest('tr').data('idModel'),
            uploadDir = '/icon/';
    $(this).fileManage('upload', uploadDir, function (el, fileName) {
        el.closest('td').html('<div class="img">\
                                    <button type="button" class="close remove-image"><span aria-hidden="true">&times;</span></button>\
                                    <img width="85" height="40" src="' + uploadDir + fileName + '"/>\
                               </div>');
        updateValue(table, 'icon_name', fileName, 'id_model', idModel)
    });
});

/******************************************************************************/
/***************************** delete image **********************************/
/******************************************************************************/

$('#content').on('click', 'button.remove-image', function () {
    var $imgBlock = $(this).closest('div.img'),
            $img = $imgBlock.find('img'),
            idModel = $imgBlock.closest('tr')
            .data('idModel'),
            path = $img.attr('src').split('/'),
            iconName = path[path.length - 1];   
    updateValue(table, 'icon_name', '', 'id_model', idModel, function () {
        if(getValue(table, 'icon_name', 'icon_name', iconName)==='0'){
            $img.fileManage('delete');
        }
        $imgBlock.closest('td').html('\
                        <div class="fileUpload btn btn-primary">\
                            <span>Upload</span>\
                            <input type="file" class="upload" accept="image/*" />\
                        </div>\
                    ')
    });
});
