var category = $('input.search-model').data('category');
var table = (category === 'module') ? 'module_model' : 'device_model';

/******************************************************************************/
/****************************  live model search  *****************************/
/******************************************************************************/

var checkModelNameInDb = function (modelName) {
    var result = getValue(table,'id_model','model',modelName);
    return result === '0' ? false : result;
};

$('#content').on('keyup', 'input.search-model', function (event) {
    var key = event.keyCode,
            modelName = $(this).val().trim(),
            listOfModel,
            list;

    $(this).attr('data-id-model', '0');
    if (key === 40) {
        $('button.search-model').click();
        
    }
 /*   if (key === 13) {
        if (checkModelNameInDb(modelName)) {
        }
    }*/
    if (modelName !== '' && key !== 13) {
        $.post(
                "/ajax",
                {
                    model_search: '1',
                    value: modelName,
                    table: table
                },
        function (data) {

            if (data.trim() !== '0') {
                listOfModel = JSON.parse(data);
                list = '';
                for (var id_model in listOfModel) {
                    list += '<li><a href="#" data-id-model="' + id_model + '">' + listOfModel[id_model] + '</a></li>';
                }
                $('ul.search-model-list').html(list).slideDown();
            } else {
                $('ul.search-model-list').slideUp();
            }
        });
    } else {
        $('ul.search-model-list').slideUp();
    }
});
$('#content').on('keyup', 'ul.search-model-list', function (event) {
    var key = event.keyCode;
    if (key === 37) {
        $('button.search-model').click();
        $('input.search-model').focus();
    }
});
$('#content').on('click', 'ul.search-model-list a', function (event) {    
    var item = $(this),
            input = $(item).closest('div.input-group').find('input.search-model'),
            value = $(item).html(),
            idModel = $(item).attr('data-id-model');
    $(input).val(value);
    $(input).focus();
    $(input).attr('data-id-model', idModel);
    $(item).closest('ul.search-model-list').slideUp();
});



