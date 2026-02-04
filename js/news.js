import { supabase } from './supabaseClient.js';

function injectModalHTML() {
    if (!document.getElementById('news-modal')) {
        const modalHTML = `
        <div class="news-modal-overlay" id="news-modal">
            <div class="news-modal-content">
                <button class="close-modal-btn" id="close-news-modal">&times;</button>
                
                <img src="" alt="Noticia" class="modal-hero-img" id="modal-img">
                
                <div class="modal-body-content">
                    <div class="modal-meta">
                        <span id="modal-date"></span>
                        <span id="modal-author"></span>
                    </div>
                    <h2 class="modal-title" id="modal-title"></h2>
                    <div class="modal-text" id="modal-text"></div>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById('news-modal');
        const closeBtn = document.getElementById('close-news-modal');
        
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto'; 
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

function openNewsModal(item, dateFormatted) {
    const modal = document.getElementById('news-modal');
    
    document.getElementById('modal-img').src = item.IMAGEN_URL || 'assets/vision.png';
    document.getElementById('modal-date').innerText = dateFormatted;
    document.getElementById('modal-author').innerHTML = `<i class="fas fa-user"></i> ${item.autor || 'GP Mobility'}`;
    document.getElementById('modal-title').innerText = item.titulo;
    
    document.getElementById('modal-text').innerText = item.contenido; 

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

async function loadLatestNews() {
    injectModalHTML();

    const container = document.getElementById('latest-news-container');
    const { data: news, error } = await supabase
        .from('noticias')
        .select('*')
        .order('FECHA', { ascending: false })
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

    const item = news[0];
    
    const dateObj = new Date(item.FECHA + "T12:00:00"); 
    const dateFormatted = new Intl.DateTimeFormat('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(dateObj);

    const newsHTML = `
    <div class="news-card" id="latest-news-card">
        
        <div class="news-image-col">
            <img src="${item.IMAGEN_URL}" alt="${item.TITULO}" class="news-img" 
                onerror="this.src='assets/img_calendar.jpeg'"> 
        </div>

        <div class="news-content-col">
            
            <div class="news-meta-header">
                <div class="author-avatar-circle">
                    <i class="fas fa-user"></i>
                </div>
                <div class="meta-text">
                    <span class="author-name">${item.AUTOR || 'GP Mobility'}</span>
                    <span class="meta-date">${dateFormatted} · ${item.minutos_lectura || 1} Min. de lectura</span>
                </div>
                <div class="meta-options"><i class="fas fa-ellipsis-v"></i></div>
            </div>

            <h3 class="news-title">${item.TITULO}</h3>
            <p class="news-excerpt">
                ${item.CONTENIDO.substring(0, 200)}...
                <span style="color: var(--primary); font-weight: bold; font-size: 0.9em;">(Leer más)</span>
            </p>

            <div class="news-footer">
                <div class="news-stats">
                    <span>${item.VISTAS || 0} visualizaciones</span>
                    <span>${item.LIKES || 0} <i class="fas fa-heart" style="color: #e11d48;"></i></span>
                </div>
            </div>
        </div>
    </div>
    `;

    container.innerHTML = newsHTML;

    const cardElement = document.getElementById('latest-news-card');
    cardElement.addEventListener('click', () => {
        openNewsModal(item, dateFormatted);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadLatestNews();
});