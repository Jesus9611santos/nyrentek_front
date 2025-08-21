document.addEventListener('DOMContentLoaded', () => {
  getPayments();
});

async function getPayments() {
  const token = localStorage.getItem('auth_token');

  try {
    const response = await fetch('http://practice.test/api/payments', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    if (response.ok) {
      const payments = await response.json();

      // Referencia al tbody
      const tbody = document.querySelector('.tabla-estilo tbody');
      tbody.innerHTML = ''; // Limpiar filas previas

      payments.forEach(payment => {
        // Formatear fecha (puedes ajustar según formato deseado)
        const fecha = new Date(payment.date).toLocaleDateString('es-MX');

        // Formatear monto con separador de miles y dos decimales
        const monto = Number(payment.mount).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

        // Crear fila con datos
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${payment.id}</td>
          <td>${fecha}</td>
          <td>${payment.bank.toUpperCase()}</td>
          <td>${monto}</td>
          <td>
            <a href="${payment.voucher}" target="_blank">
              <img src="${payment.voucher}" alt="Comprobante ${payment.id}" class="comprobante-img" width="50px">
            </a>
          </td>
          <td>
            <button onclick="editPayment(${payment.id})">Editar</button>
            <button onclick="deletePayment(${payment.id})">Eliminar</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      console.error('Error inesperado', response.status);
    }
  } catch (error) {
    console.error('Error validando token:', error);
  }
}

async function deletePayment(id) {
  const token = localStorage.getItem('auth_token');

   const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: "¡No podrás revertir esto!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;

  try {
    const response = await fetch(`http://practice.test/api/payments/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: '¡Pago eliminado!',
        confirmButtonColor: '#28a745'
      }).then(() => {
        getPayments();
      });
      
    } else {
        console.error('Error en la respuesta:', response.status);
    }

    } catch (error) {
        console.error('Error en la petición:', error);
    }
}

function editPayment(id) {
    window.location.href = `update.html?id=${id}`;   
}
