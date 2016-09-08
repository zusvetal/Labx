/******************************************************************************/
/************************* Ajax Setup *****************************************/
/******************************************************************************/
$.ajaxSetup({
    timeout: 10000,
    error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown, jqXHR.responseText);
        $.alert(textStatus + '-------' + errorThrown + '----' + jqXHR.responseText)
                .then(function () {
                    $('#modalWindow').css('overflow-y', 'auto');
                });
    }
});
/*Check  user loging*/
$(document).ajaxSuccess(function (e, xnr, set) {
    if (xnr.responseText.trim() === 'user not logged already') {
        document.location.replace('/login');
    }
});
/*************************************************************************************/
