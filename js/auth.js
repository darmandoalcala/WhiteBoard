import { supabase } from './supabaseClient.js';

const DOMAIN = "@gpmobility.mx"; 


const emailLogin = document.getElementById('email-login');
const passwordLogin = document.getElementById('password-login');


const userSearchInput = document.getElementById('user-search-input');
const suggestionsList = document.getElementById('user-suggestions');
const emailSignup = document.getElementById('email-signup');
const passwordSignup = document.getElementById('password-signup');
const passwordConfirm = document.getElementById('password-confirm');

const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('signup-button');
const signUpToggle = document.getElementById('signUp-toggle');
const logInToggle = document.getElementById('logIn-toggle');
const container = document.getElementById('card');

// Mensajes de Error
const errorMsgLogin = document.getElementById('error-msg-login');
const errorMsgSignup = document.getElementById('error-msg-signup');

// Switch mirar contraseña
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', () => {
        const targetId = icon.getAttribute('data-target');
        const input = document.getElementById(targetId);
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// --- 2. LÓGICA DE BUSCADOR DE USUARIOS ---
let debounceTimer;


const handleSearch = async (e) => {
    const query = e.target.value.trim();

    if (query.length < 3) {
        suggestionsList.style.display = 'none';
        return;
    }

    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('id, "NOMBRE COMPLETO", CORREO')
            .eq('ACTIVO', true)
            .ilike('"NOMBRE COMPLETO"', `%${query}%`) 
            .limit(5);

        if (error) throw error;
        renderSuggestions(data);

    } catch (error) {
        console.error('Error buscando usuario:', error);
    }
};

const renderSuggestions = (users) => {
    suggestionsList.innerHTML = '';
    
    if (users.length === 0) {
        suggestionsList.style.display = 'none';
        return;
    }

    users.forEach(user => {
        const li = document.createElement('li');
        const nombre = user['NOMBRE COMPLETO'];
        
        const userEmail = user.CORREO || ''; 

        li.textContent = nombre;
        
        li.addEventListener('click', () => {
            userSearchInput.value = nombre;
            
            if (userEmail) {
                emailSignup.value = userEmail; 
            } else {
                alert("Este usuario no tiene correo registrado. Ingrésalo manualmente.");
            }
            
            suggestionsList.style.display = 'none';
        });
        
        suggestionsList.appendChild(li);
    });

    suggestionsList.style.display = 'block';
};

if(userSearchInput) {
    userSearchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => handleSearch(e), 300);
    });

    document.addEventListener('click', (e) => {
        if (!userSearchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
            suggestionsList.style.display = 'none';
        }
    });
}


// --- 3. LÓGICA DE LOGIN ---
loginButton.addEventListener('click', async (e) => {
    e.preventDefault();
    
    showError(errorMsgLogin, "", false); // Limpiar error

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
        
        window.location.href = "/"; 

    } catch (error) {
        showError(errorMsgLogin, "Correo o contraseña incorrectos");
        console.error(error);
    } finally {
        loginButton.textContent = originalText;
        loginButton.disabled = false;
    }
});


// --- 4. LÓGICA DE REGISTRO (SIGNUP) ---
registerButton.addEventListener('click', async (e) => {
    e.preventDefault(); 

    showError(errorMsgSignup, "", false); // Limpiar error
    
    const email = emailSignup.value.trim();
    const password = passwordSignup.value.trim();
    const confirm = passwordConfirm.value.trim();
    const selectedName = userSearchInput.value;

    // Validaciones
    if (!email || !password || !confirm || !selectedName) {
        showError(errorMsgSignup, "Por favor completa todos los campos y busca tu nombre.");
        return;
    }

    if (password !== confirm) {
        showError(errorMsgSignup, "Las contraseñas no coinciden.");
        return;
    }

    if (password.length < 6) {
        showError(errorMsgSignup, "La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    if (!email.endsWith(DOMAIN)) {
        showError(errorMsgSignup, `Solo se permiten correos de ${DOMAIN}`);
        return;
    }

    const originalText = registerButton.textContent;
    registerButton.textContent = "Creando cuenta...";
    registerButton.disabled = true;

    try {
        // Registro en Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    nombre_vinculacion: selectedName
                }
            }
        });

        if (error) throw error;

        alert("Cuenta creada con éxito. ¡Ya puedes iniciar sesión!");
        
        // Limpiar campos y cambiar panel
        container.classList.remove("right-panel-active");
        emailSignup.value = "";
        passwordSignup.value = "";
        passwordConfirm.value = "";
        userSearchInput.value = "";

    } catch (error) {
        showError(errorMsgSignup, error.message || "Error al registrarse");
    } finally {
        registerButton.textContent = originalText;
        registerButton.disabled = false;
    }
});


//  UTILIDADES 
function showError(element, msg, show = true) {
    element.textContent = msg;
    element.style.display = show ? 'block' : 'none';
}


//REGISTRAR
signUpToggle.addEventListener('click', () => {
    container.classList.add("right-panel-active");
    
    showError(errorMsgLogin, "", false);
    showError(errorMsgSignup, "", false);

    emailSignup.value = "";
    passwordSignup.value = "";
    userSearchInput.value = ""; 
});

//INICIAR SESIÓN
logInToggle.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
    
    showError(errorMsgLogin, "", false);
    showError(errorMsgSignup, "", false);

    emailLogin.value = "";
    passwordLogin.value = "";
    userSearchInput.value = ""; 
});