document.addEventListener('DOMContentLoaded', () => {
  setupInputErrorListeners();
});

function setupInputErrorListeners() {
  const campos = [
    'email', 'password'
  ];

  campos.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      const evento = input.tagName.toLowerCase() === 'select' ? 'change' : 'input';
      input.addEventListener(evento, () => {
        quitarError(input);
      });
    }
  });
}

function quitarError(input) {
  const contenedor = input.parentNode;
  const errorExistente = contenedor.nextElementSibling;
  if (errorExistente && errorExistente.classList.contains('error-message')) {
    errorExistente.remove();
  }
}

document.getElementById('login-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  // Limpiar errores previos
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach(el => el.remove());

    // Validar formulario
  const isValid = validarFormulario();
  if (!isValid) return; // Si hay errores no continuar

  const password = document.getElementById('password').value;

  // Preparar datos para enviar
  const formData = {
    email: document.getElementById('email').value,
    password: password
  };

  try {
    const response = await fetch('http://practice.test/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
        localStorage.setItem('auth_token', data.token);
        window.location.href = "/home.html";
    } else {
      // Mostrar errores del backend (si vienen en data.errors)
      let mensaje = data.message || 'Algo salió mal';
      if (data.errors) {
        mensaje = Object.values(data.errors).flat().join('\n');
      }
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensaje,
        confirmButtonColor: '#d33'
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error en la conexión',
      confirmButtonColor: '#d33'
    });
    console.error(error);
  }
});


function validarFormulario() {
  let isValid = true;

  const campos = [
    { id: 'email', name: 'Email' },
    { id: 'password', name: 'Contraseña' }
  ];

  // Validar campos vacíos
  campos.forEach(({id, name}) => {
    const input = document.getElementById(id);
    if (!input.value.trim()) {
      mostrarError(input, `El campo ${name} es obligatorio`);
      isValid = false;
    }
  });

  return isValid;
}

function mostrarError(input, mensaje) {
  const contenedor = input.parentNode;
  const errorExistente = contenedor.nextElementSibling;
  if (errorExistente && errorExistente.classList.contains('error-message')) {
    errorExistente.remove();
  }

  const error = document.createElement('div');
  error.className = 'error-message';
  error.style.color = 'red';
  error.style.fontSize = '0.9em';
  error.style.marginTop = '4px';
  error.style.textAlign = 'left';
  error.style.marginLeft = '25px';
  error.textContent = mensaje;

  contenedor.insertAdjacentElement('afterend', error);
}