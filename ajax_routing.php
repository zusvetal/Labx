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
                    /*interface type is hypervisor*/
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

$app->get('/get_history', function ($request, $response, $args) {
    $id = $request->getQueryParams()['id'];
    $type=$request->getQueryParams()['type'];
    $create_at=  get_value($type.'_list', 'created_at', 'id_'.$type, $id);
    $events= ($type=='device')? get_device_history($id):get_module_history($id);
    include 'html/sections/event_history.html';
});

$app->get('/get_module_by_sn', function ($request, $response, $args) {
    $sn = $request->getQueryParams()['sn'];
    $modules=  get_module_list(['sn'=>$sn]);
    echo json_encode($modules);
    exit();
//    $response = $response->getBody()->write(json_encode($modules));
//    
//    return $response;
});

$app->get('/get_device_descr', function ($request, $response, $args) {
    $id = $request->getQueryParams()['id'];
    $type = $request->getQueryParams()['type'];
    if ($type === 'device') {
        $info = get_device($id);
    } elseif ($type=== 'module') {
        $info = get_module($id);
    }
    include 'html/sections/equipment_description.html';
});

$app->get('/get_full_values', function ($request, $response, $args) {
    $table = $request->getQueryParams()['table'];
    $where_col = $request->getQueryParams()['where_col'];
    $where_value = $request->getQueryParams()['where_value'];
    $values_from_db = get_values_full($table, $where_col, $where_value);
//    $send_values=(empty($values_from_db)) ? [] : $values_from_db;
    echo json_encode($values_from_db);
    exit();
//    return $response->getBody()->write(json_encode($values_from_db));
});
$app->get('/get_hypervisor_tr', function ($request, $response, $args) {
    $id_device=$request->getQueryParams()['id_device'];
    $interfaces=get_interfaces($id_device);
    
    $device = get_device($id_device);
    $device['interfaces']= $interfaces;
    $device['host'] = !empty($interfaces) ? array_shift($interfaces)['host'] : '';
    
    include 'html/sections/hypervisor_tr.html';
});
?>