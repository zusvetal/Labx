<?php
include_once 'functions.php';
DB::connect();

function get_devices_in_labdesk($id_labdesk) {
    $list = labdesk_device_list($id_labdesk);
    if (!empty($list)) {
        foreach ($list as $id_labdesk => $labdesk) {
            $phys_int=get_interface_list($labdesk['id_device'],'1');
            $list[$id_labdesk]['main_int']= !empty($phys_int)?array_shift($phys_int):'';       
            $list[$id_labdesk]['phys_int'] = $phys_int;
            $list[$id_labdesk]['virt_int'] = get_interface_list($labdesk['id_device'], '2');
            $list[$id_labdesk]['interfaces'] = get_interfaces($labdesk['id_device']); 
        }
        return $list;
    }
}

$labdesks = get_labdesk_list();
if (!empty($labdesks)) {
    foreach ($labdesks as $id_labdesk => $labdesk) {
        $list[$id_labdesk] = [
            'name' => $labdesk['name'],
            'devices' => get_devices_in_labdesk($id_labdesk)
        ];
    }
}

//echo '<pre>';
//print_r($list);
//echo '</pre>';

include 'html/navbar.html';
include_once 'html/labdesks.html';
include 'html/footer.html';

DB::disconnect();
?>



