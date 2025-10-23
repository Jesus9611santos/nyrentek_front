checkToken();

function registrarse() {
    window.location.href = "/register.html";
}

function recuperarContrasena() {
    window.location.href = "/recovery.html";
}

function back() {
    window.location.href = "/index.html";
}


async function checkToken() {
    document.body.classList.add('loading');
  const token = localStorage.getItem('auth_token');
  if (!token) {
    document.body.classList.add('loaded'); // muestra contenido si no hay token
    return;
  }

  try {
    const response = await fetch('http://localhost:8089/api/users/check', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    if (response.ok) {
      window.location.href = '/home.html';
    } else {
      localStorage.removeItem('auth_token');
      document.body.classList.add('loaded');
    }
  } catch (error) {
    localStorage.removeItem('auth_token');
    document.body.classList.add('loaded');
  }
}
