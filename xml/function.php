<?php


function do_post_request($url, $data, $optional_headers = null) {
    $params = array('http' => array(
            'method' => 'POST',
            'content' => $data,
            'timeout'=> 1
    ));
    if ($optional_headers !== null) {
        $params['http']['header'] = $optional_headers;
    }
    $ctx = stream_context_create($params);
    $fp = @fopen($url, 'rb', false, $ctx);
    if (!$fp) {
        throw new Exception("Problem with $url, $php_errormsg");
    }
    $response = @stream_get_contents($fp);
    if ($response === false) {
        throw new Exception("Problem reading data from $url, $php_errormsg");
    }
    return $response;
}

function make_auth_header($login,$password){
    $credentials = $login.':'.$password;
    return "Authorization: Basic ".base64_encode($credentials);
}

?>

