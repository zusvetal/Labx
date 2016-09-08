
/******************************************************************************/
/************************* Up scrolling ********************/
/******************************************************************************/

$(document).ready(function () {
// hide #back-top first
    $("#back-top").hide();

// fade in #back-top
    $(function () {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $('#back-top').fadeIn();
            } else {
                $('#back-top').fadeOut();
            }
        });
// scroll body to 0px on click
        $('#back-top a').click(function () {
            $('body,html').animate({
                scrollTop: 0
            }, 800);
            return false;
        });
    });
});

/******************************************************************************/
/*************************  Activate tooltips *********************************/
/******************************************************************************/

$(function () {
    $(document).tooltip({
        selector: '[data-toggle="tooltip"]',
        placement: 'bottom'

    });
});
/******************************************************************************/
/*************************  Collapse sections *********************************/
/******************************************************************************/
$(document).on('hide.bs.collapse', '.section-content', function () {
    var $content = $(this),
            $header = $content.prev('.section-header');
    $content.css("display", "");
    $header.find('.arrow')
            .removeClass('glyphicon-chevron-down')
            .addClass('glyphicon-chevron-up');
    $header.find('.write').hide();

});
$(document).on('show.bs.collapse', '.section-content', function () {
    var $content = $(this),
            $header = $content.prev('.section-header');
    $header.find('.arrow')
            .removeClass('glyphicon-chevron-up')
            .addClass('glyphicon-chevron-down');
    $header.find('.write').show();

});