/******************************************************************************/
/*************************  Loading *******************************************/
/******************************************************************************/
jQuery.loading = function ($parentEl, options) {
    var settings = {  
        width: 50,
        height: 30
    }
    if (options) {
       $.extend(settings, options);
    }
    
    $parentEl.html('<img width="'+settings.width+'",height="'+settings.height+'", src="/img/loading_elepsis.gif">');
};
jQuery.startLoadingPage = function (options) {
   $('body').prepend('<div id="loadingPage"> </div>');
};
jQuery.stopLoadingPage = function (options) {
   $('body').find('#loadingPage').fadeOut('slow');
};