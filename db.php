<?php

if (!isset($_SESSION)) {
    session_start();
}

class DB {

    static $link;
    static $count = 0;

    public static function connect() {
        if (empty(self::$link)) {
            self::$link = mysqli_connect("10.46.202.200", "harmonic", "harmonic1", "labschema")
//            self::$link = mysqli_connect("10.46.202.200", "harmonic", "harmonic1", "hvs")
                    or die('No connect' . mysqli_error(self::$link));
            mysqli_set_charset(self::$link, 'utf8');
        }
    }
    public static function disconnect() {
        if (empty(self::$link)) {
            mysqli_close(self::$link);
        }
    }

}

function update_value($table, $col, $value, $where_col, $where_value) {
    $result = mysqli_query(db::$link, "UPDATE $table 
                SET
                    `$col`  = '" . mysqli_real_escape_string(db::$link, $value) . "'
		WHERE
                    `$where_col` = '$where_value'
		")
            or die("Invalid query: " . mysqli_error(db::$link));
    return $result;
}
function update_value_list($table, $values, $where_col, $where_value) {
    foreach ($values as $col => $value) {
        $set[]=" `$col` = '" . mysqli_real_escape_string(db::$link, $value) . "'";
    }
    $set=  implode($set, ',');
    $result = mysqli_query(db::$link, "UPDATE $table 
                SET
                    $set
		WHERE
                    `$where_col` = '$where_value'
		")
            or die("Invalid query: " . mysqli_error(db::$link));
    return $result;
}
function insert_value($table, $col, $value) {
    $result = mysqli_query(db::$link, "INSERT INTO $table ($col) VALUES('$value')")
            or die("Invalid query: " . mysqli_error(db::$link));
    if ($result == FALSE) {
        return $result;
    }
    $result2 = mysqli_query(db::$link, "SELECT last_insert_id()")
            or die("Invalid query: " . mysqli_error(db::$link));
    $row = mysqli_fetch_array($result2);
    return $row['last_insert_id()'];
}
function insert_value_list($table, $values) {
    
    foreach ($values as $col => $value) {
        $cols[]=$col;
        $vals[]="'$value'";
    }
    $cols= implode($cols, ',');
    $vals= implode($vals, ',');
    $result = mysqli_query(db::$link, "INSERT INTO $table ($cols) VALUES($vals)")
            or die("Invalid query: " . mysqli_error(db::$link));
    if ($result == FALSE) {
        return $result;
    }
    $result2 = mysqli_query(db::$link, "SELECT last_insert_id()")
            or die("Invalid query: " . mysqli_error(db::$link));
    $row = mysqli_fetch_array($result2);
    return $row['last_insert_id()'];
}
function delete_string($table, $where_col, $where_value) {
    $result = mysqli_query(db::$link, "DELETE FROM $table WHERE `$where_col`=$where_value")
            or die("Invalid query: " . mysqli_error(db::$link));
    return $result;
}
function get_value($table, $col, $where_col, $where_value) {
    $result = mysqli_query(db::$link, "SELECT $col FROM $table WHERE `$where_col`='$where_value'")
            or die("Invalid query: " . mysqli_error(db::$link));
    $row = mysqli_fetch_array($result);
    return !empty($row[$col]) ? $row[$col] : false;
}
function get_value_list($table, $col, $where_col, $where_value) {
    $result = mysqli_query(db::$link, "SELECT $col FROM $table WHERE `$where_col`='$where_value'")
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $value[] = $row[$col];
    }
    return !empty($value) ? $value : false;
}
function get_values($table,$where_col, $where_value) {
    $result = mysqli_query(db::$link, "SELECT * FROM $table WHERE `$where_col`='$where_value'")
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $value= $row;
    }
    return !empty($value) ? $value : false;
}
function get_value_full_list($table, $where_col, $where_value) {
    $result = mysqli_query(db::$link, "SELECT * FROM $table WHERE `$where_col`='$where_value'")
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $value[] = $row;
    }
    return !empty($value) ? $value : false;
}

