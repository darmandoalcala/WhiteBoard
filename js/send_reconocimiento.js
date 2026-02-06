import { supabase } from './supabaseClient.js';

const btnEnviar = document.getElementById('btn-enviar');
const inputDestinatarioId = document.getElementById('form-para'); // Este ID ya debe ser el int4 (del buscador)
const selectValor = document.getElementById('form-reconocimiento');
const inputMensaje = document.getElementById('form-mensaje');
const inputSearch = document.getElementById('usuario_search');
const inputDpto = document.getElementById('usuario_dpto_display');

btnEnviar.addEventListener('click', async (e) => {
    e.preventDefault();

    const destinatarioId = inputDestinatarioId.value;
    const mensaje = inputMensaje.value.trim();
    const valor = selectValor.value;

    // Validaciones básicas
    if (!destinatarioId) {
        alert("Por favor, busca y selecciona a un compañero de la lista.");
        return;
    }

    if (!mensaje) {
        alert("Por favor, escribe un mensaje describiendo la acción.");
        return;
    }

    // 1. OBTENER USUARIO DE AUTH (SESIÓN)
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        alert("Error: No se detecta tu sesión. Por favor inicia sesión nuevamente.");
        return;
    }

    // UI: Botón cargando
    const originalText = btnEnviar.innerHTML;
    btnEnviar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btnEnviar.disabled = true;

    try {
        const { data: datosRemitente, error: errorBusqueda } = await supabase
            .from('usuarios')
            .select('id')
            .eq('CORREO', user.email)
            .single();

        if (errorBusqueda || !datosRemitente) {
            console.error("Error buscando remitente:", errorBusqueda);
            console.log();
            throw new Error("No pudimos encontrar tu perfil de empleado asociado a este correo.");
        }

        const remitenteIntId = datosRemitente.id;

        // 3. ENVIAR A SUPABASE (Ahora sí, con IDs numéricos)
        const { error } = await supabase
            .from('reconocimientos')
            .insert([
                {
                    remitente_id: remitenteIntId,
                    destinatario_id: destinatarioId,
                    valor: valor,
                    mensaje: mensaje
                }
            ]);

        if (error) throw error;

        alert("¡Reconocimiento enviado con éxito! 💙");
        limpiarFormulario();

    } catch (error) {
        console.error("Error al enviar:", error);
        alert("Hubo un error al enviar el reconocimiento: " + error.message);
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