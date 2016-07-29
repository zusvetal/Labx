<?php
include_once 'function.php';
$ip=$_POST['ip'];

if (isset($_POST['get_sn'])) {
    $mip_array = array(
        "S/N" => "1.3.6.1.4.1.2636.3.1.3.0"
    );  
    echo get_oid($ip, $mip_array)['S/N'];
}

if (isset($_POST['get_info'])) {
    $mip_array = array(
        "Phisical software rev" => "1.3.6.1.4.1.2636.3.40.1.4.1.1.1.5.0",
        "System uptime"=>"1.3.6.1.2.1.1.3.0",
        "Model" => "1.3.6.1.2.1.1.1.0",
        "Host name" => "1.3.6.1.2.1.1.5.0",
        "S/N" => "1.3.6.1.4.1.2636.3.1.3.0"
    );
    echo json_encode(get_oid($ip, $mip_array));
}

?>

