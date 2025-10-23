document.addEventListener('DOMContentLoaded', () => {
  getPayments();
});

async function getPayments() {
  const token = localStorage.getItem('auth_token');

  try {
    const response = await fetch('http://localhost:8089/api/lists', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    if (response.ok) {
      const lists = await response.json();

      // Referencia al tbody
      const tbody = document.querySelector('.tabla-estilo tbody');
      tbody.innerHTML = ''; // Limpiar filas previas

      lists.forEach(list => {
        // Crear fila con datos
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${list.title}</td>
          <td>${list.description}</td>
          <td>${list.status}</td>
          <td>
            <button onclick="checkComplete(${list.id})">Completar</button>
            <button onclick="editTask(${list.id})">Editar</button>
            <button onclick="deletelist(${list.id})">Eliminar</button>
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

async function checkComplete(id) {
  const token = localStorage.getItem('auth_token');

   const result = await Swal.fire({
    title: 'Deseas marcar como completada la tarea',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#24e824',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;

  try {
    const response = await fetch(`http://localhost:8089/api/lists/complete/${id}`, {
      method: 'put',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: '¡Tarea completada!',
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

async function deletelist(id) {
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
    const response = await fetch(`http://localhost:8089/api/lists/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: '¡Tarea eliminada!',
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

function editTask(id) {
    window.location.href = `update.html?id=${id}`;   
}
