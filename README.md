Aquí tienes la lista clara, organizada y resumida de los ficheros y ubicaciones creados en el servidor para tu plugin de GLPI flowisechat (asistente GLPI iA-sistant):

📂 Ubicación raíz del plugin:
swift
Copiar
Editar
/var/www/html/glpi/plugins/flowisechat/
🗂️ Estructura de carpetas y ficheros:
arduino
Copiar
Editar
flowisechat/
├── hook.php
├── manifest.xml
├── setup.php
├── js/
│   ├── flowisechat.js
│   └── img/
│       └── logo-hutchinson-white.png
📑 Descripción de cada fichero:
✅ hook.php

Vacío (o con <?php) según buenas prácticas en GLPI 10.

No contiene lógica; necesario para estructura del plugin.

✅ manifest.xml

Define metadatos del plugin (nombre, versión, autor, GLPI mínimo compatible).

✅ setup.php

Contiene las funciones principales del plugin:

plugin_init_flowisechat()

plugin_version_flowisechat()

plugin_flowisechat_install()

plugin_flowisechat_uninstall()

Registra el JS para cargarse en GLPI.

✅ js/flowisechat.js

Script del asistente iA-sistant de GLPI:

Crea botón flotante.

Abre ventana de chat.

Permite escribir preguntas y enviar al LLM de Flowise.

Muestra respuestas de Flowise dentro de GLPI.

Incluye mejoras como:

Botón grande con logo.

Fondo rojo Hutchinson.

Mensaje de bienvenida.

Envío con ENTER.

Ajuste de altura del input.

✅ js/img/logo-hutchinson-white.png

Logo de Hutchinson en blanco.

Insertado en el botón “Enviar” dentro del asistente sobre fondo rojo.


