<?php
DB::connect();
$teams=get_team_list();
if ($teams) {
    foreach ($teams as $id_team => $team) {
        $staff = get_employee_list($id_team);
        $teams[$id_team]['staff'] = !empty($staff) ? $staff : '';
    }
}
$teams['0']=[
    'team_name'=>'Other',
    'staff'=>get_employee_list('0')
];
//echo '<pre>';
//print_r($teams);
//echo '</pre>';
include_once 'html/navbar.html';
include_once 'html/staff.html';
include_once  'html/footer.html';
DB::disconnect();
?>

