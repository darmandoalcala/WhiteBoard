import { supabase } from './supabaseClient.js';
const DOMAIN = "@gpmobility.mx"; 

const emailInput = document.getElementById('email');
const passInput = document.getElementById('password');
const actionBtn = document.getElementById('action-btn');
const toggleBtn = document.getElementById('toggle-btn');
const title = document.getElementById('form-title');
const errorMsg = document.getElementById('error-msg');

let isLoginMode = true; 


toggleBtn.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    if (isLoginMode) {
        title.textContent = "Iniciar Sesión";
        actionBtn.textContent = "Entrar";
        toggleBtn.textContent = "¿No tienes cuenta? Regístrate aquí";
    } else {
        title.textContent = "Crear Cuenta";
        actionBtn.textContent = "Registrarse";
        toggleBtn.textContent = "¿Ya tienes cuenta? Inicia sesión";
    }
    errorMsg.style.display = 'none';
});


actionBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passInput.value.trim();

    
    if (!email || !password) {
        showError("Por favor completa todos los campos");
        return;
    }

    
    if (!email.endsWith(DOMAIN)) {
        showError(`Solo se permiten correos de ${DOMAIN}`);
        return;
    }

    actionBtn.textContent = "Procesando...";
    actionBtn.disabled = true;

    try {
        if (isLoginMode) {
            
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if (error) throw error;
            
            
            window.location.href = "index.html"; 

        } else {
            
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });
            if (error) throw error;

            alert("Cuenta creada con éxito. ¡Ya puedes iniciar sesión!");
            
            isLoginMode = true;
            title.textContent = "Iniciar Sesión";
            actionBtn.textContent = "Entrar";
            toggleBtn.textContent = "¿No tienes cuenta? Regístrate aquí";
        }

    } catch (error) {
        showError(error.message);
    } finally {
        actionBtn.disabled = false;
        actionBtn.textContent = isLoginMode ? "Entrar" : "Registrarse";
    }
});

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
}