checkToken();

async function checkToken() {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    window.location.href = '/index.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:8089/api/users/check', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    console.log('Response status:', response.status);

    if (response.ok) {
      document.body.classList.add('loaded');
    } else if (response.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('auth_token');
      window.location.href = '/index.html';
    } else {
      // Otros errores, puedes manejar diferente o no borrar token todavía
      console.error('Error inesperado', response.status);
    }
  } catch (error) {
    console.error('Error validando token:', error);
    // Opcional: no borrar token aquí si quieres intentar de nuevo luego
  }
}

async function closeSession() {
  const token = localStorage.getItem('auth_token');
    try {
      await fetch('http://localhost:8089/api/users/logout', {
        method: 'POST',  // Recuerda que logout suele ser POST
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });
      checkToken();
    } catch (error) {
      console.error('Error validando token:', error);
      // Opcional: no borrar token aquí si quieres intentar de nuevo luego
   }
}

function profile() {
    window.location.href = "/profile.html";
}

function newPayment(){
  window.location.href = "/new.html";
}

function back() {
    window.location.href = "/home.html";
}