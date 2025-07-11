document.addEventListener("DOMContentLoaded", async () => {

    // FASE 1: Pedir la configuración al backend de GLPI de forma segura.
    let glpiConfig;
    try {
        const response = await fetch('/plugins/flowisechat/ajax/get_config.php');
        if (!response.ok) {
            throw new Error('No se pudo obtener la configuración de GLPI. El usuario podría no estar logueado.');
        }
        glpiConfig = await response.json();
    } catch (error) {
        console.error("Flowise & GLPI:", error.message);
        return; // Detenemos la ejecución si no hay configuración. El bot no se mostrará.
    }

    // FASE 2: Si tenemos configuración, construimos y mostramos el chat.
    const { user_id, user_name, session_token, proxy_url } = glpiConfig;
    // El ID de sesión ahora está vinculado permanentemente al usuario de GLPI.
    const sessionId = `glpi_user_${user_id}`;

    console.log(`Flowise & GLPI: Bot activado para ${user_name}.`);

    // Crear botón flotante profesional embellecido
    const button = document.createElement('button');
    button.innerHTML = `<img src="/plugins/flowisechat/js/img/logo-hutchinson-white.png" alt="AI" style="height:20px; vertical-align:middle; margin-right:6px;"> iA-sistant`;
    Object.assign(button.style, {
        position: 'fixed', bottom: '30px', right: '30px',
        padding: '14px 18px',
        background: 'linear-gradient(135deg, #E30613, #8B0000)',
        color: 'white',
        fontSize: '15px',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '50px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        cursor: 'pointer',
        zIndex: '10000',
        transition: 'transform 0.2s, box-shadow 0.2s'
    });
    button.addEventListener('mouseover', () => {
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
    });
    button.addEventListener('mouseout', () => {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
    });
    document.body.appendChild(button);

    // Crear contenedor de chat
    const chatContainer = document.createElement('div');
    Object.assign(chatContainer.style, {
        position: 'fixed', bottom: '90px', right: '30px',
        width: '380px', maxHeight: '500px', backgroundColor: 'white',
        border: '1px solid #ccc', borderRadius: '10px', padding: '10px',
        display: 'none', flexDirection: 'column', zIndex: '10000',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
    });

    const messages = document.createElement('div');
    Object.assign(messages.style, { flex: '1', overflowY: 'auto', marginBottom: '10px' });
    chatContainer.appendChild(messages);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Describe tu problema...';
    Object.assign(input.style, { width: 'calc(100% - 20px)', padding: '10px', marginBottom: '5px', border: '1px solid #ccc', borderRadius: '5px' });
    chatContainer.appendChild(input);

    const sendButton = document.createElement('button');
    sendButton.innerHTML = `
        <img src="/plugins/flowisechat/js/img/logo-hutchinson-white.png" alt="Enviar" style="height:20px; vertical-align:middle; margin-right:8px;">
        Enviar
    `;
    Object.assign(sendButton.style, {
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        width: '100%', padding: '10px', backgroundColor: '#E30613', color: 'white',
        fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer'
    });
    chatContainer.appendChild(sendButton);
    document.body.appendChild(chatContainer);

    // Función para renderizar mensajes con colores diferenciados
    function renderMessage(role, content) {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';

        const bubble = document.createElement('div');
        bubble.innerHTML = content.trim().replace(/\n/g, '<br>');

        const baseStyle = {
            padding: '8px 12px', borderRadius: '8px', margin: '4px 0', maxWidth: '90%', wordWrap: 'break-word'
        };
        const roles = {
            user: { backgroundColor: '#f0f0f0', color: '#000000', alignSelf: 'flex-end', border: '1px solid #ccc' },
            assistant: { backgroundColor: '#e6f0fa', color: '#003366', alignSelf: 'flex-start', border: '1px solid #99c2ff' },
            system: { backgroundColor: '#fff8e1', color: '#333', alignSelf: 'center', border: '1px solid #fdd835', fontSize: '0.9em', textAlign: 'center' }
        };
        Object.assign(bubble.style, baseStyle, roles[role] || roles.system);
        
        wrapper.appendChild(bubble);
        messages.appendChild(wrapper);
        messages.scrollTop = messages.scrollHeight;
    }

    // Toggle chat open/close
    button.addEventListener('click', () => {
        if (chatContainer.style.display === 'none') {
            chatContainer.style.display = 'flex';
            if (messages.children.length === 0) {
                 renderMessage('system', `🤖 ¡Hola ${user_name}! Soy tu asistente de TI.`);
            }
        } else {
            chatContainer.style.display = 'none';
        }
    });

    // Enviar pregunta y mantener memoria usando el proxy de GLPI
    async function sendQuestion() {
        const question = input.value.trim();
        if (!question) return;
        renderMessage('user', question);
        input.value = '';
        const loadingBubble = renderMessage('assistant', '🤖...');

        try {
            const res = await fetch(proxy_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Session-Token': session_token
                },
                body: JSON.stringify({ question: question })
            });
            
            // Elimina el "Pensando..."
            loadingBubble.parentElement.remove();

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `Error del servidor: ${res.status}`);
            }

            const data = await res.json();
            renderMessage('assistant', data.text || JSON.stringify(data));

        } catch (err) {
            if (loadingBubble) {
                loadingBubble.parentElement.remove();
            }
            renderMessage('system', '❌ Error de conexión: ' + err.message);
        }
    }
    
    sendButton.addEventListener('click', sendQuestion);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendQuestion(); });
});