/******************************************************************************/
/******************************* Search system ********************************/
/******************************************************************************/
var getSearchDevices=function(keys){

    return $.post(
            "/ajax",
            {
                get_search_devices: '1',
                keys: keys
            },
    function (table) {
      $('.item-table').html(table);
      checkMenuOption();
      checkViewOption();
    });
};
var getSearchModules=function(keys){
   
  return $.post(
            "/ajax",
            {
                get_search_modules: '1',
                keys: keys
            },
    function (table) {
      $('.item-table').html(table);
      checkMenuOption();
      checkViewOption();
    });
};
var searchElements = function () {
    var keys = {},
            category = $('#category .choose2').attr('id');
    $('div.search-field').each(function () {
        var key = $(this).attr('id'),
                value = $(this).find('.value').val();
        keys[key] = value;
    });
    if (category === 'devices') {
        getSearchDevices(keys);
    }
    else if (category === 'modules') {
        getSearchModules(keys);
    }   
};
var checkMenuOption=function(){
    if($('a.transfer-status').hasClass('active')){
        showTransferStatus();
    }
    if($('a.work-status').hasClass('active')){
       showWorkStatus(); 
    }
};
var checkViewOption = function () {
    
    $('#viewField .list-group-item').each(function () {
        var $el = $(this),
                item = $el.data('toggle');
        if (!$el.hasClass('active')) {
            $('table .' + item).hide();
        }
    });
};

/******************************************************************************/
/************************* choose key  for searching ****************************/
/******************************************************************************/

/*** Location ***/
$('#content').on('click', 'a.key[data-key="id_location"]', function () {
    var $btn = $(this);
    if ($btn.hasClass('choose')) {
        $btn.removeClass('choose');
        $('#id_location').remove();
        searchElements();
    }
    else {
        $btn.addClass('choose');
        $('#searchField').prepend('\
                    <div id="id_location" class="search-field">\
                        <button type="button" class="close close-field"><span>&times;</span></button>\
                        <h6>Location</h6>\
                        <select class="form-control value">\
                            <option value="4">Storage</option>\
                            <option value="1">Racks</option>\
                            <option value="2">Labdesk</option>\
                            <option value="3">On hand</option>\
                        </select>\
                    </div>\
        ');
        searchElements();
    }
});

/*** Status ***/
$('#content').on('click', 'a.key[data-key="status"]', function () {
    var $btn = $(this);
    if ($btn.hasClass('choose')) {
        $btn.removeClass('choose');
        $('#status').remove();
        searchElements();
    }
    else {
        $btn.addClass('choose');
        $('#searchField').prepend('\
                    <div id="status" class="search-field">\
                        <button type="button" class="close close-field"><span>&times;</span></button>\
                        <h6>Status</h6>\
                        <select class="form-control value">\
                            <option value="1">Used</option>\
                            <option value="0">Free</option>\
                        </select>\
                    </div>\
        ');
        searchElements();
    }
});

/*** Vm ***/
$('#content').on('click', 'a.key[data-key="vm"]', function () {
    var $btn = $(this);
    if ($btn.hasClass('choose')) {
        $btn.removeClass('choose');
        $('#vm').remove();
        searchElements();
    }
    else {
        $btn.addClass('choose');
        $('#searchField').prepend('\
                    <div id="vm" class="search-field">\
                        <button type="button" class="close close-field"><span>&times;</span></button>\
                        <h6>Virtual mashines</h6>\
                        <input type="text"  class="hidden value" value="1"/>\
                    </div>\
        ');
        searchElements();
    }
});

/*** Transfer ***/
$('#content').on('click', 'a.key[data-key="id_transfer_status"]', function () {
    var $btn = $(this);
    if ($btn.hasClass('choose')) {
        $btn.removeClass('choose');
         $('#id_transfer_status').remove();
        searchElements();
    }
    else {
        $btn.addClass('choose');
        $('#searchField').prepend('\
                    <div id="id_transfer_status" class="search-field">\
                        <button type="button" class="close close-field"><span>&times;</span></button>\
                        <h6>Transfer status</h6>\
                        <select class="form-control value">\
                            <option value="0" selected >In proccess</option>\
                            <option value="1">Planned</option>\
                            <option value="2">Prepared</option>\
                            <option value="3">On way</option>\
                        </select>\
                    </div>\
        ');
        searchElements();
    }
});

/*** Operability ***/
$('#content').on('click', 'a.key[data-key="id_work_status"]', function () {
    var $btn = $(this);
    if ($btn.hasClass('choose')) {
        $btn.removeClass('choose');
         $('#id_work_status').remove();
        searchElements();   
    }
    else {
        $btn.addClass('choose');
        $('#searchField').prepend('\
                    <div id="id_work_status" class="search-field">\
                        <button type="button" class="close close-field"><span>&times;</span></button>\
                        <h6>Working status</h6>\
                        <select class="form-control value">\
                            <option value="1" selected >OK</option>\
                            <option value="2">Not working</option>\
                            <option value="3">RMA/on repair</option>\
                        </select>\
                    </div>\
        ');
        searchElements();
    }
});

