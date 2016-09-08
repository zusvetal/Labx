var highLightNewEntry = function (element) {
    $(element).addClass('new-entry');
    setTimeout(function () {
        $(element).addClass('hover');
    }, 1000);
};
var slideToEl = function ($container, $to) {
    $container.animate({
        scrollTop:$to.offset().top - $container.offset().top + $container.scrollTop()
    }, 1000);
};
var highlightingRowRemove=function($tr){
    $tr.removeClass('info');
}
var highlightRow=function($tr){
    $tr.addClass('info');
}
var recountNumber = function ($fields) {
    var num = 0;
    $fields.each(function () {
        ++num;
        $(this).text(num);
    });
};