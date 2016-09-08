var deviceDescription = function ($parentEl, type, id, callback) {
    var dfd = jQuery.Deferred(),
            param;
        if (type === 'device' || this.type === '') {
        param = {
            table: 'device_list',
            type: 'device',
            idField: 'id_device'
        };
    }
    else if (type === 'module') {
        param = {
            table: 'module_list',
            type: 'module',
            idField: 'id_module'
        };
    }
    $.get(
            '/get_device_descr',
            {
                id:id,
                type: type
            },
    function (html) {
        $parentEl.html(html);
        if ($parentEl.find('.section-content ').html().trim() === '') {
            $parentEl.empty();
        }
        if (typeof callback !== 'undefined') {
            callback($parentEl);
        }
        dfd.resolve($parentEl);
    });
    
     /*comment action*/
    $parentEl.on('click.descr', '.write', function () {
        var $content = $parentEl.find('.section-content'),
                $header = $parentEl.find('.section-header');
        $(this).addClass('hide');
        $parentEl.find('.section-header')
                .find('.save')
                .removeClass('hide');
        $content.summernote();
        $header.find('a').attr('data-toggle', false);
    });
    $parentEl.on('click.descr', '.save', function () {
        var $btn = $(this),
                $content = $parentEl.find('.section-content'),
                $header = $parentEl.find('.section-header'),
                text = $content.summernote('isEmpty') ?  '' : $content.summernote('code');
        updateValue(param.table, 'comment', text, param.idField, id, function (data) {
            $content.summernote('destroy');
            $header
                    .find('.save')
                    .addClass('hide');
            $header
                    .find('.write')
                    .removeClass('hide');
        });
        $header.find('a').attr('data-toggle', 'collapse');
    });
    
    
    return dfd.promise();
};