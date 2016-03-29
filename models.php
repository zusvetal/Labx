<?php

//include_once "db.php";
DB::connect();
$category = (isset($category)) ? $category : 'device';
$table = $category . '_model';
$models = $category == 'device' ? get_device_model_list() : get_module_model_list();
foreach ($models as $id_model => $model) {
    $port_list = empty($model['id_port_set']) ? '0' : get_port_list($model['id_port_set']);
    $models[$id_model]['port_list'] = $port_list;
}

//function get_models($table) {
//    $models = get_model_list($table);
//    foreach ($models as $id_model => $model) {
//        $id_port_set = get_value($table, 'id_port_set', 'id_model', $id_model);
//        $img_src = get_value($table, 'icon_name', 'id_model', $id_model);
//        $img_src=  empty($img_src)?'0':$img_src;
//        $port_list = empty($id_port_set) ? '0' : get_port_list($id_port_set);
//        $models[$id_model] = array(
//            'model' => $model,
//            'port_list' => $port_list,
//            'img_src'=>$img_src
//        );
//    }
//    return $models;
//}
//$models=get_models($table);
DB::disconnect();

include 'html/navbar.html';
include 'html/models.html';
include 'html/footer.html';
?>




