<?php
/*
 * Get information from PVR 7K
 */
include_once 'function.php';

$ip = $_POST['ip'];

if (isset($_POST['get_sn'])) {
    $mip_array = array(
        "S/N" => "1.3.6.1.2.1.47.1.1.1.1.11.50331649"
    );
    echo get_oid($ip, $mip_array)['S/N'];
}

if (isset($_POST['get_info'])) {
    $mip_array = array(
        "Phisical software rev" => "1.3.6.1.2.1.47.1.1.1.1.10.50331649",
        "Model" => "1.3.6.1.2.1.1.1.0",
        "System uptime" => "1.3.6.1.2.1.1.3.0",
        "S/N" => "1.3.6.1.2.1.47.1.1.1.1.11.50331649"
    );
    echo json_encode(get_oid($ip, $mip_array));
}

if (isset($_POST['get_modules_info'])) {
    header('Location: /xml/pvr_8k.php?ip='.$ip.'&get_modules_info=1'); 
}
?>




