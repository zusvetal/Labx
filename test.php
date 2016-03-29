<?php
$start = microtime(true);
include_once 'db.php';
DB::connect();

  echo '<pre>';

$racks = get_rack_list();
$sum=0;

foreach ($racks as $id_rack => $rack) {
    if ($rack['id_back_rack'] !== '0') {
        print_r(get_rack($id_rack));
        $place=free_space_in_rack($id_rack);
        $sum=$sum+$place;
        echo 'Rack '.$rack['name'].'<br>';
        echo $place;
        echo '<br>';
    }
}
echo $sum;
echo '<br>';
$time = microtime(true) - $start;
printf('Скрипт выполнялся %.4F сек.', $time);
DB::disconnect();
?>

