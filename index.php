<?php

require 'vendor/autoload.php';
// Create and configure Slim app
$app = new \Slim\App;


//Middleware - Authorization and set initial configuration 
$app->add(function ($request, $response, $next) {
    session_start();
    include_once 'db.php';
    $uri=$_SERVER['REQUEST_URI'];
    // not logged in
    if (!isset($_SESSION['user'])) {
        if ($request->isXhr() && $uri != '/login') {
            echo 'user not logged already';
            exit();
        }
        /*if() prevent loop*/
        if ($uri != '/login') {
            $_SESSION['last_route']=$uri;
            return $response->withRedirect('/login');
        }

        return $next($request, $response);
    }
    //Check route , add global prefix
    DB::connect();
    if (!isset($_SESSION['redirect'])&& !$request->isPost()&&!$request->isXhr() &&  !in_array($uri, ['/','/logout'])) {
        $first = explode("/", $uri)[1];
        $id_global_location = get_value('global_location', 'id_global_location', 'name', $first);
        if ($id_global_location) {
            $_SESSION['id_global_location'] = $id_global_location;
            $_SESSION['redirect'] = $uri;
            return $response->withHeader('location', $uri);
        } else {
            if(isset($_SESSION['id_global_location'])){
                $global=strtolower(get_value('global_location', 'name', 'id_global_location', $_SESSION['id_global_location']));
                echo $uri;
                return $response->withHeader('location', '/'.$global.$uri);
            }
            return $response->withHeader('location', '/');
        }
    }else{
        unset($_SESSION['redirect']);
    }


    // logged in
    
    if (isset($_SESSION['id_global_location'])) {
        
        $_SESSION['lab_list'] = get_lab_list();
        $_SESSION['location']=  get_value('global_location', 'name', 'id_global_location', $_SESSION['id_global_location']);
               
    }
   DB::disconnect(); 
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
    echo json_encode(authenticate($_POST['username'], $_POST['password']));
    exit();

});

$app->get('/', function ($request, $response, $args) {
    include 'html/home.html';
    return $response;
});

$app->get('/hkv', function ($request, $response, $args) {
    return $response->withHeader('location', '/hkv/stock/devices');
});

$app->get('/hvs', function ($request, $response, $args) {
     return $response->withHeader('location', '/hvs/stock/devices');
});

$app->get('/tvn', function ($request, $response, $args) {
    return $response->withHeader('location', '/tvn/stock/devices');
});


$app->get('/{global}/lab/{id_lab}', function ($request, $response, $args) {
    $id_lab = $args['id_lab'];
    include 'racks.php';
    return $response;
});
$app->get('/{global}/lab/{id_lab}/rack/{id_rack}', function ($request, $response, $args) {  
    $id_lab = $args['id_lab'];
    $id_choose_rack = $args['id_rack'];
    $racks=  get_front_rack_list($id_lab);
    
    include_once 'html/navbar.html';
    include_once 'html/racks_carusel.html';
    include_once 'html/footer.html'; 
    return $response;
});

$app->get('/{global}/labdesks', function ($request, $response, $args) {
    include 'labdesks.php';
    return $response;
});
$app->get('/{global}/stock', function ($request, $response, $args) {
    include 'stock.php';
    return $response;
});

$app->get('/{global}/stock/devices', function ($request, $response, $args) {
    
    include 'devices.php';
    return $response;
});

$app->get('/{global}/stock/cards', function ($request, $response, $args) {
    include 'cards.php';
    return $response;
});
$app->get('/{global}/models/{category}', function ($request, $response, $args) {
    $category = $args['category'];
    if ($_SESSION['level'] == '0') {
        include 'models.php';
    } else {
        echo '<br><br><center><h1>You haven`t access to this page</h2></center>';
    }
    return $response;
});
$app->get('/{global}/rack_list', function ($request, $response, $args) {
    if ($_SESSION['level'] == '0') {
        include 'rack_list.php';
    } else {
        echo '<br><br><center><h1>You haven`t access to this page</h2></center>';
    }

    return $response;
});
$app->get('/{global}/labdesk_list', function ($request, $response, $args) {
    include 'labdesk_list.php';
    return $response;
});
$app->get('/{global}/lab_list', function ($request, $response, $args) {
    if ($_SESSION['level'] == '0') {
        include 'lab_list.php';
    } else {
        echo '<br><br><center><h1>You haven`t access to this page</h2></center>';
    }
    return $response;
});
$app->get('/{global}/staff', function ($request, $response, $args) {
    include 'staff.php';
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

include_once 'ajax_routing.php';

$app->post('/ajax', function ($request, $response, $args) {
    include 'ajax.php';
    return $response;
});
$app->get('/ajax', function ($request, $response, $args) {
    include 'ajax.php';
    return $response;
});
// Run app
$app->run();
?>

