<?php

function parseHeaders($headers) {
    $head = array();
    foreach ($headers as $k => $v) {
        $t = explode(':', $v, 2);
        if (isset($t[1]))
            $head[trim($t[0])] = trim($t[1]);
        else {
            $head[] = $v;
            if (preg_match("#HTTP/[0-9\.]+\s+([0-9]+)#", $v, $out))
                $head['reponse_code'] = intval($out[1]);
        }
    }
    return $head;
}

function do_post_request($url, $data, $optional_headers = null) {
    $params = array('http' => array(
            'method' => 'POST',
            'content' => $data,
            'timeout' => 1
    ));
    if ($optional_headers !== null) {
        $params['http']['header'] = $optional_headers;
    }
    $context = stream_context_create($params);
    $fp = @fopen($url, 'r', false, $context);
    if (!$fp) {
        
        return false;
    }
    $response = @stream_get_contents($fp);
    if ($response === false) {
        
        return false;
    }
    /*** If request content is zip ***/
    $response_headers = parseHeaders($http_response_header);
    if (isset($response_headers['Content-Encoding'] )&& $response_headers['Content-Encoding'] === 'gzip') {
        $response = gzdecode($response);
    }

    return $response;
}

function make_auth_header($login, $password) {
    $credentials = $login . ':' . $password;
    return "Authorization: Basic " . base64_encode($credentials);
}

?>

