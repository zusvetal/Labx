<?php

$ip=$_POST['ip'];

function ping($ip) { 
exec("ping -c 1 -w 5  $ip",$output,$status); 
return $status;  
}

/*not used for Linux*/
function ping_php($host, $timeout = 1) {
    /* ICMP ping packet with a pre-calculated checksum */
    $package = "\x08\x00\x7d\x4b\x00\x00\x00\x00PingHost";
    $socket  = socket_create(AF_INET, SOCK_RAW, 1);
    socket_set_option($socket, SOL_SOCKET, SO_RCVTIMEO, array('sec' => $timeout, 'usec' => 0));
    socket_connect($socket, $host, null);
    $ts = microtime(true);
    socket_send($socket, $package, strLen($package), 0);
    if (socket_read($socket, 255)) {
        //$result = microtime(true) - $ts;
        $result=true;
    } else {
        $result = false;
    }
    socket_close($socket);
    return $result;
}

echo ping($ip) == '0' ? json_encode(true) : json_encode(false);
?>
