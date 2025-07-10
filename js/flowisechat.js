// flowisechat.js - Integración tipo widget oficial con sessionId y memoria

document.addEventListener("DOMContentLoaded", () => {
    const flowId = '85d00ec1-ad2b-4ad2-9e53-fffe884d36cb';
    const baseUrl = window.location.protocol + '//' + window.location.hostname + ':3000';
    // const baseUrl = 'http://10.35.1.186:3000'; // Hut
    // const baseUrl = 'http://192.168.30.241:3000';   // Visit
    // Obtener o generar sessionId (persistente por usuario)
    const SESSION_KEY = 'flowise_chat_sessionId';
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
        sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem(SESSION_KEY, sessionId);
    }
    
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
        wrapper.className = 'message ' + role;
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.innerHTML = content.trim().replace(/\n/g, '<br>');

        if (role === 'user') {
            Object.assign(bubble.style, {
                backgroundColor: '#f0f0f0',
                color: '#000000',
                padding: '8px 12px',
                borderRadius: '8px',
                margin: '4px 0',
                alignSelf: 'flex-end',
                maxWidth: '90%',
                border: '1px solid #ccc'
            });
        } else if (role === 'assistant') {
            Object.assign(bubble.style, {
                backgroundColor: '#e6f0fa',
                color: '#003366',
                padding: '8px 12px',
                borderRadius: '8px',
                margin: '4px 0',
                alignSelf: 'flex-start',
                maxWidth: '90%',
                border: '1px solid #99c2ff'
            });
        } else {
            Object.assign(bubble.style, {
                backgroundColor: '#fff8e1',
                color: '#333',
                padding: '8px 12px',
                borderRadius: '8px',
                margin: '4px 0',
                alignSelf: 'center',
                maxWidth: '90%',
                border: '1px solid #fdd835'
            });
        }

        wrapper.appendChild(bubble);
        messages.appendChild(wrapper);
        messages.scrollTop = messages.scrollHeight; // para mantener autoscroll abajo
        wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' }); // para mostrar el inicio del nuevo mensaje

    }


    // Toggle chat open/close
    button.addEventListener('click', () => {
        if (chatContainer.style.display === 'none') {
            chatContainer.style.display = 'flex';
            renderMessage('system', '🤖 Wellcome to the IT support Hutchisnon!');
        } else {
            chatContainer.style.display = 'none';
            messages.innerHTML = '';
        }
    });

    // Enviar pregunta y mantener memoria usando sessionId
    sendButton.addEventListener('click', sendQuestion);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendQuestion(); });

    async function sendQuestion() {
        const question = input.value.trim();
        if (!question) return;
        renderMessage('user', question);
        input.value = '';
        const loadingIndex = messages.children.length;
        renderMessage('assistant', '🤖 Pensando...');

        try {
            const res = await fetch(`${baseUrl}/api/v1/prediction/${flowId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 0HWkYMNQtzRyjC_fsbyJ4a-YVT5YF673kSygqIegmo8' // Usa tu token real aquí
                },
                body: JSON.stringify({
                    question,
                    overrideConfig: {
                        sessionId
                    }
                })
            });
            if (!res.ok) throw new Error(`Status ${res.status}`);
            const data = await res.json();
            // Reemplaza "Pensando..."
            messages.removeChild(messages.children[loadingIndex]);
            // Mostrar respuesta
            renderMessage('assistant', data.text || JSON.stringify(data));
        } catch (err) {
            messages.removeChild(messages.children[loadingIndex]);
            renderMessage('system', '❌ Error de conexión: ' + err.message);
        }
    }
});
