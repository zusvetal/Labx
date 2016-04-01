<?php

function set_access_level() {
    $admins = [
        'Vitalii Zusko',
        'Volodymyr Bogdanov',
        'Marcelo Kowalski',
        'Asi Dahan'
    ];
    $user = $_SESSION['name'] . ' ' . $_SESSION['surname'];
    if (in_array($user, $admins)) {
        $_SESSION['level'] = '0';
    } else {
        $_SESSION['level'] = '1';
    }
}

function authenticate($username, $password) {
    if (empty($username) || empty($password))
        return false;
    //$adServer = "ldap://kv-dc01.hlit.local";
    $adServer = "ldap://10.46.2.102";
    $ldap = ldap_connect($adServer);
    $ldaprdn = 'HLS' . "\\" . $username;
    ldap_set_option($ldap, LDAP_OPT_PROTOCOL_VERSION, 3);
    ldap_set_option($ldap, LDAP_OPT_REFERRALS, 0);
    if (@ldap_bind($ldap, $ldaprdn, $password)) {
        $filter = "(sAMAccountName=$username)";
        $result = ldap_search($ldap, "ou=users,ou=Ukraine,ou=sites,dc=hlit,dc=local", $filter);
        ldap_sort($ldap, $result, "sn");
        $info = ldap_get_entries($ldap, $result);
        $_SESSION['user'] = $username;
        $_SESSION['surname'] = isset($info[0]['sn'][0]) ? $info[0]['sn'][0] : '';
        $_SESSION['name'] = isset($info[0]['givenname'][0]) ? $info[0]['givenname'][0] : $username;
        @ldap_close($ldap);
        set_access_level();
        
        if(isset($_SESSION['last_route'])) {
            $lastRoute = $_SESSION['last_route'];
            unset($_SESSION['last_route']);
            
            return $lastRoute;
        }
        
        return true;
    } else {
        
        return false;
    }
}
?>
