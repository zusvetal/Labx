$("#auth").submit(function () {
    var form = $(this);
    var error = false;
    form.find('input, textarea').each(function () {
        if ($(this).val() == '') {
            alert('Fill the field "' + $(this).attr('placeholder') + '"!');
            error = true;
        }
    });
    if (!error) {
        var data = form.serialize();
        $.ajax({
            type: 'POST',
            url: '/login',
            dataType: 'text',
            data: data,
            beforeSend: function (data) {
                form.find('input[type="submit"]').attr('disabled', 'disabled');
            },
            success: function (permission) {
                if (permission) {
//                    var location = typeof permission == 'string'  ? permission : '/';
                    var location = '/';
                    document.location.replace(location);
                }
                else {
                    $('#loginInfo').text('The username or password you entered is incorrect.')
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
            },
            complete: function (data) {
                form.find('input[type="submit"]').prop('disabled', false);
            }
        });
    }
    return false;
});