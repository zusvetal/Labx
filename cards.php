<?php
include_once 'functions.php';
DB::connect();
$module_list = get_search_module();
DB::disconnect();
include 'html/navbar.html';
include 'html/cards.html';
include 'html/footer.html';


?>