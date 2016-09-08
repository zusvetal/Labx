var Modal = function () {
    this.object = $('#modalWindow');
    this.getModal = function ($parentEl, callback) {
        return $.post(
                "/ajax",
                {
                    get_modal_window: '1'
                },
        function (data) {
            $parentEl.html(data);
            if (typeof callback !== 'undefined') {
                callback($parentEl);
            }
        });
    };
    this.show = function () {
        $('#modalWindow').modal({show: true});

    };
    this.hide = function () {
        $('#modalWindow').modal('hide');

    };
    this.setTitle = function (text) {
        $('#modalTitle').html(text);
    };
    this.addActionButton = function (name, id) {
        $('#modalFooter').append('<button id="' + id + '" type="button" class="btn btn-primary">' + name + '</button>');
    };
    this.addBody = function (body) {
        return  $('#modalBody').html(body);
    };
    this.getBodyField = function () {
        return $('#modalBody');
    };
    this.setWidth = function (width) {
        $('#modalDialog').css('width', width);
    };
};