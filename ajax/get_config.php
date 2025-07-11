<?php
define("GLPI_ROOT", "../../..");
include (GLPI_ROOT . "/inc/includes.php");

header("Content-Type: application/json");

if (Session::getLoginUserID()) {
    $config_data = [
        'user_id'       => Session::getLoginUserID(),
        'user_name'     => Session::getLoginUserName(),
        'session_token' => Session::getSessionToken(),
        'proxy_url'     => rtrim(Toolbox::getGlpiUrl(), '/') . '/plugins/flowisechat/ajax/proxy.php'
    ];
    echo json_encode($config_data);
} else {
    http_response_code(403);
    echo json_encode(['error' => 'Usuario no autenticado.']);
}
?>