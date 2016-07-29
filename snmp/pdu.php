<?php
include_once 'function.php';
$ip=$_POST['ip'];

if (isset($_POST['get_sn'])) {
    $mip_array = array(
        "S/N" => "1.3.6.1.4.1.1718.3.2.1.1.6.1"
    );  
    echo get_oid($ip, $mip_array)['S/N'];
}

if (isset($_POST['get_info'])) {
    $mip_array = array(        
        "Model" => "1.3.6.1.2.1.1.1.0",
        "System uptime"=>"1.3.6.1.2.1.1.3.0",
        //"Host name" => "1.3.6.1.2.1.1.5.0",
        "S/N" => "1.3.6.1.4.1.1718.3.2.1.1.6.1"
    );
    echo json_encode(get_oid($ip, $mip_array));
}
if (isset($_POST['get_modules_info'])) {
    echo json_encode(false);
}
?>