/*** Other key button ***/
$('#content').on('click', 'a.key', function () {
    var $btn = $(this),
            key = $btn.data('key'),
            item = $btn.text();
    if (!$btn.hasClass('single')) {
        if ($btn.hasClass('choose')) {
            $btn.removeClass('choose');
            $('#' + key).remove();
        }
        else {
            $btn.addClass('choose');
            $('#searchField').append('\
            <div id="' + key + '" class="search-field">\
            <button type="button" class="close close-field"><span>&times;</span></button>\
             <h6>' + item + '</h6>\
                 <input type="text"  class="form-control value"/>\
             </div>\
        ');

        }
        searchElements();
    }
});

/***close (x) field ***/
$('#content').on('click', '.close-field', function () {
    var $field=$(this).closest('.search-field'),
    item=$field.attr('id');
    $field.fadeOut(function(){
       $(this).remove();
       $('a.key[data-key="'+item+'"]').removeClass('choose');
       searchElements();
    });   
});

/******************************************************************************/
/***************************** Search **************************************/
/******************************************************************************/

$('#content').on('keyup change', '#searchField .value', function () {
    searchElements();
});
/******************************************************************************/
/***************************** Menu **************************************/
/******************************************************************************/
$('#content').on('click', '#viewList', function (e) {
  if($('#viewField').is(':hidden')){
      $('#viewField').slideDown(200);
  }
  else{
    $('#viewField').slideUp(300);  
  }
});

$('#content').on('click', '#menuBlock', function (e) {
  if($('#menuField').is(':hidden')){
      $('#menuField').slideDown(200);
  }
  else{
    $('#menuField').slideUp(300);  
  }
});

$('#content').on('click', function (e) {
  var el=e.target;
  if($(el).closest('#wrapMenu').length===0){
      $('#menuField').fadeOut(300);
      $('#viewField').fadeOut(300);
  }
});
/******************************************************************************/
/***************************** Block menu component ***************************/
/******************************************************************************/

/***Transfer status***/
var showTransferStatus = function () {
    $('#menuField .transfer-status').addClass('active');
    $('table .transfer-status').show();
    $('[data-id-transfer-status="0"]')
            .find('.transfer-status .lable')
            .text('');
    $('[data-id-transfer-status="1"]').addClass('warning')
            .find('.transfer-status .lable')
            .text('planned');
    $('[data-id-transfer-status="2"]').addClass('success')
            .find('.transfer-status .lable')
            .text('prepared');
    $('[data-id-transfer-status="3"]').addClass('info')
            .find('.transfer-status .lable')
            .text('on way');
};
var hideTransferStatus = function () {
    $('#menuField .transfer-status').removeClass('active');
    $('table .transfer-status').hide();
    $('[data-id-transfer-status="1"]').removeClass('warning');
    $('[data-id-transfer-status="2"]').removeClass('success');
    $('[data-id-transfer-status="3"]').removeClass('info');
};
$('#menuField').on('click', '.transfer-status', function () {
    var $btn = $(this);
    if ($btn.hasClass('active')) {
        $('[data-key="id_transfer_status"]').remove();
        $('#id_transfer_status').remove();
        hideTransferStatus();
        searchElements();
    }
    else {
        $('#keyList').append('<a  class="btn a-btn key single" data-key="id_transfer_status">Transfer</a>');
        showTransferStatus();
    }

});

/***Working status***/
var showWorkStatus = function () {
    $('#menuField .work-status').addClass('active');
    $('table .working-status').show();
    $('[data-id-work-status="1"]').addClass('success')
            .find('.working-status .lable')
            .text('OK!');
    $('[data-id-work-status="2"]').addClass('danger')
            .find('.working-status .lable')
            .text('not working ');
    $('[data-id-work-status="3"]').addClass('warning')
            .find('.working-status .lable')
            .text('rma/on repair');
};
var hideWorkStatus = function () {
    $('#menuField .work-status').removeClass('active');
    $('table .working-status').hide();
    $('[data-id-work-status="1"]').removeClass('success');
    $('[data-id-work-status="2"]').removeClass('danger');
    $('[data-id-work-status="3"]').removeClass('warning');
};
var workingStatus = function ($btn) {
    if ($btn.hasClass('active')) {
        $btn.removeClass('active');
        $('[data-key="id_work_status"]').remove();
        $('#id_work_status').remove();
        hideWorkStatus();
        searchElements();
    }
    else {
        $btn.addClass('active');
        $('#keyList').append('<a  class="btn a-btn key single" data-key="id_work_status">Operability</a>');
        showWorkStatus();
    }
}
$('#menuField').on('click', '.work-status', function () {
    var $btn = $(this);
    workingStatus($btn);

});
/******************************************************************************/
/***************************** View menu component ***************************/
/******************************************************************************/
$('#viewField').on('click', function (e) {
    var $el = $(e.target),
            item = $el.data('toggle');
    if ($el.hasClass('active')) {
        $el.removeClass('active');
        $('table .' + item).fadeOut();
    }
    else {
        $el.addClass('active');
        $('table .' + item).fadeIn();
    }
});

