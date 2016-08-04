/******************************************************************************/
/***************************** add staff **********************************/
/******************************************************************************/
$('#content').on('click.staff', '.add-team', function (event) {
    event.preventDefault();
    var modal = new Modal();
    var form = new TeamForm();
    modal.getModal($('#addNewStaff'))
            .then(function () {
                return form.getForm(modal.getBodyField());
            })
            .then(function () {
                modal.setTitle('Add new team');
                modal.setWidth('30%');
                modal.show();
                return form.eventListener();
            })
            .then(function (idTeam) {
                modal.hide();
                location.reload();
//                insertNewDeviceInTable(idTeam);
            });
});
$('#content').on('click.staff', '.add-employee', function (event) {
    event.preventDefault();
    var modal = new Modal(),
            form = new EmployeeForm();
    modal.getModal($('#editStaff'))
            .then(function () {
                return form.getForm(modal.getBodyField());
            })
            .then(function () {
                modal.setTitle('Edit Employee');
                modal.setWidth('30%');
                modal.show();
                return form.eventListener();
            })
            .then(function (idEmployee) {
                modal.hide();
                location.reload();
//                insertNewDeviceInTable(idTeam);
            });
});
/******************************************************************************/
/***************************** edit staff **********************************/
/******************************************************************************/
$('#content').on('click.staff', '.edit-team', function (event) {
    var $td = $(this).closest('tr').find('td.team-name'),
            nameTeam = $td.text().trim(),
            idTeam = $td.closest('tr').data('idTeam');
    event.preventDefault();
    if ($td.find('input').length == 0) {
        $td
                .html('<input class="update-team form-control" type="text">')
                .find('input')
                .val(nameTeam);
    }
    else {
        nameTeam = $td.find('input')
                .val()
                .trim();
        updateValue('team', 'team_name', nameTeam, 'id_team', idTeam)
                .then(function () {
                    $td.text(nameTeam);
                });
    }
});

$('#content').on('click.staff', '.edit-employee', function (event) {
    event.preventDefault();
    var modal = new Modal(),
            form = new EmployeeForm(),
            idEmployee = $(this).closest('tr').data('idEmployee');
    modal.getModal($('#addNewStaff'))
            .then(function () {
                return form.getForm(modal.getBodyField(), {id_employee: idEmployee});
            })
            .then(function () {
                modal.setTitle('Add new employee');
                modal.setWidth('30%');
                modal.show();
                return form.eventListener();
            })
            .then(function (idTeam) {
                modal.hide();
                location.reload();
//                insertNewDeviceInTable(idTeam);
            });
});

/******************************************************************************/
/***************************** delete team **********************************/
/******************************************************************************/

$('#content').on('click.staff', '.remove-team', function () {
    var $tr = $(this).closest('tr'),
            idTeam = $tr.attr('data-id-team'),
                        check = new CheckingAssets(),
            notification = new DeleteNotification($('#modalField'));
    check.devicesOnTeam(idTeam)
            .then(function (devices) {
                if (devices.length === 0) {
                    return $.confirm("Do you want to remove this team?")
                }
                else {
                    notification.devicesOnTeam(devices);
                    return $.Deferred();
                }
            })
            .then(function () {          
                return deleteValue('team', 'id_team', idTeam);
            })
            .then(function () {
                location.reload();
            })
});
/******************************************************************************/
/***************************** delete employee **********************************/
/******************************************************************************/

$('#content').on('click.staff', '.remove-employee', function () {
    var $tr = $(this).closest('tr'),
            idEmployee = $tr.data('idEmployee'),
            check = new CheckingAssets(),
            notification = new DeleteNotification($('#modalField'));
    check.devicesOnEmployee(idEmployee)
            .then(function (devices) {
                if (devices.length === 0) {
                    return $.confirm("Do you want to remove this employee?")
                }
                else {
                    notification.devicesOnEmployee(devices);
                    return $.Deferred();
                }
            })
            .then(function () {
                deleteValue('staff', 'id_employee', idEmployee);
                return $tr.fadeOut('slow')
            })
            .then(function () {
                $tr.remove();
                recountNumber($('td.number'));
            });


});


