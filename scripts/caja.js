// Función para cargar los gastos desde el localStorage y mostrarlos en la tabla
function cargarGastos() {
    const currentUser = localStorage.getItem("currentUsername");
    const gastos = JSON.parse(localStorage.getItem(`gastos_${currentUser}`)) || [];
    return gastos;
}

// Función para mostrar los gastos en la tabla
function mostrarGastosEnTabla(gastos) {
    const productTableBody = document.querySelector("#productTable tbody");
    productTableBody.innerHTML = ''; // Limpiar el contenido actual de la tabla

    gastos.forEach((gasto, index) => {
        const { descripcion, total } = gasto;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="col1">GASTO</td>
            <td class="col2">${descripcion}</td>
            <td class="col3">$${parseFloat(total).toFixed(2)}</td>
        `;

        productTableBody.appendChild(row);
    });
}

// Función para guardar los gastos en el localStorage
function guardarGastos(gastos) {
    const currentUser = localStorage.getItem("currentUsername");
    localStorage.setItem(`gastos_${currentUser}`, JSON.stringify(gastos));
}

// Obtener el botón "Agregar Egreso"
const addGastoButton = document.getElementById('addGasto');

// Evento de clic para mostrar el cuadro de diálogo de SweetAlert y agregar gastos
addGastoButton.addEventListener('click', async () => {
    const { value: formValues } = await Swal.fire({
        title: 'Agregar Egreso',
        html:
            '<input id="swal-input1" class="swal2-input" placeholder="Descripción">' +
            '<input id="swal-input2" class="swal2-input" placeholder="Monto">',
        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value
            ];
        }
    });

    if (formValues && formValues[0] && formValues[1]) {
        const descripcion = formValues[0];
        const monto = parseFloat(formValues[1]);

        if (isNaN(monto) || monto <= 0) {
            Swal.fire('Error', 'El monto debe ser un número mayor que cero.', 'error');
            return;
        }

        const gasto = {
            descripcion, // Usamos la descripción ingresada por el usuario
            total: monto
        };

        // Cargamos los gastos actuales del localStorage
        const gastos = cargarGastos();

        // Agregamos el nuevo gasto a la lista de gastos
        gastos.push(gasto);

        // Guardamos la lista actualizada de gastos en el localStorage
        guardarGastos(gastos);

        // Volvemos a cargar los gastos en la tabla
        const gastosActualizados = cargarGastos();
        mostrarGastosEnTabla(gastosActualizados);

        Swal.fire('Éxito', 'Egreso agregado correctamente.', 'success');
    }
});

// Llamamos a la función para mostrar los gastos en la tabla al cargar la página
const gastos = cargarGastos();
mostrarGastosEnTabla(gastos);

