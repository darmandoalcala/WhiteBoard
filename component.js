document.addEventListener("DOMContentLoaded", () => {
    
    // HTML basado en tu imagen de referencia (Header Azul Oscuro)
    const headerHTML = `
    <header class="main-header">
        
        <a href="index.html" class="brand" title="Volver al Inicio">
            <img src="img/mini_logo_gp.png" alt="GP Mobility Logo"> 
        </a>
        
        <nav class="header-nav">
            <a href="index.html" class="nav-link">Inicio</a>
            <span class="nav-separator">|</span>
            
            <a href="#" class="nav-link">Nuestra Esencia</a>
            <span class="nav-separator">|</span>
            
            <a href="#" class="nav-link">Somos Cultura, Somos Talento</a>
            <span class="nav-separator">|</span>
            
            <a href="#" class="nav-link">Juntos Movemos Vidas</a>
        </nav>

        <div></div> <!-- Espacio para alinear a la derecha -->

    </header>
    `;

    document.body.insertAdjacentHTML("afterbegin", headerHTML);
});