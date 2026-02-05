import { supabase } from './supabaseClient.js';

const searchInput = document.getElementById('usuario_search');
const suggestionsList = document.getElementById('user-suggestions');
const hiddenIdInput = document.getElementById('form-para');
const dptoInput = document.getElementById('usuario_dpto_display');

let debounceTimer;

const debounce = (func, delay) => {
    return (...args) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
};

const clearSelection = () => {
    hiddenIdInput.value = '';
    dptoInput.value = '';
    suggestionsList.style.display = 'none';
};

const selectUser = (user) => {
    searchInput.value = user['NOMBRE COMPLETO']; 
    hiddenIdInput.value = user.id;
    dptoInput.value = user['DEPARTAMENTO'] || 'Sin área asignada';
    suggestionsList.style.display = 'none';
};

const renderSuggestions = (users) => {
    suggestionsList.innerHTML = '';
    
    if (users.length === 0) {
        suggestionsList.style.display = 'none';
        return;
    }

    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user["NOMBRE COMPLETO"]} - ${user.DEPARTAMENTO || ''}`;
        
        li.addEventListener('click', () => selectUser(user));
        
        suggestionsList.appendChild(li);
    });

    suggestionsList.style.display = 'block';
};

const handleSearch = async (e) => {
    const query = e.target.value.trim();

    if (query.length < 2) {
        suggestionsList.style.display = 'none';
        return;
    }

    if (hiddenIdInput.value) {
        hiddenIdInput.value = '';
        dptoInput.value = '';
    }

    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('"id", "NOMBRE COMPLETO", "DEPARTAMENTO"')
            .eq("ACTIVO", true)
            .ilike('"NOMBRE COMPLETO"', `%${query}%`) 
            .limit(5);

        if (error) throw error;
        renderSuggestions(data);

    } catch (error) {
        console.error('Error buscando usuarios:', error);
    }
};

searchInput.addEventListener('input', debounce(handleSearch, 300));

document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
        suggestionsList.style.display = 'none';
    }
});