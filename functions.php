<?php

function array_concat($array1, $array2) {
    foreach ($array1 as $key => $value) {
        if (!key_exists($key, $array2)) {
            $array2[$key] = $value;
        }
    }
    return $array2;
}

function get_port_links($id_device_in_rack, $id_port_set) {
    $links = [];
    if (!empty($id_device_in_rack)) {

        $id_device = get_value('devices_in_racks', 'id_device', 'id_device_in_rack', $id_device_in_rack);
        if (!empty($id_port_set) && !empty($id_device)) {
            $device_port_list = get_port_list($id_port_set);
            foreach ($device_port_list as $id_port => $port) {
                $links[$id_port] = get_link($id_port, $id_device_in_rack);
            }
        }
        #add links from modules in chassis(device)           
        if ($id_device) {
            $modules = get_module_list($id_device);
            if ($modules) {
                foreach ($modules as $id_module => $module) {
                    $module_port_list = get_port_list($module['id_port_set']);
                    if ($module_port_list) {
                        foreach ($module_port_list as $id_port => $port) {
                            $links[$id_port] = get_link($id_port, $id_device_in_rack);
                            $links[$id_port]['id_module'] = $id_module;
                        }
                    }
                }
            }
        }
    }
    return $links;
}

function get_interfaces($id_device) {
    $list = get_interface_list($id_device);
    if (!empty($list)) {
        foreach ($list as $id_interface => $int) {
            $list[$id_interface]['virt'] = get_virtual_list($id_interface);
        }
    }
    return $list;
}

function rack($id_rack, $point_device = FALSE) {
    $number_of_units = get_value('rack', 'number_of_unit', 'id_rack', $id_rack);
    $full = '0';
    $size = '0';
    $tower = '0';
    $reserved_by = '';
    for ($unit = $number_of_units; $unit >= 1; $unit--) {
        $device_info = get_rack_device($id_rack, $unit);
        if ($size == '0') {
            $action = '1';
            if (!empty($device_info['size_in_unit'])) {
                $size = $device_info['size_in_unit'];
                --$size;
                $full = '1';
            } else {
                $full = '0';
            }
        } else {
            --$size;
            $full = '1';
            $action = '0';
        }

        /* boocking info */
        if (empty($device_info['id_reserved_by'])) {
            if ($full == '1' && $action == '1') {
                $reserved_by = '0';
            } else {
                $reserved_by = '';
            }
        } else {
            $reserved_by = get_value('staff', 'employee_name', 'id_employee', $device_info['id_reserved_by']);
        }

        if ($tower != '0') {
            --$tower;
        }
        /* tower device */
        if (!empty($device_info['is_tower'])) {
            $tower = $device_info['size_in_unit'];
        }
        //      $point=($point_device==$device_info['id_device_in_rack'])?'1':'0';

        $rack[$unit] = array(
            'id_device_in_rack' => $device_info['id_device_in_rack'],
            'mng_ip' => $device_info['mng_ip'],
            'interfaces' => !empty($device_info['id_device']) ? get_interfaces($device_info['id_device']) : '',
            'ctrl_power' => $device_info['ctrl_power'],
            'model' => $device_info['model'],
            'rack_name' => $device_info['rack_name'],
            'id_device' => $device_info['id_device'],
            'mark' => $device_info['is_mark'],
            'full' => $full,
            'action' => $action,
            'size' => $device_info['size_in_unit'],
            'ports' => get_port_links($device_info['id_device_in_rack'], $device_info['id_port_set']),
            'reserved_by' => $reserved_by,
            'point' => $point_device == $device_info['id_device_in_rack'] ? '1' : '0',
            'id_shelf' => check_shelf($id_rack, $unit),
            'patchpanel' => get_patchpanel($id_rack, $unit),
            'tower' => $tower,
            'top' => $device_info['is_tower'],
        );
        if (!empty($device_info['is_tower'])) {
            $rack[$unit]['tower_devices'] = get_rack_device($id_rack, $unit, 'array');
        }
    }
    return $rack;
}

function get_devices($device_list) {
    if (!empty($device_list)) {
        foreach ($device_list as $id_device => $device) {
            $interfaces = get_interface_list($id_device);
            $int2 = $interfaces;
            $device_list[$id_device]['modules'] = get_module_list($id_device);
            $device_list[$id_device]['employee_name'] = get_value('staff', 'employee_name', 'id_employee', $device['id_owner']);
            $device_list[$id_device]['team_name'] = get_value('team', 'team_name', 'id_team', $device['id_team']);
            $device_list[$id_device]['interfaces'] = get_interfaces($id_device);
            $device_list[$id_device]['ip'] = !empty($interfaces) ? array_shift($interfaces)['ip'] : '';
            $device_list[$id_device]['host'] = !empty($int2) ? array_shift($int2)['host'] : '';
            switch ($device['id_location']) {
                case '1':
                    $device_list[$id_device]['id_device_in_rack'] = get_value('devices_in_racks', 'id_device_in_rack', 'id_device', $id_device);
                    break;
                case '2':
                    $device_list[$id_device]['id_device_in_labdesk'] = get_value('devices_in_labdesks', 'id_device_in_labdesk', 'id_device', $id_device);
                    break;
                case '3':
                    $device_list[$id_device]['id_device_on_hand'] = get_value('devices_on_hands', 'id_device_on_hand', 'id_device', $id_device);
                    break;
            }
        }
    }
//    echo '<pre>';
//    print_r($device_list);
//    echo '</pre>';
    return $device_list;
}

function get_modules() {
    $module_list = get_module_list();
    if (!empty($module_list)) {
        foreach ($module_list as $id_module => $module) {
            $module_list[$id_module]['employee_name'] = get_value('staff', 'employee_name', 'id_employee', $module['id_owner']);
            $module_list[$id_module]['team_name'] = get_value('team', 'team_name', 'id_team', $module['id_team']);
            if ($module['id_device'] !== '0') {
                $module_list[$id_module]['device'] = get_device($module['id_device']);
            }
        }
    }
    return $module_list;
}

?>