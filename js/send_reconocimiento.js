import { supabase } from './supabaseClient.js';

const btnEnviar = document.getElementById('btn-enviar');
const inputDestinatarioId = document.getElementById('form-para'); // El ID oculto
const selectValor = document.getElementById('form-reconocimiento');
const inputMensaje = document.getElementById('form-mensaje');
const inputSearch = document.getElementById('usuario_search');
const inputDpto = document.getElementById('usuario_dpto_display');

btnEnviar.addEventListener('click', async (e) => {
    e.preventDefault();

    const destinatarioId = inputDestinatarioId.value;
    const mensaje = inputMensaje.value.trim();
    const valor = selectValor.value;

    if (!destinatarioId) {
        alert("Por favor, busca y selecciona a un compañero de la lista.");
        return;
    }

    if (!mensaje) {
        alert("Por favor, escribe un mensaje describiendo la acción.");
        return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        alert("Error: No se detecta tu sesión. Por favor inicia sesión nuevamente.");
        return;
    }

    const originalText = btnEnviar.innerHTML;
    btnEnviar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btnEnviar.disabled = true;

    try {
        // 4. ENVIAR A SUPABASE
        const { error } = await supabase
            .from('reconocimientos')
            .insert([
                {
                    remitente_id: user.id,
                    destinatario_id: destinatarioId,
                    valor: valor,
                    mensaje: mensaje,
                    fecha: new Date().toISOString()
                }
            ]);

        if (error) throw error;

        alert("¡Reconocimiento enviado con éxito! 💙");
        limpiarFormulario();

    } catch (error) {
        console.error("Error al enviar:", error);
        alert("Hubo un error al enviar el reconocimiento. Intenta de nuevo.");
    } finally {
        btnEnviar.innerHTML = originalText;
        btnEnviar.disabled = false;
    }
});

function limpiarFormulario() {
    inputSearch.value = '';
    inputDestinatarioId.value = '';
    inputDpto.value = '';
    inputMensaje.value = '';
    selectValor.selectedIndex = 0;
}