
var getFreeSpaceInRack = function (idRack, callback) {
    return $.post(
            "/ajax",
            {
                get_free_space_in_rack: '1',
                id_rack: idRack
            },
    function (units) {
        if (typeof callback !== 'undefined') {
            callback(units);
        }
    });
}
var circleCharts = function ($parentEl, number) {
    var circle = '<svg>\
                    <circle r="21" cx="42" cy="42" />\
                </svg>\
                <span>' + number + ' units</span>';
    $parentEl.html(circle);
    $parentEl.find('svg').css({
        "width": "84px",
        "height": "84px",
        "transform": "rotate( -90deg)",
        "background": "rgba(255, 148, 146, 1)",
        "border-radius": "50%"
    });
    $parentEl.find('circle').css({
        "fill": "rgba(255, 148, 146, 1)",
        "stroke": "rgba(109, 211, 255, 1)",
        "stroke-width": "42",
        "stroke-dasharray": number * 3 + " 132" /* 2π × 25 ≈ 158 */
    });
};
var writeRackInfo = function ($parentEl, idRack) {
    $parentEl.html('<div  align="center">\
                <h4>Free space in rack</h4>\
                <div class="diagram"></div>\
            </div>');
    return getFreeSpaceInRack(idRack, function (units) {
        circleCharts($parentEl.find('.diagram'), units);
    })

};
var decorateFrontRack = function ($rack, rackName) {
    $rack.css({
        "zoom": "15%",
        "-ms-zoom": "15%",
        "margin": "20px"
    })
            .wrap('<div class="rack-wrapper"></div>')
            .before('<center><h4 class="rack-name">' + rackName + '</h4></center>')
            .before('<span class="glyphicon glyphicon-info-sign small rack-info"></span>')
            .before('<div class="info-block"></div>');
}
var decorateBackRack = function ($rack,rackName) {
    $rack.css({
        "zoom": "15%",
        "-ms-zoom": "15%",
        "margin": "20px"
    })
            .wrap('<div class="rack-wrapper"></div>')
            .before('<h4 class="back hidden" align="center">' + rackName + ' back</h4>')
}
$('#content').on('click', '.rack-info', function () {
    $(this).closest('.rack-wrapper')
            .find('.info-block')
            .slideToggle('slow');
});

$('#content').on('click', '.show-all-racks-info', function () {
    $(this).removeClass('show-all-racks-info')
            .addClass('hide-all-racks-info');
    $('.info-block')
            .fadeIn();
});

$('#content').on('click', '.hide-all-racks-info', function () {
    $(this).removeClass('hide-all-racks-info')
            .addClass('show-all-racks-info');
    $('.info-block')
            .fadeOut();
});

$('#content').on('click', '.show', function () {
    $(this).toggleClass('glyphicon-resize-full');
    $(this).toggleClass('glyphicon-resize-small');
    $('.back').toggleClass('hidden');
});

/* fill blocks by racks  */
var promise = $.when();
$.startLoadingPage();
/*assembling promise chain by cycle*/
$('.rack.front').each(function () {
    var $fieldForRack = $(this),
            $fieldForBackRack = $fieldForRack.next(),
            idRack = $fieldForRack.data('idRack'),
            idBackRack = $fieldForRack.data('idBackRack'),
            rackName = $fieldForRack.find('h3').text(),
            $freeSpace;
    promise = promise
            .then(function () {
                return getRack($fieldForRack, idRack)
            })
            .then(function ($rack) {          
                decorateFrontRack($rack, rackName);
                var $infoBlock = $rack.closest('.rack-wrapper').find('.info-block');
                
                return writeRackInfo($infoBlock, idRack);
            })
            .then(function () {
                
                return getRack($fieldForBackRack, idBackRack);
            })
            .then(function ($rack) {
                decorateBackRack($rack,rackName);
            });
});

promise
        .then(function () {
            $.stopLoadingPage();
        })


