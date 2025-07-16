<?php
/**  FlowiseChat – Endpoint de sesión (plugins/flowisechat/ajax/session.php) */
include_once '../../../inc/includes.php';
Session::checkLoginUser();

header('Content-Type: application/json; charset=utf-8');
echo json_encode([
    'id'   => $_SESSION['glpiID']         ?? null,
    'name' => $_SESSION['glpiname']       ?? '',
    'csrf' => $_SESSION['glpicsrf_token'] ?? null,
    'sid'  => session_id()
]);