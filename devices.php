<?php
include_once 'functions.php';
DB::connect();
$device_list =  get_devices(get_search_device());
DB::disconnect();

include 'html/navbar.html';
include 'html/devices.html';
include 'html/footer.html';
?>