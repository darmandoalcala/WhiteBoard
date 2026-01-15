import { supabase } from './supabaseClient.js';
const DOMAIN = "@gpmobility.mx"; 

const emailLogin = document.getElementById('email-login');
const passwordLogin = document.getElementById('password-login');
const emailSignup = document.getElementById('email-signup');
const passwordSignup = document.getElementById('password-signup');

const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('signup-button');
const signUpButton = document.getElementById('signUp-toggle');
const logInButton = document.getElementById('logIn-toggle');
const container = document.getElementById('card');

const errorMsgLogin = document.getElementById('error-msg-login');
const errorMsgSignup = document.getElementById('error-msg-signup');


loginButton.addEventListener('click', async (e) => {
    e.preventDefault();
    
    errorMsgLogin.style.display = 'none';

    const email = emailLogin.value.trim();
    const password = passwordLogin.value.trim();

    if (!email || !password) {
        showError(errorMsgLogin, "Por favor completa todos los campos");
        return;
    }

    if (!email.endsWith(DOMAIN)) {
        showError(errorMsgLogin, `Solo se permiten correos de ${DOMAIN}`);
        return;
    }

    const originalText = loginButton.textContent;
    loginButton.textContent = "Procesando...";
    loginButton.disabled = true;

    try {          
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (error) throw error;
        
        window.location.href = "index.html"; 

    } catch (error) {
        showError(errorMsgLogin, error.message || "Error al iniciar sesión");
    } finally {
        loginButton.textContent = originalText;
        loginButton.disabled = false;
    }
});

registerButton.addEventListener('click', async (e) => {
    e.preventDefault(); 

    errorMsgSignup.style.display = 'none';
    
    const email = emailSignup.value.trim();
    const password = passwordSignup.value.trim();

    if (!email || !password) {
        showError(errorMsgSignup, "Por favor completa todos los campos");
        return;
    }

    if (!email.endsWith(DOMAIN)) {
        showError(errorMsgSignup, `Solo se permiten correos de ${DOMAIN}`);
        return;
    }

    const originalText = registerButton.textContent;
    registerButton.textContent = "Procesando...";
    registerButton.disabled = true;

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        if (error) throw error;

        alert("Cuenta creada con éxito. ¡Ya puedes iniciar sesión!");
        emailSignup.value = "";
        passwordSignup.value = "";
        container.classList.remove("right-panel-active");

    } catch (error) {
        showError(errorMsgSignup, error.message || "Error al registrarse");
    } finally {
        registerButton.textContent = originalText;
        registerButton.disabled = false;
    }
});


function showError(element, msg) {
    element.textContent = msg;
    element.style.display = 'block';
}


signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
    errorMsgLogin.style.display = 'none';
    errorMsgSignup.style.display = 'none';
});

logInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
    errorMsgLogin.style.display = 'none';
    errorMsgSignup.style.display = 'none';
});