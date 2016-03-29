<?php
//include_once "db.php";
DB::connect();
$labdesk_list= get_labdesk_list();
DB::disconnect();

include 'html/navbar.html';
include 'html/labdesk_list.html';
include 'html/footer.html';
?>
