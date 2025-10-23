document.addEventListener('DOMContentLoaded', () => {
  setupInputErrorListeners();
});

function setupInputErrorListeners() {
  const campos = [
    'title', 'description', 'status'
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

document.getElementById('payment-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Limpiar errores previos
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(el => el.remove());

    // Aquí puedes poner una función de validación personalizada si quieres
    const isValid = validarFormulario();
    if (!isValid) return;

    const token = localStorage.getItem('auth_token');

    // Preparar datos para enviar como FormData (incluye archivos)
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('status', document.getElementById('status').value);

    try {
        const response = await fetch('http://localhost:8089/api/lists', {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: formData
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Tarea registrada con éxito!',
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
    { id: 'title', name: 'title' },
    { id: 'description', name: 'description' },
    { id: 'status', name: 'status' }
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