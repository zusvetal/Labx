<?php
//include_once 'db.php';
DB::connect();
$lab_name=  get_value('labs', 'lab_name', 'id_lab', $id_lab);
$racks=get_front_rack_list($id_lab);
include 'html/navbar.html';
include_once 'html/racks.html';
include 'html/footer.html';
DB::disconnect();
?>

