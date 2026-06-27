// Manejo global de usuarios

document.addEventListener('DOMContentLoaded', () => {
    actualizarHeader();
    cargarDatosPerfil();
    inicializarLogout();
});

// Función de utilidad para resolver rutas relativas al root
window.resolvePath = function(path) {
    if (path.startsWith('http') || path.startsWith('/') || path.startsWith('#')) return path;
    
    const isPagesDir = window.location.pathname.includes('/pages/');
    
    if (isPagesDir) {
        return '../' + path;
    } else {
        return path;
    }
};

// 1. Función que se ejecuta en TODAS las páginas para actualizar el menú
function actualizarHeader() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Buscamos el enlace del menú. 
    const userLink = document.getElementById('user-link'); 
    
    // También intentamos buscarlo por su ubicación si no tiene ID 
    const userLinkFallback = document.querySelector('.user-options a');
    
    const linkToUpdate = userLink || userLinkFallback;

    if (currentUser && linkToUpdate) {
        linkToUpdate.textContent = `Hola, ${currentUser.name}`;
        linkToUpdate.href = window.resolvePath("pages/Perfil.html"); // Ahora lleva al perfil
        linkToUpdate.style.fontWeight = "bold";
        linkToUpdate.style.color = "#FFD700"; 
    }
}

// 2. Función específica para la pagina PERFIL.HTML
function cargarDatosPerfil() {
    // Buscamos si existe el elemento específico del nombre en el perfil
    const profileName = document.getElementById('profile-name');
    
    // Si existe 'profileName', significa que estamos en la página de Perfil
    if (profileName) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (!currentUser) {
            // Si intenta entrar al perfil sin estar logueado, lo mandamos al login
            window.location.href = window.resolvePath('pages/Cuenta y Pedidos.html');
            return;
        }

        // Llenamos los datos
        document.getElementById('welcome-title').textContent = `Hola, ${currentUser.name}`;
        profileName.textContent = currentUser.name;
        
        const profileEmail = document.getElementById('profile-email');
        if(profileEmail) profileEmail.textContent = currentUser.email;
    }
}

// 3. Función para el botón de cerrar sesion
function inicializarLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            const confirmLogout = confirm('¿Estás seguro que deseas cerrar sesión?');
            if (confirmLogout) {
                localStorage.removeItem('currentUser');
                
                // Redirigir al index o recargar
                window.location.href = window.resolvePath('index.html');
            }
        });
    }
}