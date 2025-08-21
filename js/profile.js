document.addEventListener('DOMContentLoaded', () => {
  getUser();
});

async function getUser() {
  const token = localStorage.getItem('auth_token');

  try {
    const response = await fetch('http://practice.test/api/users/show', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      // Asumiendo que data.data tiene las propiedades que quieres mostrar
      document.getElementById('perfil-fraccionamiento').textContent = data.data.place.name || '';
      document.getElementById('perfil-nombre').textContent = data.data.name || '';
      document.getElementById('perfil-telefono').textContent = data.data.phone || '';
      document.getElementById('perfil-lote').textContent = data.data.lot || '';
      document.getElementById('perfil-manzana').textContent = data.data.block || '';
      document.getElementById('perfil-email').textContent = data.data.email || '';
    } else {
      console.error('Error inesperado', response.status);
    }
  } catch (error) {
    console.error('Error validando token:', error);
  }
}

