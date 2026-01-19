import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy } 
    from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBEQ8P33QMRCJFwzMZipgYnQRSf3lng-FE",
    authDomain: "whiteboard-8aa6b.firebaseapp.com",
    projectId: "whiteboard-8aa6b",
    storageBucket: "whiteboard-8aa6b.firebasestorage.app",
    messagingSenderId: "15693020306",
    appId: "1:15693020306:web:79aa547f6f8b34538bba4b"
};
//SUPABASE INICIALIZACION
//FIREBASE INICIALIZACION
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const notesCollection = collection(db, "post-its");

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
            <i class="fas fa-times delete-note" onclick="window.deletePostIt('${id}')"></i>
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