const API_URL = 'http://localhost:5000/api';

// Manejo de vistas
const registerView = document.getElementById('register-view');
const loginView = document.getElementById('login-view');
const protectedView = document.getElementById('protected-view');

document.getElementById('go-login').addEventListener('click', () => {
    toggleView(loginView);
});
document.getElementById('go-register').addEventListener('click', () => {
    toggleView(registerView);
});

// Función para alternar las vistas
function toggleView(viewToShow) {
    registerView.classList.add('hidden');
    loginView.classList.add('hidden');
    protectedView.classList.add('hidden');
    viewToShow.classList.remove('hidden');
}

// Manejo de registro de usuario
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username-register').value;
    const email = document.getElementById('email-register').value;
    const password = document.getElementById('password-register').value;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (!response.ok) {
            alert(data.message || 'Error al registrar usuario');
        } else {
            alert('Usuario registrado exitosamente');
            toggleView(loginView);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error en el servidor');
    }
});

// Manejo de inicio de sesión
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username-login').value;
    const password = document.getElementById('password-login').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (!response.ok) {
            alert(data.message || 'Error al iniciar sesión');
        } else {
            alert('Inicio de sesión exitoso');
            localStorage.setItem('token', data.token);
            toggleView(protectedView);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error en el servidor');
    }
});

// Acceso a recurso protegido
document.getElementById('protectedButton').addEventListener('click', async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/protected-resource`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (!response.ok) {
            alert(data.message || 'No tienes acceso al recurso');
        } else {
            document.getElementById('protectedMessage').innerText = data.message;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al acceder al recurso protegido');
    }
});

// Cerrar sesión
document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token');
    alert('Sesión cerrada');
    toggleView(loginView);
});

// Mostrar la vista de registro inicialmente
toggleView(registerView);
