<?php
/*
 * Get information from PVR 7K
 */
include_once 'function.php';

$ip = $_POST['ip'];

function get_modules_info($ip) {
    $desc = '2';
    $module = '5';
    $name = '7';
    $sn = '11';
    $pn = '13';
    $oid = '1.3.6.1.2.1.47.1.1.1.1.';
    $a = snmprealwalk($ip, 'public', $oid . $module);
    foreach ($a as $key => $value) {
        if ($value == 'INTEGER: 9') {
            $b = explode('.', $key);
            $index = '.' . end($b);
            $device_info = get_oid($ip, array(
                'descr' => $oid . $desc . $index,
                'name' => $oid . $name . $index,
                'sn' => $oid . $sn . $index,
                'pn' => $oid . $pn . $index
            ));
            if (preg_match('/quad port fe dvbs-s2 1 module/i', $device_info['name'])) {
                $device_info['name'] = 'Arava 4 Channels';
            } elseif (preg_match('/main 1 module/i', $device_info['name'])) {
                $device_info['name'] = 'Mainboard PVR 7K';
            }
            $modules[] = $device_info;
        }
    }
    return $modules;
}

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
    $mip_array = array(
        "rev" => "1.3.6.1.2.1.47.1.1.1.1.10.50331649",
        "model" => "1.3.6.1.2.1.1.1.0"
    );
    if (preg_match('/4\.[\d]/i', get_oid($ip, $mip_array)['rev'])) {
        header('Location: /xml/pvr_7k.php?ip='.$ip.'&get_modules_info=1'); 
    }
    echo json_encode(get_modules_info($ip));
}
?>


