<?php
/*
 * Get information from Prostream 9K 
 */
include_once 'function.php';

function get_card_name($pn) {
    $cards = [
        '095-0605-002' => 'Quad GbE (Juno)',
        '095-0605-003' => 'Quad GbE (Juno)',
        '099-0605-032F' => 'Quad GbE (Juno)',
        '095-0605-230F' => 'Quad GbE (Juno)',
        '095-0221-004F' => 'Dual GbE (Polaris)',
        '095-0221-004L' => 'Dual GbE (Polaris)',
        '095-0221-003F' => 'Dual GbE (Polaris)',
        '095-0217-002F' => 'ASI SCR',
        '095-0217-001F' => 'ASI SCR',
        '095-0284-001F' => 'Ace',
        '095-0252-103F' => 'Ace',
        '095-0249-001F' => '8VSB (METEOR)'
    ];
    if (empty($pn)) {
        return '';
    } else {
        if (isset($cards[$pn])) {
            return $cards[$pn];
        } else {
            return 'unknow';
        }
    }
}

function get_modules_xml_info($ip, $xml_request) {
    $xml_reply = do_post_request('http://root:HPcinHPs@' . $ip . '/BrowseConfig', $xml_request);
    $xml = simplexml_load_string($xml_reply) or die("Error: Cannot create object");
    $slots = $xml->xpath('//Slot');

    foreach ($slots as $slot) {
        $value = $slot->attributes();
        $pn = (string) $value['PartNumber'];
        if (!empty($pn)) {
            $module = [
                'name' => get_card_name($pn),
                'descr' => 'Slot ' . (string) $value['Slot'],
                'pn' => $pn,
                'sn' => (string) $value['SerialNumber']
            ];
            $modules[] = $module;
        }
    }
    return $modules;
}

function get_sn($ip, $xml_request) {
    $xml_reply = do_post_request('http://root:HPcinHPs@' . $ip . '/BrowseConfig', $xml_request);
    $xml = simplexml_load_string($xml_reply) or die("Error: Cannot create object");
    return (string)$xml->xpath('//Platform')[0]->attributes()['ChassisSerialNum'];;
}

function get_general_info($ip, $xml_request) {
    $xml_reply = do_post_request('http://root:HPcinHPs@' . $ip . '/BrowseConfig', $xml_request);
    $xml = simplexml_load_string($xml_reply) or die("Error: Cannot create object");
    $info['S/N']=(string)$xml->xpath('//Platform')[0]->attributes()['ChassisSerialNum'];
    return $info;
}




$ip=$_POST['ip'];
$xml_request = '<AFRICA><Platform ID="1" Action="GET_TREE"/></AFRICA>';
//$header = make_auth_header('root', 'HPcinHPs');

if (isset($_POST['get_sn'])) {
    echo get_sn($ip, $xml_request);
}

if (isset($_POST['get_info'])) {

    echo json_encode(get_general_info($ip,$xml_request ));
}

if (isset($_POST['get_modules_info'])) {
    echo json_encode(get_modules_xml_info($ip,$xml_request));
}

?>




