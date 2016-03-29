<?php
//include_once  "db.php";
DB::connect();
$lab_list= get_lab_list();
DB::disconnect();

include 'html/navbar.html';
include 'html/lab_list.html';
include 'html/footer.html';
?>