function get_interface_list($id_device, $id_type = false) {
    $query = "SELECT
            id_interface,
            id_device,
            ip,
            host,
            id_type
	FROM 
           interfaces
        WHERE
            id_device=$id_device
	";
    if ($id_type!==false) {
        $query .= " AND id_type='$id_type'";
    }
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $interface_list[$row['id_interface']] = $row;
    }
    return !empty($interface_list) ? $interface_list : false;
}
function get_virtual_list($id_interface = false) {
    $query = "SELECT
            id_virtual_mashine,
            id_interface,
            virt_ip,
            virt_host,
            os
	FROM 
           virtual_mashines
	";
    if ($id_interface !== false) {
        $query .= " WHERE id_interface='$id_interface'";
    }
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $virtual_list[$row['id_virtual_mashine']] = $row;
    }
    return !empty($virtual_list) ? $virtual_list : false;
}
function get_vm($id_virtual_mashine) {
    $query = "SELECT
            id_virtual_mashine,
            id_interface,
            virt_ip,
            virt_host,
            os
	FROM 
            virtual_mashines
        WHERE 
            id_virtual_mashine='$id_virtual_mashine'
	";
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $vm = $row;
    }
    return $vm;
}
function get_employee_list($id_team = false) {
    $query = "SELECT
            id_employee,
            employee_name,
            id_team,
            id_global_location
	FROM 
           staff
        WHERE 
           id_global_location=".$_SESSION['id_global_location'];
    if ($id_team !==false) {
        $query .= " AND id_team='$id_team'";
    }
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $employee_list[$row['id_employee']] = $row;
    }
    return !empty($employee_list) ? $employee_list : false;
}
function get_employee($id_employee) {
    $query = "SELECT
            id_employee,
            employee_name,
            id_team
	FROM 
           staff
        WHERE 
            id_employee='$id_employee'
	";
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $employee = $row;
    }
    return $employee;
}
function get_team($id_team) {
    $query = "SELECT
            id_team,
            team_name,
	FROM 
           team
        WHERE 
            id_team='$id_team'
	";
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $team = $row;
    }
    return $team;
}
function get_team_list() {
    $query = "SELECT
            *
	FROM 
           team
        WHERE 
            id_global_location=".$_SESSION['id_global_location'];
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $teams_list[$row['id_team']] = $row;
    }
    return !empty($teams_list) ? $teams_list : false;
}
function get_device_list($model = false) {
    $query = "SELECT
            device_list.id_device,
            device_list.id_model,
            device_list.id_owner,
            device_list.id_location,
            location.name AS location,
            model,
            sn,
            asset_harmonic,
            asset_gl,
            device_list.id_team,
            id_global_location,
            size_in_unit,
            device_model.id_device_type,
            device_type.name AS type,
            id_formfactor
	FROM 
           device_list
        NATURAL JOIN
           device_model
        LEFT JOIN 
           device_type
        ON
            device_type.id_device_type=device_model.id_device_type
        LEFT JOIN
            location
        ON
            device_list.id_location=location.id_location
        LEFT JOIN
            devices_in_racks
        ON
            device_list.id_device=devices_in_racks.id_device
        WHERE 
            id_global_location=".$_SESSION['id_global_location']."
	";
    if ($model!==false) {
        $query .= "AND model='$model'";
    }
   $query.=" ORDER BY device_list.id_device DESC";
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $device_list[$row['id_device']] = $row;
    }
    return !empty($device_list) ? $device_list : false;
}
function get_free_device_list($model) {
    $query = "SELECT
            id_device,
            id_location,
            device_list.id_model,
            id_owner,
            employee_name,
            model,
            sn,
            asset_harmonic,
            asset_gl,
            device_list.id_global_location
	FROM 
            staff
	RIGHT JOIN
            device_list
        ON
            staff.id_employee=device_list.id_owner
        NATURAL JOIN
             device_model			
        WHERE
            model='$model'
        AND 
            id_location='4'
        AND 
            device_list.id_global_location=".$_SESSION['id_global_location']."
	";
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));

    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $device_list[$row['id_device']] = $row;
    }
    return !empty($device_list) ? $device_list : false;
}
function get_free_module_list() {
    $query = "SELECT
            id_module,
            id_device,
            employee_name,
            module_list.id_model,
            model,
            sn,
            asset_harmonic,
            asset_gl,
            id_owner,
            module_list.id_global_location,
            module_list.id_team
	FROM 
            staff
        RIGHT JOIN
           module_list
        ON
            staff.id_employee=module_list.id_owner
        NATURAL JOIN        
           module_model
        WHERE
            module_list.id_device='0'
        AND
            module_list.id_global_location=".$_SESSION['id_global_location']."
	";

    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $module_list[$row['id_module']] = $row;
    }
    return !empty($module_list) ? $module_list : false;
}
function get_module_list($id_device = false) {
    $query = "SELECT
            id_module,
            id_device,
            id_port_set,
            module_list.id_model,
            model,
            icon_name,
            sn,
            asset_harmonic,
            asset_gl,
            id_owner,
            id_global_location,
            module_list.id_team,
            module_model.id_device_type,
            device_type.name AS type,
            pn_name AS pn
	FROM 
           module_list
        NATURAL JOIN
           module_model
        LEFT JOIN
            device_type
        ON
            device_type.id_device_type=module_model.id_device_type
        LEFT JOIN
            module_pn
        ON
            module_pn.id_module_pn=module_list.id_module_pn
        WHERE
            id_global_location=".$_SESSION['id_global_location']."
	";
    if ($id_device!==false) {
        $query .= " AND id_device='$id_device'";
    }
    $query.=" ORDER BY id_module DESC ";
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $module_list[$row['id_module']] = $row;
    }
    return !empty($module_list) ? $module_list : false;
}
function get_module($id_module) {
    $query = "SELECT
            id_module,
            id_device,
            module_list.id_model,
            model,
            icon_name,
            sn,
            asset_harmonic,
            asset_gl,
            id_owner,
            comment,
            id_global_location,
            id_team,
            module_model.id_device_type,
            device_type.name AS type
	FROM 
           module_list
        NATURAL JOIN   
           module_model
        LEFT JOIN 
           device_type
        ON
            device_type.id_device_type=module_model.id_device_type
        WHERE
            module_list.id_module=$id_module
	";

    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $module = $row;
    }
    return !empty($module) ? $module : false;
}
function get_device($id_device) {
    $query = "SELECT
            id_device,
            id_location,
            device_list.id_model,
            model,
            sn,
            asset_harmonic,
            asset_gl,
            id_owner,
            icon_name,
            comment,
            id_team,
            id_global_location,
            size_in_unit,
            id_device_type,
            id_formfactor,
            device_type.name AS type,
            pn_name AS pn
	FROM 
           device_list
        NATURAL JOIN 
           device_model
        NATURAL JOIN 
           device_type
        LEFT JOIN
           device_pn
        ON
            device_pn.id_device_pn=device_list.id_device_pn
        WHERE
            device_list.id_device=$id_device
	";

    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $device = $row;
    }
    return !empty($device) ? $device : false;
}
function get_rack_list($front = false) {
    $query = "SELECT
           rack.id_rack,
           rack.id_lab,
           rack.name,
           number_of_unit,
           id_back_rack,
           lab_name,
           id_global_location
	FROM 
            rack,
            labs
        WHERE
            rack.id_lab=labs.id_lab
        AND
            id_global_location=".$_SESSION['id_global_location']."
	";
    if ($front!==false) {
        $query.="AND id_back_rack !=0 ";
    }
    $query.=" ORDER BY name";
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $rack_list[$row['id_rack']] = $row;
    }
    return !empty($rack_list) ? $rack_list : false;
}
function get_front_rack_list($id_lab = false) {
    $query = "SELECT
           rack.id_rack,
           rack.id_lab,
           rack.name,
           number_of_unit,
           id_back_rack,
           lab_name,
           id_global_location
	FROM 
            rack,
            labs
        WHERE
            rack.id_lab=labs.id_lab
        AND 
            id_back_rack !=0
        AND      
            id_global_location=".$_SESSION['id_global_location']."
	";
   if ($id_lab!==false) {
        $query.="AND labs.id_lab =$id_lab";
    }
    $query.=" ORDER BY name";
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $rack_list[$row['id_rack']] = $row;
    }
    return !empty($rack_list) ? $rack_list : false;
}
function get_port_set_list() {
    $query = "SELECT
            id_port_set,
            name
	FROM 
            port_set
	";
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $port_set_list[$row['id_port_set']] = $row['name'];
    }
    return $port_set_list;
}
function get_device_history($id_device) {
    $query = "SELECT
            *
	FROM 
            device_history
        WHERE
            id_device=$id_device
	";
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $history[$row['id']] = $row;
    }
    return !empty($history) ? $history : false;
}  
function get_module_history($id_module) {
    $query = "SELECT
            *
	FROM 
            module_history
        WHERE
            id_module=$id_module
	";
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $history[$row['id']] = $row;
    }
    return !empty($history) ? $history : false;
}  
function port_list() {
    $query = "SELECT
            id_port,
            name
	FROM 
            port_list
	";
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $port_list[$row['id_port']] = $row['name'];
    }
    return $port_list;
}
function rack_device_list($id_rack) {
    $result = mysqli_query(db::$link, "SELECT
            devices_in_racks.id_device_in_rack,
            devices_in_racks.id_model,
            devices_in_racks.id_rack,
            devices_in_racks.id_team,
            id_port_set,
            id_device,
            unit,
            mng_ip,
            ctrl_power,
            model,
            rack.name,
            number_of_unit,
            team.name,
            size_in_unit,
            id_reserved_by
	FROM 
           device_model,
           rack,
           devices_in_racks,
           team
        WHERE
            devices_in_racks.id_rack=$id_rack
        AND
            devices_in_racks.id_rack=rack.id_rack
        AND
            devices_in_racks.id_team=team.id_team
        AND
            devices_in_racks.id_model=device_model.id_model 
	")
            or die("Invalid query: " . mysqli_error(db::$link));
    return $result;
}
function get_rack_device($id_rack, $unit, $array = false) {
    $result = mysqli_query(db::$link, "SELECT
            devices_in_racks.id_device_in_rack,
            devices_in_racks.id_model,
            devices_in_racks.id_rack,
            devices_in_racks.id_team,
            id_port_set,
            id_device,
            unit,
            mng_ip,
            ctrl_power,
            model,
            rack.name AS rack_name,
            number_of_unit,
            devices_in_racks.size_in_unit,
            id_reserved_by,
            is_tower,
            is_mark
	FROM 
           device_model,
           rack,
           devices_in_racks
        WHERE
            devices_in_racks.id_rack=$id_rack
        AND
            devices_in_racks.unit=$unit
        AND
            devices_in_racks.id_rack=rack.id_rack
        AND
            devices_in_racks.id_model=device_model.id_model 
	")
            or die("Invalid query: " . mysqli_error(db::$link));
    if (!$array) 
        {
        $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
        return $row;
    } else {
        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            $devices[$row['id_device_in_rack']] = $row;
        }
        return $devices;
    }
}
function get_device_in_rack($id_device_in_rack) {
    $query = "SELECT
            devices_in_racks.id_device_in_rack,
            devices_in_racks.id_model,
            devices_in_racks.id_rack,
            devices_in_racks.id_team,
            id_port_set,
            id_device,
            unit,
            mng_ip,
            model,
            rack.name,
            size_in_unit,
            is_tower,
            is_mark
	FROM 
           device_model,
           rack,
           devices_in_racks

        WHERE
            devices_in_racks.id_device_in_rack=$id_device_in_rack
        AND
            devices_in_racks.id_rack=rack.id_rack
        AND
            devices_in_racks.id_model=device_model.id_model
	";

    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $device = $row;
    }
    return !empty($device) ? $device : false;
}
function check_shelf($id_rack, $unit) {
    $result = mysqli_query(db::$link, "SELECT id_shelf FROM shelves 
                WHERE id_rack=$id_rack
                AND  unit=$unit")
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $result = empty($row['id_shelf']) ? '0' : $row['id_shelf'];
        return $result;
    }
}
function get_patchpanel($id_rack, $unit) {
    $result = mysqli_query(db::$link, "SELECT 
                    id_patchpanel,
                    patchpanel_model.id_model,
                    name
                FROM 
                    patchpanel_list
                NATURAL JOIN
                    patchpanel_model                    
                WHERE 
                    id_rack=$id_rack
                AND  
                    unit=$unit")
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $panel = $row;
    }
    return !empty($panel) ? $panel : false;
}
function get_socket($id_patchpanel, $number) {
    $result = mysqli_query(db::$link, "SELECT 
                    id_patchpanel,
                    id_socket,
                    number,
                    descr
                FROM 
                    sockets                
                WHERE 
                    id_patchpanel=$id_patchpanel
                AND  
                    number=$number
            Order by 
                number")
            or die("Invalid query: " . mysqli_error(db::$link));
    $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
    return !empty($row) ? $row : '';
}
function get_model_list($table) {
    $result = mysqli_query(db::$link, "SELECT id_model,model  FROM $table")
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $models[$row['id_model']] = $row['model'];
    }
    return $models;
}
function get_device_model_list() {
    $result = mysqli_query(db::$link, "SELECT 
                    id_model,
                    model,
                    id_port_set,
                    icon_name,
                    id_device_type,
                    id_formfactor,
                    size_in_unit,
                    model_comment
                FROM 
                    device_model
                ORDER BY
                    id_model
                DESC")
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $models[$row['id_model']] = $row;
    }
    return $models;
}
function get_module_model_list() {
    $result = mysqli_query(db::$link, "SELECT 
                    id_model,
                    model,
                    id_port_set,
                    icon_name,
                    id_device_type,
                    model_comment
                FROM 
                    module_model
                ORDER BY
                    id_model
                DESC")
            or die("Invalid query: " . mysqli_error(db::$link));
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $models[$row['id_model']] = $row;
    }
    return $models;
}

