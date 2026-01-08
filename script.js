// Importar funciones SDK de Firebase v9
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy } 
       from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// --- 1. CONFIGURACIÓN DE FIREBASE (¡REEMPLAZA ESTO!) ---
const firebaseConfig = {
    apiKey: "AIzaSyBEQ8P33QMRCJFwzMZipgYnQRSf3lng-FE",
    authDomain: "whiteboard-8aa6b.firebaseapp.com",
    projectId: "whiteboard-8aa6b",
    storageBucket: "whiteboard-8aa6b.firebasestorage.app",
    messagingSenderId: "15693020306",
    appId: "1:15693020306:web:79aa547f6f8b34538bba4b"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const notesCollection = collection(db, "post-its");

// --- 2. LÓGICA DE CALENDARIO (Frontend estático) ---
const calendarEvents = {
    1: [{ type: 'text', content: 'Día de <br>Año Nuevo<br><span class="evt-asueto">Asueto</span>' }],
    6: [{ type: 'flag', color: 'bg-green', text: 'Día de<br>Reyes' }],
    11: [{ type: 'bday', name: 'Alberto<br>Perez' }],
    13: [{ type: 'anniv', years: 2, name: 'Daniel<br>Alvarado' }, { type: 'flag', color: 'bg-yellow', text: 'Día Lucha<br>Depresión' }, { type: 'bday', name: 'Carlos<br>Perez' }],
    16: [{ type: 'anniv', years: 2, name: 'Eloy<br>Silva' }],
    18: [{ type: 'anniv', years: 4, name: 'Carlos<br>Perez' }, { type: 'anniv', years: 1, name: 'Brandon<br>Izurieta' }],
    24: [{ type: 'flag', color: 'bg-yellow', text: 'Día de la<br>Educación' }],
    25: [{ type: 'anniv', years: 1, name: 'Gilberto<br>Hernández' }],
    27: [{ type: 'anniv', years: 2, name: 'Alexis<br>Gutiérrez' }],
    29: [{ type: 'anniv', years: 4, name: 'Estefania<br>Casian' }]
};

function renderExactCalendar() {
    const grid = document.getElementById('calendar-body');
    let html = '';
    const prevDays = [28, 29, 30, 31]; // Dic 2025
    prevDays.forEach(d => html += `<div class="cal-cell"><span class="day-num day-prev-month">${d}</span></div>`);

    for (let i = 1; i <= 31; i++) {
        let eventsHtml = '';
        if (calendarEvents[i]) {
            eventsHtml += '<div class="event-container">';
            calendarEvents[i].forEach(evt => {
                if (evt.type === 'text') eventsHtml += `<div style="font-size:0.8rem; font-weight:600;">${evt.content}</div>`;
                else if (evt.type === 'flag') eventsHtml += `<div class="evt-flag"><div class="flag-box ${evt.color}"></div><div>${evt.text}</div></div>`;
                else if (evt.type === 'bday') eventsHtml += `<div class="evt-bday"><i class="fas fa-birthday-cake cake-icon"></i><span>${evt.name}</span></div>`;
                else if (evt.type === 'anniv') eventsHtml += `<div class="evt-anniv"><div class="star-wrapper"><i class="fas fa-star fa-lg"></i><span class="star-num">${evt.years}</span></div><span>${evt.name}</span></div>`;
            });
            eventsHtml += '</div>';
        }
        html += `<div class="cal-cell"><span class="day-num" style="font-weight:${eventsHtml?'bold':'normal'}">${i}</span>${eventsHtml}</div>`;
    }
    for(let j=1; j<=7; j++) html += `<div class="cal-cell"><span class="day-num day-prev-month">${j}</span></div>`;
    grid.innerHTML = html;
}

// --- 3. LÓGICA DE PIZARRÓN (Conectado a Firebase) ---
const modal = document.getElementById("noteModal");
const board = document.getElementById("board");

// Suscripción en Tiempo Real (READ)
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

// --- EXPORTAR FUNCIONES AL ÁMBITO GLOBAL (WINDOW) ---
// Esto es necesario porque type="module" aísla las funciones del HTML onclick

window.openModal = () => {
    modal.style.display = "flex";
    document.getElementById("newNoteText").focus();
};

window.closeModal = () => {
    modal.style.display = "none";
    document.getElementById("newNoteText").value = "";
};

window.addPostIt = async () => {
    const text = document.getElementById("newNoteText").value;
    if (!text.trim()) return;

    const colors = ['#fef3c7', '#bae6fd', '#bbf7d0', '#fbcfe8'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomRotate = Math.floor(Math.random() * 6) - 3;

    try {
        await addDoc(notesCollection, {
            text: text,
            color: randomColor,
            rotation: randomRotate,
            createdAt: Date.now()
        });
        window.closeModal();
    } catch (e) {
        console.error("Error al guardar: ", e);
        alert("Error al guardar. Revisa la consola.");
    }
};

window.deleteNote = async (id) => {
    if(confirm("¿Borrar esta nota?")) {
        try {
            await deleteDoc(doc(db, "post-its", id));
        } catch (e) {
            console.error("Error al borrar: ", e);
        }
    }
};

// Cerrar modal al clickear fuera
window.onclick = (e) => { if (e.target == modal) window.closeModal(); };

// Inicializar calendario
renderExactCalendar();