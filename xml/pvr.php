<?php
/*
 * Get information from PVR 7K (rev more at least 4.x) or 8K
 */
include_once 'function.php';
$ip = $_GET['ip'];


$request_inventory = '<?xml version="1.0" encoding="UTF-8"?>
<hconf source="Viewer" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="./hconf.xsd">
    <execute-cmd>
        <commands>
            <GetHwInventory/>
        </commands>
    </execute-cmd>
</hconf>';
    
function get_modules_xml_info($ip, $request_xml) {
    $xml_inventory = do_post_request('http://Root:hlitin1@' . $ip . '/BrowseConfig.pvr', $request_xml);
    $xml = simplexml_load_string($xml_inventory) or die("Error: Cannot create object");
    $module_list = $xml->xpath('//Entry');
    
    $not_show = [
        'Platform',
        'Power Supply Slot',
        'Front panel Slot',
        'Fans Slot',
        'Rotem Slot'
    ];

    foreach ($module_list as $value) {
        $descr=(string)$value['Name'];
        if (!in_array($descr, $not_show)) {
            $module = ['name' => (string) $value['Type'],
                'descr' => $descr,
                'pn' => (string) $value['PN'],
                'sn' => (string) $value['SN']];

            if (preg_match('/Arave FE 1 Port/i', $module['name'])) {
                $module['name'] = 'Arava 1 Channels';
            } elseif (preg_match('/Arave FE 4 Port/i', $module['name'])) {
                $module['name'] = 'Arava 4 Channels';
            } elseif (preg_match('/Mainboard/i', $module['name'])) {
                $module['name'] = 'Mainboard';
            }
            $modules[] = $module;
        }
    }
    return $modules;
}

if (isset($_GET['get_modules_info'])) {
    echo json_encode(get_modules_xml_info($ip,$request_inventory));
}
?>




