<?php
$ip=$_POST['ip'];
include_once 'function.php';
function get_modules_info($ip){
    $desc='2';
    $module='5';
    $name='7';
    $sn='11';
    $pn='13';
    $oid='1.3.6.1.2.1.47.1.1.1.1.';
    $a=snmprealwalk($ip, 'public', $oid.$module);
    foreach ($a as $key => $value) {
        if($value=='INTEGER: 9'){
            $b=explode('.', $key);
            $index='.'.end($b);
            $c=get_oid($ip,array(
               'descr'=>$oid.$desc.$index,
               'name' => $oid.$name.$index,
                'sn' => $oid.$sn.$index,
                'pn' => $oid.$pn.$index
            ));
            if (preg_match('/RfModule/i', $c['name'])) {
                $c['name'] = 'NSG-36R1G';
            }
            $modules[] = $c;
        }
    }
        return $modules;
}

if (isset($_POST['get_sn'])) {
    $mip_array = array(
        "S/N" => "1.3.6.1.2.1.47.1.1.1.1.11.1"
    );  
    echo get_oid($ip, $mip_array)['S/N'];
}

if (isset($_POST['get_info'])) {
    $mip_array = array(
        "Phisical software rev" => "1.3.6.1.2.1.47.1.1.1.1.10.1",
        "Model" => "1.3.6.1.2.1.1.1.0",
        "System uptime"=>"1.3.6.1.2.1.1.3.0",
        //"Host name" => "1.3.6.1.2.1.1.5.0",
        "S/N" => "1.3.6.1.2.1.47.1.1.1.1.11.1"
    );
    echo json_encode(get_oid($ip, $mip_array));
}

if (isset($_POST['get_modules_info'])) {
    echo json_encode(get_modules_info($ip));
    //echo print_r(get_modules_info($ip));
}
?>

