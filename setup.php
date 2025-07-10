<?php

function plugin_init_flowisechat() {
    global $PLUGIN_HOOKS;
    // Inyecta tu JS del chatbot
    $PLUGIN_HOOKS['add_javascript']['flowisechat'] = 'js/flowisechat.js';
    // Declara que el plugin cumple con CSRF
    $PLUGIN_HOOKS['csrf_compliant']['flowisechat'] = true;
}

function plugin_version_flowisechat() {
    return [
        'name'           => 'Flowise Chat LLM',
        'version'        => '1.0.0',
        'author'         => 'Marcos Hidalgo',
        'license'        => 'GPLv3+',
        'homepage'       => 'https://www.hutchinson.com/',
        'minGlpiVersion' => '10.0'
    ];
}

function plugin_flowisechat_check_prerequisites() {
    return true;
}

function plugin_flowisechat_check_config() {
    return true;
}

function plugin_flowisechat_install() {
    return true;
}

function plugin_flowisechat_uninstall() {
    return true;
}