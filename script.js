import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy } 
    from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const firebaseConfig = {
    apiKey: "AIzaSyBEQ8P33QMRCJFwzMZipgYnQRSf3lng-FE",
    authDomain: "whiteboard-8aa6b.firebaseapp.com",
    projectId: "whiteboard-8aa6b",
    storageBucket: "whiteboard-8aa6b.firebasestorage.app",
    messagingSenderId: "15693020306",
    appId: "1:15693020306:web:79aa547f6f8b34538bba4b"
};
//SUPABASE INICIALIZACION
const SUPABASE_URL = 'https://oovzygalahromrinjffl.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vdnp5Z2FsYWhyb21yaW5qZmZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MzQwMzgsImV4cCI6MjA3OTIxMDAzOH0.crTTU0mxDvGJ2n2_MrQ43BTSBseYRbh7P5Prh5T98Wg';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
//FIREBASE INICIALIZACION
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const notesCollection = collection(db, "post-its");

// CALENDARIO
const calendarEvents = {
    1: {1: [{ type: 'text', content: 'Día de <br>Año Nuevo<br><span class="evt-asueto">Asueto</span>' }]},
    2: {14: [{ type: 'flag', color: 'red', text: 'Día de<br>San Valentín' }]},
    3: {8: [{ type: 'flag', color: 'pink', text: 'Día Internacional<br>de la Mujer' }]},
    4: {22: [{ type: 'flag', color: 'green', text: 'Día de la<br>Tierra' }]},
    5: {1: [{ type: 'text', content: 'Día del<br>Trabajador<br><span class="evt-asueto">Asueto</span>' }],
        10: [{ type: 'flag', color: 'purple', text: 'Día de la<br>Mamá' }]},
};

async function loadAndRenderCalendar() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const monthNames =['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    document.querySelector('.cal-month').innerText = monthNames[currentMonth];
    document.querySelector('.cal-year').innerText = currentYear;

    // CARGA FECHAS DE USUARIOS DE SUPABASE
    const {data, error} = await supabase
        .from('usuarios')
        .select('id,"NOMBRE COMPLETO", FECHA_NACIMIENTO, FECHA_INGRESO, ACTIVO');

    if(error){
        console.error("Error: ", error);
        return;
    }
    console.log("Datos de usuarios cargados: ", data);
    const monthEvents = {};
    const feriadosPerMonth = calendarEvents[currentMonth + 1] || [];
    if(feriadosPerMonth){
        Object.assign(monthEvents, feriadosPerMonth);
    }

    if(data){
        data.forEach(user => {
            //CUMPLEAÑOS
            const birthDate = new Date(user.FECHA_NACIMIENTO + 'T12:00:00');
            const joinDate = new Date(user.FECHA_INGRESO + 'T12:00:00');
            if(birthDate.getMonth() === currentMonth){
                const day = birthDate.getDate();
                if(!monthEvents[day]) monthEvents[day] = [];

                //formatear nombre
                const nameParts = user['NOMBRE COMPLETO'].trim().split(/\s+/);
                const paternalSurname = nameParts[0];
              //const maternalSurname = nameParts[1];
                const stackName = nameParts.slice(2).join(' ');
                const titleCase = (str) => str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
                const formattedName = `${titleCase(stackName)}<br>${titleCase(paternalSurname)}`;

                monthEvents[day].push({ type: 'birthday', name: formattedName});

            }
            //ANIVERSARIOS
            if(joinDate.getMonth() === currentMonth){
                const day = joinDate.getDate();
                if(!monthEvents[day]) monthEvents[day] = [];

                const years = currentYear - joinDate.getFullYear();
                //formatear nombre
                const nameParts = user['NOMBRE COMPLETO'].trim().split('/\s+/');
                const paternalSurname = nameParts[0];
              //const maternalSurname = nameParts[1];
                const stackName = nameParts.slice(2).join(' ');
                const titleCase = (str) => str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
                const formattedName = `${titleCase(stackName)}<br>${titleCase(paternalSurname)}`;

                monthEvents[day].push({ type: 'anniversary', name: formattedName, years: years});
            }

        });
    }
    renderDynamicCalendar(currentYear, currentMonth, monthEvents);
}

