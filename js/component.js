document.addEventListener("DOMContentLoaded", () => {


    //HTML A INSERTAR
    const headerHTML = `
    <header class="main-header">
        <div class="container-limit">
            <a href="index.html" class="brand" title="Volver al Inicio">
                <img src="img/mini_logo_gp.png" alt="GP Mobility Logo"> 
            </a>
            <nav style="display: flex; background-color: red;">

            </nav>
            <nav class="header-nav">
                <a href="index.html" class="nav-link">Inicio</a>
                <span class="nav-separator">|</span>
                
                <a href="nuestra_esencia.html" class="nav-link">Nuestra Esencia</a>
                <span class="nav-separator">|</span>
                
                <a href="cultura_talento.html" class="nav-link">Somos Cultura, Somos Talento</a>
                <span class="nav-separator">|</span>
                
                <a href="juntos_movemos_vidas.html" class="nav-link">Juntos Movemos Vidas</a>
                <span class="nav-separator">|</span>
                
                <a href="caja_de_ahorros.html" class="nav-link">Caja de Ahorros</a>
                <span class="nav-separator">|</span>
                
                <a href="vacantes.html" class="nav-link">Vacantes</a>
                
            </nav>

            <button class="mobile-menu-button" id="mobile-menu-button" aria-label="Abrir menú">
                <i class="fas fa-bars"></i>
            </button>

            <div class="mobile-menu" id="mobile-menu">
                <div class="mobile-menu-content">
                    
                    <button class="close-menu-button" id="close-menu-button">&times;</button>
                    
                    <nav class="mobile-nav-list">
                        <a href="index.html" class="mobile-link">Inicio</a>
                        <a href="nuestra_esencia.html" class="mobile-link">Nuestra Esencia</a>
                        <a href="cultura_talento.html" class="mobile-link">Somos Cultura, Somos Talento</a>
                        <a href="juntos_movemos_vidas.html" class="mobile-link">Juntos Movemos Vidas</a>
                        <a href="caja_de_ahorros.html" class="mobile-link">Caja de Ahorros</a>
                        <a href="vacantes.html" class="mobile-link">Vacantes</a>
                    </nav>
                </div>
            </div>

            </div>

    </header>
    `;

    const footerHTML = `
    <footer class="main-footer">
        <div class="container-limit" style="align-items: start">
            <div>
                <h2>GP Mobility</h2>
            </div>
            <div>
                <h3>Oficina</h3>
                <p>Av. Ignacio L Vallarta <br/> 6218, Jocotán, Zapopan</p>
                <p>Jalisco, 45017</p>
            </div>
            <div>
                <h3>Redes</h3>
                <p><i class="fab fa-facebook-square"></i> GP Mobility</p>
                <p><i class="fab fa-instagram"></i> gp_mobility</p>
                <p><i class="fab fa-linkedin"></i> GP AUTOSERVICES</p>
                <p><i class="fab fa-tiktok"></i> gp.mobility</p>
            </div>
        </div>
        <div style="margin-top: 10px; padding-top: 20px; text-align: center;">
            <p style="color: #001f3f; font-size: 0.9em;">© 2026 GP Mobility</p>
        </div>
    </footer>
    `;

    document.body.insertAdjacentHTML("afterbegin", headerHTML);

    document.body.insertAdjacentHTML("beforeend", footerHTML);


        const menuButton = document.getElementById('mobile-menu-button');
    const closeButton = document.getElementById('close-menu-button');
    const menuOverlay = document.getElementById('mobile-menu');


    if (menuButton) {
        menuButton.addEventListener('click', () => {
            menuOverlay.classList.add('active');
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
        });
    }

    const mobileLinks = document.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
        });
    });
});

