<?php
// ajax/proxy.php
define("GLPI_ROOT", "../../..");
include (GLPI_ROOT . "/inc/includes.php");

header("Content-Type: application/json");

// Verifica la sesión de GLPI
if (!Session::getLoginUserID()) {
    http_response_code(403);
    echo json_encode(["error" => "Acceso denegado"]);
    exit();
}

// Recoge la pregunta del frontend
$json_input = file_get_contents("php://input");
$input = json_decode($json_input, true);
$user_question = $input["question"] ?? "";

if (empty($user_question)) {
    http_response_code(400);
    echo json_encode(["error" => "Pregunta no proporcionada"]);
    exit();
}

// --- CONFIGURACIÓN DE FLOWISE ---
// ATENCIÓN: Estos datos deben venir de la configuración de tu plugin.
$flowise_url = "http://URL_DE_TU_FLOWISE/api/v1/prediction/ID_DEL_CHATFLOW";
$flowise_api_key = "TU_API_KEY_DE_FLOWISE";

// Prepara los datos para Flowise
$flowise_payload = [
    "question" => $user_question,
    "overrideConfig" => [
        "sessionId" => "glpi_user_" . Session::getLoginUserID(),
        "vars" => [
            "glpi_user_name" => Session::getLoginUserName(),
            "glpi_user_id"   => Session::getLoginUserID()
        ]
    ]
];

// Llama a Flowise
$ch = curl_init($flowise_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($flowise_payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer " . $flowise_api_key
]);

$flowise_response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Devuelve la respuesta de Flowise al navegador
http_response_code($http_code);
echo $flowise_response;


