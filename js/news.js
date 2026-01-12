import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://oovzygalahromrinjffl.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vdnp5Z2FsYWhyb21yaW5qZmZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MzQwMzgsImV4cCI6MjA3OTIxMDAzOH0.crTTU0mxDvGJ2n2_MrQ43BTSBseYRbh7P5Prh5T98Wg';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

//NOTICAS CARGADAS DE SUPABASE Y S3 AWS

// --- CARGAR NOTICIAS (BLOG) ---
async function loadLatestNews() {
    const container = document.getElementById('latest-news-container');

    // 1. Consultar a Supabase (Tabla 'noticias')
    // Ordenamos por fecha descendente para traer la más nueva
    const { data: news, error } = await supabase
        .from('noticias')
        .select('*')
        .order('fecha', { ascending: false })
        .limit(1);

    if (error) {
        console.error("Error cargando noticias:", error);
        container.innerHTML = "<p>No se pudieron cargar las noticias.</p>";
        return;
    }

    if (!news || news.length === 0) {
        container.innerHTML = "<p>No hay noticias recientes.</p>";
        return;
    }

    // Tomamos la primera noticia (la más reciente)
    const item = news[0];
        console.table(item);
    
    const dateObj = new Date(item.fecha + "T12:00:00"); 
    const dateFormatted = new Intl.DateTimeFormat('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(dateObj);


    const newsHTML = `
    <div class="news-card">
        
        <div class="news-image-col">
            <img src="${item.imagen_url}" alt="${item.titulo}" class="news-img" 
                onerror="this.src='assets/img_calendar.jpeg'"> </div>

        <div class="news-content-col">
            
            <div class="news-meta-header">
                <div class="author-avatar-circle">
                    <i class="fas fa-user"></i>
                </div>
                <div class="meta-text">
                    <span class="author-name">${item.autor || 'GP Mobility'}</span>
                    <span class="meta-date">${dateFormatted} · ${item.minutos_lectura || 1} Min. de lectura</span>
                </div>
                <div class="meta-options"><i class="fas fa-ellipsis-v"></i></div>
            </div>

            <h3 class="news-title">${item.titulo}</h3>
            <p class="news-excerpt">
                ${item.contenido.substring(0, 200)}...
            </p>

            <div class="news-footer">
                <div class="news-stats">
                    <span>${item.vistas || 0} visualizaciones</span>
                    <span>${item.likes || 0} <i class="fas fa-heart" style="color: #e11d48;"></i></span>
                </div>
                </div>
        </div>
    </div>
    `;

    // 4. Inyectar en el HTML
    container.innerHTML = newsHTML;
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    loadLatestNews();
});