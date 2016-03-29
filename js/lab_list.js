/********************** Add lab **********************/
var insertLab = function (name) {
    return insertValue('labs','name',name);
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
            idLab;
    if (key === 13) {   /*press Enter*/
        name=$(tr).find('[data-item="name"] input').val();
        $(tr).find('[data-item="name"]').text(name);
        idLab = insertLab(name);    
        $(tr).find('input').each(function () {
            value = $(this).val();
            td = $(this).closest('td');
            item = $(td).attr('data-item');
            $(td).text(value);
            if (item !== 'name') {
               updateValue('labs', item, value, 'id_lab', idLab);
            }
        });
        $('table tr:last-of-type()').after(tr);
        $(tr).attr('data-id-lab', idLab);
        highLightNewEntry(tr);
    }
});
/******************************************************************************/
/***************************** delete lab **********************************/
/******************************************************************************/

$('table').on('click', '.remove', function () {
    var tr = $(this).closest('tr'),
            idLab = $(tr).attr('data-id-lab');
    $.confirm("Do you want to remove this lab?")
            .then(function () {
                deleteValue('labs', 'id_lab', idLab);
                $(tr).fadeOut('slow');
            });
});
/*******************************************************/




