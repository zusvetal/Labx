/******************************************************************************/
/***************************** Add labdesk**********************************/
/******************************************************************************/
var insertLabdesk = function (name) {
    return insertValue('labdesks','name',name);
};

$('span.add').on('click', function () {
    $('table tr:nth-of-type(1)').before('\
                    <tr class="rack">\
                        <td class="value" data-item="name"></td>\
                        <td class="hide-td"><span class="glyphicon glyphicon-remove remove"></span></td>\
                    </tr>');
    $('table tr:nth-of-type(1)').find('.value').each(function () {
        var td = $(this);
        $(td).html('<input class="input-value form-control" type="text">');
    });
});


$('table').on('keypress', 'input', function (event) {
    var key = event.which,
            input = $(this),
            tr = $(input).closest('tr'),
            value,
            td,
            item,
            name,
            idLabdesk;
    if (key === 13) {   /*press Enter*/
        name=$(tr).find('[data-item="name"] input').val();
        $(tr).find('[data-item="name"]').text(name);
        idLabdesk = insertLabdesk(name);    
        $(tr).find('input').each(function () {
            value = $(this).val();
            td = $(this).closest('td');
            item = $(td).attr('data-item');
            $(td).text(value);
            if (item !== 'name') {
               updateValue('labdesks', item, value, 'id_labdesk', idLabdesk);
            }
        });
        $('table tr:last-of-type()').after(tr);
        $(tr).attr('data-id-labdesk', idLabdesk);
        highLightNewEntry(tr);
    }
});
/******************************************************************************/
/***************************** delete labdesk**********************************/
/******************************************************************************/

$('table').on('click', '.remove', function () {
    var $tr = $(this).closest('tr'),
            idRack = $tr.attr('data-id-labdesk');
    $.confirm("Do you want to remove this labdesk?")
            .then(function () {
                deleteValue('labdesks', 'id_labdesk', idRack);
                return $tr.fadeOut('slow');
            })
            .then(function () {
                $tr.remove();
            });
});
/*******************************************************/

//$('table').after('<button id="checkModules" class="btn btn-block btn-success">Checking...</button><br><div id="workField" class="well"><div>');
//
//$('#checkModules').on('click', function () {
//    $.ajaxSetup({
//        timeout: false
//    })
//    getValueList('device_list', 'id_device', 'id_global_location', '1')
//            .then(function (ids) {
////                ids = ['342', '343', '344','1000']
//                for (var i in ids) {
//                    getDeviceInfo(ids[i])
//                            .then(function (device) {
//                                if (device) {
//                                    var idDevice = device['id_device'];
//                                    $('#workField').prepend('<div id="' + idDevice + '" class="well">\
//                                                            <hr>\
//                                                            <b>' + device['model'] + ', S/N: ' + device['sn'] + '</b>\
//                                                            <span class="status"></span>\
//                                                            <div class="notification"></div>\
//                                                        </div>')
//                                    return checkDeviceModulesChanges($('#' + idDevice).find('.notification'), idDevice);
//                                }
//                                else{
//                                    
//                                  return $.Deferred();  
//                                }                               
//                            })
//                            .then(function (data) {
//                                
//                                if(data.status){
//                                    console.log(data.id)
//                                    $('#' + data.id).find('.status').html('<span class="badge">Checked!</span>')
//                                }
//                                else{
//                                   $('#' + data.id).find('.status').html('<span class="badge">This device doesn`t check</span>') 
//                                }
//                                
//                            })
//                            
//                }
//            })
//})

