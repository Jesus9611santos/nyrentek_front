document.addEventListener('DOMContentLoaded', () => {
  setupInputErrorListeners();

  const paymentId = getPaymentIdFromUrl();
  if (paymentId) {
    cargarPago(paymentId);
  }
});

function getPaymentIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function cargarPago(id) {
  const token = localStorage.getItem('auth_token');
  try {
    const response = await fetch(`http://practice.test/api/payments/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('No se pudo obtener el pago');
    }

    const payment = await response.json();

    // Formatear fecha para datetime-local (YYYY-MM-DDTHH:mm)
    const fecha = new Date(payment.date);
    const fechaFormateada = fecha.toISOString().slice(0,16);

    document.getElementById('date').value = fechaFormateada;
    document.getElementById('bank').value = payment.bank;
    document.getElementById('mount').value = payment.mount;

    mostrarImagenActual(payment.voucher);

  } catch (error) {
    console.error('Error cargando pago:', error);
  }
}

function mostrarImagenActual(urlImagen) {
  let contenedor = document.getElementById('img-voucher-container');
  if (!contenedor) {
    contenedor = document.createElement('div');
    contenedor.id = 'img-voucher-container';
    contenedor.style.margin = '10px 0';
    const form = document.getElementById('payment-form');
    form.querySelector('.main-input').appendChild(contenedor);
  }
  contenedor.innerHTML = `
    <p>Comprobante actual:</p>
    <a href="${urlImagen}" target="_blank">
      <img src="${urlImagen}" alt="Comprobante actual" style="max-width: 200px; max-height: 200px;">
    </a>
  `;
}

function setupInputErrorListeners() {
  const campos = ['date', 'bank', 'mount', 'voucher'];
  campos.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      const evento = input.tagName.toLowerCase() === 'select' ? 'change' : 'input';
      input.addEventListener(evento, () => quitarError(input));
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

  if (!validarFormulario()) return;

  const paymentId = getPaymentIdFromUrl();
  if (!paymentId) {
    Swal.fire('Error', 'No se encontró el ID del pago para actualizar.', 'error');
    return;
  }

  const token = localStorage.getItem('auth_token');

  const formData = new FormData();
  formData.append('date', document.getElementById('date').value);
  formData.append('bank', document.getElementById('bank').value);
  formData.append('mount', document.getElementById('mount').value);

  const voucherInput = document.getElementById('voucher');
  if (voucherInput.files.length > 0) {
    formData.append('voucher', voucherInput.files[0]);
  }

  try {
    const response = await fetch(`http://practice.test/api/payments/${paymentId}`, {
      method: 'POST',  // o PUT si tu backend lo acepta, revisa rutas
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        // No pongas Content-Type, porque FormData lo maneja solo
      },
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: '¡Pago actualizado con éxito!',
        confirmButtonColor: '#28a745'
      }).then(() => {
        window.location.href = "/index.html"; // o a donde quieras redirigir
      });
    } else {
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
    { id: 'date', name: 'fecha' },
    { id: 'bank', name: 'banco' },
    { id: 'mount', name: 'monto' }
    // voucher no obligatorio en update
  ];

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
