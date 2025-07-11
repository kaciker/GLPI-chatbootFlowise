<?php
// En tu archivo hook.php
// Prueba de grok

function plugin_flowisechat_hook_display_central($params) {

    echo ""; // Nuevo comentario para depurar

    // Obtenemos los datos directamente, sin la condición IF
    $glpi_data = [
        'session_token' => Session::getSessionToken(),
        'user_id'       => Session::getLoginUserID(), // Esto podría ser nulo, pero es parte de la prueba
        'user_name'     => Session::getLoginUserName(),
        'proxy_url'     => rtrim(Toolbox::getGlpiUrl(), '/') . '/plugins/flowisechat/inc/ajax_proxy.php'
    ];

    // Inyectamos el objeto de configuración sin condiciones
    echo "<script type='text/javascript'>
            window.glpiFlowiseConfig = " . json_encode($glpi_data, JSON_HEX_TAG) . ";
          </script>";
          
    // Nos aseguramos de que el script principal también se carga aquí
    echo '<script type="text/javascript" src="' . Toolbox::getGlpiUrl() . '/plugins/flowisechat/js/flowisechat.js"></script>';

    return true;
}