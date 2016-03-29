<?php

require 'vendor/autoload.php';
// Create and configure Slim app
$app = new \Slim\App;


//Middleware - Authorization and set initial configuration 
$app->add(function ($request, $response, $next) {
    session_start();
    include_once 'db.php';
    
    // not logged in
    if (!isset($_SESSION['user'])) {
        if ($request->isXhr() && $_SERVER['REQUEST_URI'] != '/login') {
            echo 'user not logged already';
            exit();
        }
        /*if() prevent loop*/
        if ($_SERVER['REQUEST_URI'] != '/login') {
            return $response->withRedirect('/login');
        }

        return $next($request, $response);
    }

    // logged in
    if (isset($_SESSION['id_global_location'])) {
        DB::connect();
        $_SESSION['lab_list'] = get_lab_list();
        $_SESSION['location']=  get_value('global_location', 'name', 'id_global_location', $_SESSION['id_global_location']);
        DB::disconnect();        
    }
    return $next($request, $response);
    
});



/*** Define app routes ***/

$app->get('/logout', function ($request, $response, $args) {
    session_unset();
    $_SESSION = array();
    unset($_SESSION['user'], $_SESSION['surname'], $_SESSION['name']);
    session_destroy();
    return $response->withHeader('location', '/');
});

$app->get('/login', function ($request, $response, $args) {
    include 'html/login.html';
    return $response;
});

$app->post('/login', function ($request, $response, $args) {
    include 'login.php';
    echo authenticate($_POST['username'], $_POST['password']);
    exit();
});

$app->get('/', function ($request, $response, $args) {
    include 'html/home.html';
    return $response;
});

$app->get('/hkv', function ($request, $response, $args) {
    $_SESSION['id_global_location'] = '1'; //HKV
    header('Location:/stock/devices');
    return $response;
});

$app->get('/hvs', function ($request, $response, $args) {
    $_SESSION['id_global_location'] = '2'; //HVS
    header('Location:/stock/devices');

    return $response;
});
$app->get('/lab/{id_lab}', function ($request, $response, $args) {
    $id_lab = $args['id_lab'];
    include 'racks.php';
    return $response;
});
$app->get('/lab/{id_lab}/rack/{id_rack}', function ($request, $response, $args) {
   
    $id_lab = $args['id_lab'];
    $id_choose_rack = $args['id_rack'];
//    $rack_name = get_value('rack', 'name', 'id_rack', $id_rack);
//    $id_back_rack = get_value('rack', 'id_back_rack', 'id_rack', $id_rack);
    $racks=  get_front_rack_list($id_lab);
    
    include_once 'html/navbar.html';
//    include_once 'html/rack_full.html';
    include_once 'html/racks_carusel.html';
    include_once 'html/footer.html';
    return $response;
});

$app->get('/labdesks', function ($request, $response, $args) {
    include 'labdesks.php';
    return $response;
});
$app->get('/stock', function ($request, $response, $args) {
    include 'stock.php';
    return $response;
});

$app->get('/stock/devices', function ($request, $response, $args) {
    
    include 'devices.php';
    return $response;
});

$app->get('/stock/cards', function ($request, $response, $args) {
    include 'cards.php';
    return $response;
});
$app->get('/models/{category}', function ($request, $response, $args) {
    $category = $args['category'];
    if ($_SESSION['level'] == '0') {
        include 'models.php';
    } else {
        echo '<br><br><center><h1>You haven`t access to this page</h2></center>';
    }
    return $response;
});
$app->get('/rack_list', function ($request, $response, $args) {
    if ($_SESSION['level'] == '0') {
        include 'rack_list.php';
    } else {
        echo '<br><br><center><h1>You haven`t access to this page</h2></center>';
    }

    return $response;
});
$app->get('/labdesk_list', function ($request, $response, $args) {
    include 'labdesk_list.php';
    return $response;
});
$app->get('/lab_list', function ($request, $response, $args) {
    if ($_SESSION['level'] == '0') {
        include 'lab_list.php';
    } else {
        echo '<br><br><center><h1>You haven`t access to this page</h2></center>';
    }
    return $response;
});
$app->get('/staff', function ($request, $response, $args) {
    include 'staff.php';
    return $response;
});

$app->post('/ajax', function ($request, $response, $args) {
    include 'ajax.php';
    return $response;
});

$app->post('/snmp/{model}', function ($request, $response, $args) {
    include 'snmp/' . $args['model'] . '.php';
    return $response;
});
$app->post('/xml/{model}', function ($request, $response, $args) {
    include 'xml/' . $args['model'] . '.php';
    return $response;
});


// Run app
$app->run();
?>

