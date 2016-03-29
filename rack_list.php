<?php
//include_once "db.php";
DB::connect();
$sum = 0;
$rack_list = get_rack_list('front');
if (!empty($rack_list)) {
    foreach ($rack_list as $id_rack => $rack) {
        if ($rack['id_back_rack'] !== '0') {
            $rack_list[$id_rack]['free_space'] = free_space_in_rack($id_rack);
            $sum+=$rack_list[$id_rack]['free_space'];
        } else {
            $rack_list[$id_rack]['free_space'] = '';
        }
    }
}

DB::disconnect();

include 'html/navbar.html';
include 'html/rack_list.html';
include 'html/footer.html';
?>
