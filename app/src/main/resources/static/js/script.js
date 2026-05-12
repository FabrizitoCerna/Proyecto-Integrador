// Funciones princ

// Mensaje de confirmación antes de rechazar
function confirmarRechazo(antecedenteId) {
    return confirm('¿Estás seguro de que deseas rechazar este antecedente?');
}

// Mensaje de confirmación antes de verificar
function confirmarVerificacion(antecedenteId) {
    return confirm('¿Estás seguro de que deseas verificar este antecedente?');
}

// Mensaje de confirmación para logout
function confirmarLogout() {
    return confirm('¿Deseas cerrar la sesión?');
}

// Validar formulario de login
function validarLoginForm() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    
    if (!email.value || !password.value) {
        alert('Por favor completa todos los campos');
        return false;
    }
    
    if (!email.value.includes('@')) {
        alert('Por favor ingresa un email válido');
        return false;
    }
    
    return true;
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'success') {
    const div = document.createElement('div');
    div.className = `alert alert-${tipo}`;
    div.textContent = mensaje;
    div.style.position = 'fixed';
    div.style.top = '20px';
    div.style.right = '20px';
    div.style.zIndex = '9999';
    div.style.maxWidth = '400px';
    
    document.body.appendChild(div);
    
    setTimeout(() => {
        div.remove();
    }, 4000);
}

// Cargar datos dinámicamente
function actualizarDatos() {
    location.reload();
}

// Inicializar eventos cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Agregar evento a formularios si es necesario
    const loginForm = document.querySelector('form');
    if (loginForm && loginForm.action.includes('/admin/login')) {
        loginForm.onsubmit = validarLoginForm;
    }
});