/*
  function get_models_in_rack($id_rack) {
  $result = mysqli_query(db::$link, "SELECT id_model,model
  FROM
  devices_in_rack,device_model
  WHERE
  devices_in_rack.id_model=device_model.id_model
  ")
  or die("Invalid query: " . mysqli_error(db::$link));
  if ($result->num_rows != 0) {
  while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
  $models[$row['id_model']] = $row['model'];
  }
  return $models;
  }
  return false;
  }
 */
function get_device_port_list_in_rack($id_rack) {
    $result = mysqli_query(db::$link, "SELECT port_list.id_port,port_list.name
               FROM 
                port_list,port_set,port_list_port_set,device_model,devices_in_racks
               WHERE
                port_list.id_port=port_list_port_set.id_port
               AND
                port_set.id_port_set=port_list_port_set.id_port_set
               AND
                port_set.id_port_set=device_model.id_port_set
               AND		
                devices_in_racks.id_model=device_model.id_model
	       AND		
                id_rack=$id_rack
               GROUP BY 
                id_port")
            or die("Invalid query: " . mysqli_error(db::$link));
    if ($result->num_rows != 0) {
        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            $ports[$row['id_port']] = $row['name'];
        }
        return $ports;
    }
    return array();
}
function get_module_port_list_in_rack($id_rack) {
    $result = mysqli_query(db::$link, "SELECT port_list.id_port,port_list.name
               FROM 
                port_list,port_set,port_list_port_set,module_model,devices_in_racks,device_list,module_list
               WHERE
                port_list.id_port=port_list_port_set.id_port
               AND
                port_set.id_port_set=port_list_port_set.id_port_set
               AND
                port_set.id_port_set=module_model.id_port_set
               AND
                device_list.id_device=module_list.id_device
	       AND
                devices_in_racks.id_device=device_list.id_device
               AND
		module_list.id_model=module_model.id_model
               AND
                id_rack=$id_rack
               GROUP BY 
                id_port")
            or die("Invalid query: " . mysqli_error(db::$link));
    if ($result->num_rows != 0) {
        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            $ports[$row['id_port']] = $row['name'];
        }
        return $ports;
    }
    return array();
}
function get_device_links($id_device_in_rack) {
    if (!empty($id_device_in_rack)) {
        $result = mysqli_query(db::$link, "SELECT id_link,id_port,link from devices_in_racks,links 
                WHERE 
                    devices_in_racks.id_device_in_rack=links.id_device_in_rack
                AND
                    devices_in_racks.id_device_in_rack=$id_device_in_rack")
                or die("Invalid query: " . mysqli_error(db::$link));
        if ($result->num_rows != 0) {
            while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
                $ports[$row['id_port']] = array(
                    'id_link' => $row['id_link'],
                    'link' => $row['link']
                );
            }
            return $ports;
        }
    }

    return array();
}
function get_link($id_port, $id_device_in_rack) {
    $result = mysqli_query(db::$link, "SELECT id_link,id_module,link
               FROM 
                links
               WHERE
                id_device_in_rack=$id_device_in_rack
               AND
                id_port=$id_port
               ")
            or die("Invalid query: " . mysqli_error(db::$link));
    if ($result->num_rows != 0) {
        return mysqli_fetch_array($result, MYSQLI_ASSOC);
    }
    return false;
}
function search_model($value, $table) {
    $result = mysqli_query(db::$link, "SELECT id_model,model FROM $table WHERE model LIKE '%$value%' ")
            or die("Invalid query: " . mysqli_error(db::$link));
    if ($result->num_rows != 0) {
        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            $models[$row['id_model']] = $row['model'];
        }
        return $models;
    }
    return false;
}
function get_elements_list($table, $id_col, $name_col,$addition=false) {
    $elements='';
    $query="SELECT $id_col,$name_col FROM $table";  
    $id_global_field=mysqli_query(db::$link,"SELECT id_global_location FROM $table ");
    if($id_global_field){
        $query.=" WHERE id_global_location=".$_SESSION['id_global_location'];       
    }
    if($addition){
        $col=$addition['col'];
        $value=$addition['value'];
        $query.=($id_global_field)?" AND $col='$value' " : " WHERE $col='$value' ";
    }
    $result= mysqli_query(db::$link,$query) 
            or die("Invalid query: " . mysqli_error(db::$link));
   
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $elements[$row[$id_col]] = $row[$name_col];
    }  
    
    return $elements;
}

