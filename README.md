# GLPI iA-sistant Plugin

Asistente flotante para **GLPI** con integración de **Flowise** u Ollama, que permite:
✅ Resolver dudas a usuarios antes de abrir tickets.  
✅ Consultar documentación integrada mediante RAG.  
✅ Conservar historial con memoria de conversación.  
✅ Estética corporativa Hutchinson (botón rojo con logo).  
✅ Crear tickets automáticamente en fase 2.

---

## 🚀 Estructura del plugin

El plugin se instala en:

/var/www/html/glpi/plugins/flowisechat/

makefile
Copiar
Editar

<img width="307" height="250" alt="image" src="https://github.com/user-attachments/assets/8b731f51-0a43-40ed-a5c3-4a7e30cc392a" />



---

## 📂 Descripción de ficheros

- **`manifest.xml`**: Metadatos del plugin (nombre, autor, versión).
- **`setup.php`**: Hooks de inicialización y carga de JS.
- **`hook.php`**: Archivo de placeholder.
- **`js/flowisechat.js`**: Lógica del asistente:
  - Botón flotante con logo de Hutchinson.
  - Ventana de chat interna.
  - Envío con `ENTER` o botón.
  - Conexión con Flowise vía API REST.
  - Soporte de `sessionId` para memoria persistente por usuario.
- **`js/img/logo-hutchinson-white.png`**: Logo blanco para el botón del asistente.

---

## ⚙️ Configuración del entorno Flowise

1️⃣ Asegúrate de que Flowise está expuesto con:

PORT=3000
CORS_ORIGINS=http://<ip_glpi>


2️⃣ **Usa el `chatflowId` correcto** de tu flujo en Flowise para el asistente.

3️⃣ Configura el token de Flowise en `flowisechat.js`:

```javascript
const baseUrl = 'http://<ip_flowise>:3000';
const flowId = '<tu_chatflow_id>';
Authorization: 'Bearer <tu_token_flowise>'

✨ Funcionalidades destacadas
✅ Botón flotante visible en todo GLPI
✅ Envía consultas con ENTER y botón
✅ Mensaje de bienvenida personalizado
✅ Estética consistente con la marca (rojo Hutchinson)
✅ Historial con memoria por usuario (sessionId)
✅ Renderizado limpio de mensajes de usuario y asistente


🛠️ Instalación
1️⃣ Clonar/copiar en:

swift
Copiar
Editar
/var/www/html/glpi/plugins/flowisechat
2️⃣ Dar permisos:

bash
Copiar
Editar
chown -R www-data:www-data /var/www/html/glpi/plugins/flowisechat
3️⃣ Limpiar caché de GLPI:

bash
Copiar
Editar
rm -rf /var/www/html/glpi/files/_cache/*
4️⃣ Reiniciar GLPI:

bash
Copiar
Editar
docker restart glpi
5️⃣ Activar el plugin desde GLPI > Configuración > Plugins.

🖥️ Uso
Se muestra un botón “iA-sistant” en rojo en la esquina inferior derecha.

Al hacer clic, se despliega el chat.

Se puede escribir consultas y enviarlas con ENTER o clic en Enviar.

Respuestas generadas por tu LLM (Flowise / Ollama).

🪐 Futuras extensiones
✅ Creación de tickets automática tras la conversación.
✅ Logs de conversaciones en GLPI.
✅ Clasificación de urgencia según la consulta.
✅ Panel de administración de sesiones y métricas de uso.

🤝 Contribución
Pull Requests y sugerencias bienvenidas para mejorar el plugin y extender funcionalidades con RAG, clasificación de intenciones y conexión avanzada con la API de GLPI para generación de tickets inteligentes.

🛡️ Licencia
GPLv3+ - Uso interno y mejora de procesos IT corporativos.




El proceso es el siguiente:

El Navegador Envía la Cookie: Cuando tu JavaScript llama a get_config.php, tu navegador envía automáticamente la cookie de sesión de GLPI junto con la petición.

GLPI Carga el Contexto: La línea include '.../inc/includes.php'; en nuestro script usa esa cookie para cargar toda tu información de sesión en la memoria del servidor. En este preciso momento, GLPI ya sabe quién eres, cuál es tu ID, tu nombre, tu perfil, etc.

El Script Pide los Datos: Las funciones como Session::getLoginUserID() o Session::getLoginUserName() no "buscan" al usuario. Simplemente leen los datos que ya han sido cargados en el paso anterior.