function renderDynamicCalendar(year, month, events) {
    const grid = document.getElementById('calendar-body');
    let html = '';
    
    //CALCULO DE FECHAS
    //Dias de la semana del primer dia del mes
    const firstDayWeek = new Date(year, month, 1).getDay(); //0 = domingo, 1 = lunes, ..., 6 = sabado
    //Dias totales del mes actual
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    //Total de días del mes anterior
    const daysInPreviousMonth = new Date(year, month, 0).getDate();

    //DIAS GRISES DE MES PREVIO
    for(let i = firstDayWeek -1; i >= 0; i--) {
        const prevDay = daysInPreviousMonth - i + 1;
        html += `<div class="cal-cell"><span class="day-num day-prev-month">${prevDay}</span></div>`;
    }

    //DIAS DEL MES ACTUAL
    for (let i = 1; i <= daysInCurrentMonth; i++) {
        let eventHTML = '';
        if (events[i]){
            eventHTML += '<div class="event-container">';

            events[i].forEach(evt => {
                if (evt.type === 'text') {
                    eventHTML += `<div style="font-size:0.8rem; font-weight:600;">${evt.content}</div>`;
                } else if (evt.type === 'flag') {
                    eventHTML += `<div class="evt-flag"><div class="flag-box ${evt.color}"></div><div>${evt.text}</div></div>`;
                } else if (evt.type === 'birthday') {
                    eventHTML += `<div class="evt-birthday"><i class="fas fa-birthday-cake cake-icon"></i><span>${evt.name}</span></div>`;
                } else if (evt.type === 'anniversary') {
                    eventHTML += `<div class="evt-anniversary"><div class="star-wrapper"><i class="fas fa-star fa-lg"></i><span class="star-num">${evt.years}</span></div><span>${evt.name}</span></div>`;
                }
            });
            eventHTML += '</div>';
        }

        html += '<div class="cal-cell"><span class="day-num" style="font-weight:' + (eventHTML ? 'bold' : 'normal') + '">' + i + '</span>' + eventHTML + '</div>';
    }

    //DIAS GRISES DEL PROXIMO MES
    const totalCells = firstDayWeek + daysInCurrentMonth;
    const nextDays = totalCells%7 === 0 ? 0 : 7 - (totalCells%7);

    for(let j = 1; j <= nextDays; j++){
        html += `<div class="cal-cell"><span class="day-num day-prev-month">${j}</span></div>`;
    }

    grid.innerHTML = html;
}

// PIZARRON
const modal = document.getElementById("noteModal");
const board = document.getElementById("board");

//SUSCRIPCION EN TIEMPO REAL A FIREBASE
const q = query(notesCollection, orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
    board.innerHTML = ""; // Limpiar tablero
    
    if (snapshot.empty) {
        board.innerHTML = '<p style="color:#9ca3af; grid-column: 1/-1;">No hay notas aún. ¡Agrega una!</p>';
        return;
    }

    snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const id = docSnap.id;
        
        const postIt = document.createElement("div");
        postIt.className = "post-it";
        postIt.style.backgroundColor = data.color;
        postIt.style.transform = `rotate(${data.rotation}deg)`;
        
        // El icono de borrar llama a window.deleteNote
        postIt.innerHTML = `
            <i class="fas fa-times delete-note" onclick="window.deleteNote('${id}')"></i>
            <div class="post-it-content">${data.text}</div>
        `;
        board.appendChild(postIt);
    });
});

//MODAL
window.openModal = () => {
    modal.style.display = 'flex';
    document.getElementById('newNote').focus();
}

window.closeModal = () => {
    modal.style.display = 'none';
    document.getElementById('newNote').value = '';
}

// Cerrar modal al clickear fuera
window.onclick = (e) => { if (e.target == modal) window.closeModal(); };

//POST ITS (NOTAS)
window.addPostIt = async () => {
    const text = document.getElementById("newNote").value;
    if (!text.trim()) return;
    const colors = ['#fef3c7', '#bae6fd', '#bbf7d0', '#fbcfe8', '#ffd6a5', '#ffbfbfff']; //colores pasteles
    const randomColor = colors[Math.floor(Math.random() * colors.length)]; //color aleatorio floor redondea haci abajo, aleatorio * longitud de numero de colores
    const randomRotate = Math.floor(Math.random() * colors.length) - colors.length / 2; //rotacion para no repetirse mucho
    try{
        await addDoc(notesCollection, {
            text: text,
            color: randomColor,
            rotation: 0,
            createdAt: Date.now()
        });
        window.closeModal();
    }catch(e){
        console.error("Error al guardar: ", e);
        alert("Error: Revisa la consola.");
    }
};

window.deletePostIt = async (id) => {
    if(confirm("¿Eliminar esta nota?"))
    {
        try{
            await deleteDoc(doc(db, "post-its", id));
        }catch(e){
            console.error("Error al eliminar: ", e);
        }
    }
};

//INICIALIZACION
loadAndRenderCalendar();