var getMainInfo = function ($parentEl, type, id) {
    var param,
            dfd = jQuery.Deferred();
    $parentEl.one('click.info', '#editParam', function () {
        var form = new Form(type);
        
        form.getForm($parentEl.find('#editInfo'),{id:id})
                .then(function () {
                    $parentEl.find('tr.comment').hide();                   
                    $parentEl.find('#mainDescription').slideUp();
                    infoMessage($parentEl.find('#editInfo'),'<center><b>Edit device parametr</b></center>');
//                    slideToEl($('#modalWindow'), $parentEl.find('#editInfo'));
                    return form.eventListener();
                })
                .then(
                        function (id) {
                            getMainInfo($parentEl, type, id);
                        },
                        function (id) {
                            getMainInfo($parentEl, type, id);
                        }
                )
    });
    $.post(
            '/ajax',
            {
                get_info: type,
                id: id
            },
    function (body) {
        dfd.resolve($parentEl.html(body));
    });
    return dfd.promise();
};