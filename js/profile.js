document.addEventListener('DOMContentLoaded', () => {
  getUser();
});

async function getUser() {
  const token = localStorage.getItem('auth_token');

  try {
    const response = await fetch('http://localhost:8089/api/users/show', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      // Asumiendo que data.data tiene las propiedades que quieres mostrar
      document.getElementById('perfil-nombre').textContent = data.data.name || '';
      document.getElementById('perfil-telefono').textContent = data.data.phone || '';
      document.getElementById('perfil-email').textContent = data.data.email || '';
    } else {
      console.error('Error inesperado', response.status);
    }
  } catch (error) {
    console.error('Error validando token:', error);
  }
}

