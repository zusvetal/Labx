<?php

include_once 'functions.php';
$app->get('/get_search_devices', function ($request, $response, $args) {
    $list = array();
    $keys=!empty($request->getQueryParams()['keys'])? $request->getQueryParams()['keys']:'';
    if (isset($keys['ip'])) {
        $ip = $keys['ip'];
        unset($keys['ip']);
    }
    if (isset($keys['vm'])) {
        $vm = array();
        unset($keys['vm']);
    }
    $device_list = empty($keys) ? get_devices(get_search_device()) : get_devices(get_search_device($keys));
    /* seaching ip into array */
    if (isset($ip) && !empty($device_list) && !empty($ip)) {
        foreach ($device_list as $id_device => $device) {
            if (!empty($device['interfaces'])) {
                foreach ($device['interfaces'] as $id_int => $int) {
                    if (substr_count($int['ip'], $ip)) {
                        $list[$id_device] = $device_list[$id_device];
                    } else {
                        if (!empty($int['virt'])) {
                            foreach ($int['virt'] as $id_virt => $virt) {
                                if (substr_count($virt['virt_ip'], $ip)) {
                                    $list[$id_device] = $device_list[$id_device];
                                }
                            }
                        }
                    }
                }
            }
        }
        $device_list = $list;
    }
    /* seaching vm mashines into array */
    if (isset($vm) && !empty($device_list)) {
        foreach ($device_list as $id_device => $device) {
            if (!empty($device['interfaces'])) {
                foreach ($device['interfaces'] as $id_int => $int) {
                    if ($int['id_type'] === '3') {
                        $vm[$id_device] = $device_list[$id_device];
                    }
                }
            }
        }
        $device_list = $vm;
        include 'html/sections/vm_list.html';
        exit();
    }
    include 'html/sections/device_list.html';
    return $response;
});
$app->get('/get_search_modules', function ($request, $response, $args) {
   $keys=!empty($request->getQueryParams()['keys'])? $request->getQueryParams()['keys']:'';
        $module_list = empty($keys)? get_search_module():get_search_module($keys);   
    include 'html/sections/module_list.html';
});
?>