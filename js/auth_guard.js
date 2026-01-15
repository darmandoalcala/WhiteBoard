import { supabase } from './supabaseClient.js';

async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = "login.html";
    }
}

checkSession();

window.logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "login.html";
}