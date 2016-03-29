<?php
function get_oid($ip, $mip_array) {
    foreach ($mip_array as $name => $oid) {
        $snmp_result = @snmpget($ip, "public", $oid);
        $value=!stristr($snmp_result,':') ? '' : str_replace("\"","", explode(":", $snmp_result)[1]);
        $result[$name] = $value;
    }
    return $result;
}
?>