function search_list($table, $id_col, $search_col, $value,$addition=false) {
    $query = "SELECT
                $id_col, 
                $search_col
            FROM 
                $table
            WHERE
                $search_col
            LIKE
                '%$value%'";
    $id_global_field = mysqli_query(db::$link, "SELECT id_global_location FROM $table ");
    if ($id_global_field) {
        $query.=" AND id_global_location=" . $_SESSION['id_global_location'];
    }
    if ($addition) {
        $col = $addition['col'];
        $value = $addition['value'];
        $query.=" AND $col='$value'";
    }
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    if ($result->num_rows != 0) {
        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            $list[$row[$id_col]] = $row[$search_col];
        }
        
        return $list;
    }
    
    return false;
}

function get_port_list($id_port_set) {
    $result = mysqli_query(db::$link, "SELECT port_list.*
               FROM 
                port_list,port_set,port_list_port_set
               WHERE
                port_list.id_port=port_list_port_set.id_port
               AND
                port_set.id_port_set=port_list_port_set.id_port_set
               AND
                port_set.id_port_set=$id_port_set
               ")
            or die("Invalid query: " . mysqli_error(db::$link));
    if ($result->num_rows != 0) {
        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            $ports[$row['id_port']] = $row['name'];
        }
        return $ports;
    }
    return false;
}
function insert_port_list_port_set($id_port, $id_port_set) {
    $result = mysqli_query(db::$link, "INSERT INTO   
                    port_list_port_set
                    (id_port,id_port_set)   
                VALUES
                    ($id_port,$id_port_set)")
            or die("Invalid query: " . mysqli_error(db::$link));
    return $result;
}
function get_search_device($keys=false) {
    $query = "SELECT
            device_list.id_device,
            device_list.id_location,
            model,
            mng_ip,
            device_list.id_model,
            id_owner,
            employee_name,
            team_name,
            sn,
            asset_harmonic,
            asset_gl,
            id_rack,
            device_list.id_team,
            device_list.id_global_location,
            work_status_name,
            device_list.id_work_status,
            device_list.id_transfer_status,
            device_model.id_device_type,
            device_type.name AS type,
            pn_name AS pn
	FROM 
            device_list
	NATURAL JOIN
            device_model
        LEFT JOIN 
           device_type
        ON
            device_type.id_device_type=device_model.id_device_type
        LEFT JOIN
            device_pn
        ON
            device_pn.id_device_pn=device_list.id_device_pn
	LEFT JOIN
            team
        ON
            team.id_team=device_list.id_team
        LEFT JOIN
            staff
        ON
            staff.id_employee=device_list.id_owner
	LEFT JOIN
            devices_in_racks
        ON
            device_list.id_device=devices_in_racks.id_device
        NATURAL JOIN
            work_status
        WHERE
           device_list.id_global_location=".$_SESSION['id_global_location']."
            ";
    if (isset($keys['id_transfer_status'])&&$keys['id_transfer_status']==='0') {
        $query .= " AND id_transfer_status !=0 ";
        unset($keys['id_transfer_status']);
    }
    if ($keys) {
        foreach ($keys as $key => $value) {
            $query.="AND `$key` LIKE '%$value%'";
        }
    }
    $query.=" ORDER BY id_device DESC";
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    if ($result->num_rows != 0) {
        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            $device[$row['id_device']] = $row;
        }
        return $device;
    }
    
    return false;
}
function get_search_interface($key, $value) {
        $query = "
        SELECT
            device_list.id_device,
            id_interface,
            model,
            ip,
            host,
            device_list.id_model,
            id_owner,            
            sn,
            asset_harmonic,
            asset_gl,
            employee_name,
            id_location,
            device_list.id_team,
            device_list.id_global_location
	FROM 
            device_list
	NATURAL JOIN
            device_model
	NATURAL JOIN
            interfaces
	LEFT JOIN
            staff
	ON
            staff.id_employee=device_list.id_owner
        WHERE
            device_list.id_global_location=".$_SESSION['id_global_location']."
        ";
    $query.="AND `$key` LIKE '%$value%' ORDER BY `$key`";
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    if ($result->num_rows != 0) {
        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            $device[] = $row;
        }
        return $device;
    }
    return false;
}
function get_search_module($keys=false) {
    $query = "SELECT
            id_module,
            id_device,
            module_list.sn,
            model,
            module_list.id_model,
            module_list.id_owner,
            employee_name,
            module_list.asset_harmonic,
            module_list.asset_gl,
            module_list.id_global_location,
            module_list.id_team,
            team_name,
            work_status.work_status_name,
            module_list.id_work_status,
            id_transfer_status,
            module_model.id_device_type,
            device_type.name AS type,
            pn_name AS pn
	FROM 
            module_list
	NATURAL JOIN
            module_model  
        LEFT JOIN 
           device_type
        ON
            device_type.id_device_type=module_model.id_device_type
	LEFT JOIN
            staff
        ON
            staff.id_employee=module_list.id_owner
        LEFT JOIN
            team
        ON
            team.id_team=module_list.id_team
        LEFT JOIN
            module_pn
        ON
            module_pn.id_module_pn=module_list.id_module_pn
        NATURAL JOIN
            work_status        
        WHERE
            module_list.id_global_location=" . $_SESSION['id_global_location'] . "
            ";

    if (isset($keys['status'])) {
        $query .= $keys['status'] === '0' ? " AND id_device=0 " : " AND id_device!=0 ";
        unset($keys['status']);
    }
    if (isset($keys['id_transfer_status'])&&$keys['id_transfer_status']==='0') {
        $query .= " AND id_transfer_status !=0 ";
        unset($keys['id_transfer_status']);
    }
    if (isset($keys['id_work_status'])&&$keys['id_work_status']==='0') {
        $query .= " AND id_work_status !=0 ";
        unset($keys['id_work_status']);
    }
    if (isset($keys['id_device_type'])&&$keys['id_device_type']==='0') {
        $query .= " AND id_device_type !=0 ";
        unset($keys['id_device_type']);
    }
    if (isset($keys['id_device_type'])){
        $query .= " AND id_device_type= ".$keys['id_device_type']." ";
        unset($keys['id_device_type']);
    }
    if ($keys) {
        foreach ($keys as $key => $value) {
            $query.=" AND `$key` LIKE '%$value%'";
        }
    }
    $query.=" ORDER BY id_module DESC";
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    if ($result->num_rows != 0) {
        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            $device[$row['id_module']] = $row;
        }
        
        return $device;
    }
    
    return false;
}
function labdesk_device_list($id_labdesk) {
    $result = mysqli_query(db::$link, "SELECT
            *
	FROM 
           devices_in_labdesks
        NATURAL JOIN 
            labdesks
        NATURAL JOIN 
            device_model
        WHERE
            id_labdesk='$id_labdesk'
        ORDER BY 
            id_device_in_labdesk
        DESC
	")
            or die("Invalid query: " . mysqli_error(db::$link));
    if ($result->num_rows != 0) {
        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            $labdesk_list[$row['id_device_in_labdesk']] = $row;
        }
        return $labdesk_list;
    }
}
function get_labdesk_list() {
    $query = "SELECT
         *
	FROM 
            labdesks
        NATURAL JOIN
            labs
        WHERE
            id_global_location=".$_SESSION['id_global_location']."
        ORDER BY 
            name
	";
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    if ($result->num_rows != 0) {
        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            $labdesk_list[$row['id_labdesk']] = $row;
        }
        return $labdesk_list;
    }
}
function get_lab_list() {
    $query = "SELECT
            id_lab,
            lab_name,
            description,
            id_global_location
	FROM 
            labs
        WHERE
            id_global_location=".$_SESSION['id_global_location']."
        ORDER BY 
            lab_name
	";
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    if ($result->num_rows != 0) {
        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            $lab_list[$row['id_lab']] = $row;
        }
        return $lab_list;
    }
    return false;
}
function get_global_location_list() {
    $query = "SELECT
            id_global_location,
            name
	FROM 
            global_location
        ORDER BY 
            name
	";
    $result = mysqli_query(db::$link, $query)
            or die("Invalid query: " . mysqli_error(db::$link));
    if ($result->num_rows != 0) {
        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            $list[$row['id_global_location']] = $row['name'];
        }
        return $list;
    }
    return false;
}
function get_rack($id_rack) {
    $number_of_unit = get_value('rack', 'number_of_unit', 'id_rack', $id_rack);
    $size = 0;
    for ($i = $number_of_unit; $i > 0; $i--) {
        $status = '0';
        $slot = get_rack_device($id_rack, $i);
        if (!empty($slot)) {
            $size = $slot['size_in_unit'];
            $status = $slot['model'];
        } elseif ($size > 0) {
            $status = 'device';
        }
        if ($size > 0) {
            $size --;
        }
        if (get_patchpanel($id_rack, $i)) {
            $status = 'patchpanel';
        }
        if (check_shelf($id_rack, $i)) {
            $status = 'shelf';
        };
        $rack[$i] = $status;
    }
    return $rack;
}
function free_space_in_rack($id_rack) {
    $sum = 0;
    $number_of_unit = get_value('rack', 'number_of_unit', 'id_rack', $id_rack);
    $id_back_rack = get_value('rack', 'id_back_rack', 'id_rack', $id_rack);
    $rack = get_rack($id_rack);
    $back_rack = get_rack($id_back_rack);
    for ($i = $number_of_unit; $i > 0; $i--) {
        if ($rack[$i] === '0' && $back_rack[$i] === '0') {
            $sum++;
        }
    }
    return $sum;
}
/*
  function free_space_in_rack($id_rack) {

  $id_back_rack=  get_value('rack', 'id_back_rack', 'id_rack', $id_rack);
  $num_of_slots=  get_value('rack', 'number_of_unit', 'id_rack', $id_rack);

  $query1="SELECT sum(size_in_unit) FROM devices_in_racks WHERE id_rack='$id_rack'";
  $query2="SELECT sum(size_in_unit) FROM devices_in_racks WHERE id_rack='$id_back_rack'";
  $query3="SELECT * FROM patchpanel_list WHERE id_rack='$id_rack'";
  $query4="SELECT * FROM patchpanel_list WHERE id_rack='$id_back_rack'";
  $query5="SELECT * FROM shelves WHERE id_rack='$id_rack'";

  $devices = mysqli_query(db::$link,$query1)
  or die("Invalid query: " . mysqli_error(db::$link));
  $devices_b = mysqli_query(db::$link,$query2)
  or die("Invalid query: " . mysqli_error(db::$link));
  //$patchpanel = mysqli_query(db::$link,$query3)
  //        or die("Invalid query: " . mysqli_error(db::$link));
  //$patchpanel_b = mysqli_query(db::$link,$query4)
  //        or die("Invalid query: " . mysqli_error(db::$link));
  $shelves = mysqli_query(db::$link,$query5)
  or die("Invalid query: " . mysqli_error(db::$link));


  $d=mysqli_fetch_array($devices, MYSQLI_ASSOC)['sum(size_in_unit)'];
  $d_b=mysqli_fetch_array($devices_b, MYSQLI_ASSOC)['sum(size_in_unit)'];
  //$p=$patchpanel->num_rows;
  //$p_b=$patchpanel_b->num_rows;
  $s=$shelves->num_rows;


  echo $num_of_slots.'<br>';
  echo $d.'<br>';
  echo $d_b.'<br>';
  echo $s.'<br>';

  $free_space=$num_of_slots - ($d + $d_b + $s);
  return $free_space;
  }
 */
?>

