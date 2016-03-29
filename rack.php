<?php

include_once 'db.php';
include_once 'functions.php';
DB::connect();

$id_rack = (isset($_POST['get_rack'])) ? $_POST['id_rack'] : $id_rack;
$point_device = (isset($_POST['id_device_in_rack'])) ? $_POST['id_device_in_rack'] : '0';


$rack_port_list=array_concat(get_device_port_list_in_rack($id_rack),get_module_port_list_in_rack($id_rack));
$rack = rack($id_rack,$point_device);
$col_count=count($rack_port_list)+4;
DB::disconnect();
include 'html/rack.html';
?>

