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




