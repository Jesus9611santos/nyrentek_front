document.addEventListener('DOMContentLoaded', () => {
  getPlaces();
  setupInputErrorListeners();
});

async function getPlaces() {
  try {
    const response = await fetch('http://practice.test/api/places');
    if (!response.ok) throw new Error('Error en la respuesta');

    const data = await response.json();

    const select = document.getElementById('fraccionamiento');

    // Limpiar opciones previas excepto la primera
    select.innerHTML = '<option value="" disabled selected>Selecciona un fraccionamiento</option>';

    data.forEach(place => {
      const option = document.createElement('option');
      option.value = place.id;
      option.textContent = place.name;
      select.appendChild(option);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

document.getElementById('register-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  // Limpiar errores previos
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach(el => el.remove());

    // Validar formulario
  const isValid = validarFormulario();
  if (!isValid) return; // Si hay errores no continuar

  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('password_confirmation').value;

  // Preparar datos para enviar
  const formData = {
    fraccionamiento: document.getElementById('fraccionamiento').value,
    nombre: document.getElementById('nombre').value,
    telefono: document.getElementById('telefono').value,
    lote: document.getElementById('lote').value,
    manzana: document.getElementById('manzana').value,
    email: document.getElementById('email').value,
    password: password,
    password_confirmation: confirmPassword,
  };

  try {
    const response = await fetch('http://practice.test/api/users', {
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
            title: '¡Registro exitoso!',
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

function setupInputErrorListeners() {
  const campos = [
    'fraccionamiento', 'nombre', 'telefono', 'lote',
    'manzana', 'email', 'password', 'password_confirmation'
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

function validarFormulario() {
  let isValid = true;

  const campos = [
    { id: 'fraccionamiento', name: 'Fraccionamiento' },
    { id: 'nombre', name: 'Nombre' },
    { id: 'telefono', name: 'Teléfono' },
    { id: 'lote', name: 'Lote' },
    { id: 'manzana', name: 'Manzana' },
    { id: 'email', name: 'Email' },
    { id: 'password', name: 'Contraseña' },
    { id: 'password_confirmation', name: 'Confirmar contraseña' }
  ];

  // Validar campos vacíos
  campos.forEach(({id, name}) => {
    const input = document.getElementById(id);
    if (!input.value.trim()) {
      mostrarError(input, `El campo ${name} es obligatorio`);
      isValid = false;
    }
  });

  // Validar teléfono: solo números y exactamente 10 dígitos
  const telefonoInput = document.getElementById('telefono');
  const telefonoVal = telefonoInput.value.trim();
  const telefonoRegex = /^\d{10}$/;
  if (telefonoVal && !telefonoRegex.test(telefonoVal)) {
    mostrarError(telefonoInput, 'El teléfono debe tener 10 dígitos numéricos');
    isValid = false;
  }

  // Validar lote: solo números (si quieres letras dime)
  const loteInput = document.getElementById('lote');
  const loteVal = loteInput.value.trim();
  const loteRegex = /^\d+$/; // solo números
  if (loteVal && !loteRegex.test(loteVal)) {
    mostrarError(loteInput, 'El lote solo debe contener números');
    isValid = false;
  }

  // Validar email
  const emailInput = document.getElementById('email');
  const emailVal = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailVal && !emailRegex.test(emailVal)) {
    mostrarError(emailInput, 'El email no es válido');
    isValid = false;
  }

  // Validar contraseñas coincidan
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('password_confirmation').value;

    // Regex para validar:
    // - al menos 8 caracteres
    // - al menos una mayúscula
    // - al menos una minúscula
    // - al menos un número
    // - al menos un caracter especial
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (password && !passwordRegex.test(password)) {
        mostrarError(document.getElementById('password'), 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial');
        isValid = false;
    }

  if (password && confirmPassword && password !== confirmPassword) {
        mostrarError(document.getElementById('password_confirmation'), 'Las contraseñas no coinciden');
        isValid = false;
  }

  return isValid;
}