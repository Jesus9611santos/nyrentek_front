document.addEventListener('DOMContentLoaded', () => {
  setupInputErrorListeners();
});

function setupInputErrorListeners() {
  const campos = [
    'email'
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

document.getElementById('recovery-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  // Limpiar errores previos
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach(el => el.remove());

    // Validar formulario
  const isValid = validarFormulario();
  if (!isValid) return; // Si hay errores no continuar

  // Preparar datos para enviar
  const formData = {
    email: document.getElementById('email').value
  };

  try {
    const response = await fetch('http://localhost:8089/api/users/recovery', {
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
      Swal.fire({
            icon: 'success',
            title: '¡Te hemos mandado un correo!',
            confirmButtonColor: '#28a745'
        }).then(() => {
            window.location.href = "/index.html";
        });

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
    { id: 'email', name: 'Email' }
  ];

  // Validar campos vacíos
  campos.forEach(({id, name}) => {
    const input = document.getElementById(id);
    if (!input.value.trim()) {
      mostrarError(input, `El campo ${name} es obligatorio`);
      isValid = false;
    }
  });

  // Validar email
  const emailInput = document.getElementById('email');
  const emailVal = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailVal && !emailRegex.test(emailVal)) {
    mostrarError(emailInput, 'El email no es válido');
    isValid = false;
  }

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