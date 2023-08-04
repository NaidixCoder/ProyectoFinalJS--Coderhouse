// Módulo de cálculo de ventas
const Ventas = {
    calcularTotalVentas: (currentUser) => {
        const storedVentas = localStorage.getItem(`ventas_${currentUser}`);
        if (storedVentas) {
            const ventas = JSON.parse(storedVentas);
            const totalVentas = ventas.reduce((total, venta) => total + parseFloat(venta.total), 0);
            return totalVentas.toFixed(2);
        }
        return '00.00';
    },
    obtenerNumeroVenta: (venta) => {
        const numeroVenta = venta.numero.split("-")[1];
        return parseInt(numeroVenta);
    },
};

// Módulo para mostrar las ventas
const VentasUI = {
    mostrarTotalVentas: () => {
        const currentUser = localStorage.getItem("currentUsername");
        const totalVentas = Ventas.calcularTotalVentas(currentUser);
        const totalVentasElement = document.getElementById('totalVentas');
        totalVentasElement.textContent = `Total vendido: $ ${totalVentas}`;
    },
    mostrarVentasRegistradas: () => {
        const currentUser = localStorage.getItem("currentUsername");
        const storedVentas = localStorage.getItem(`ventas_${currentUser}`);
        if (storedVentas) {
            const ventas = JSON.parse(storedVentas);
            let ventasRegistradas = "";

            ventas.sort((a, b) => Ventas.obtenerNumeroVenta(a) - Ventas.obtenerNumeroVenta(b));

            for (const venta of ventas) {
                const { numero, total } = venta;
                const totalVenta = parseFloat(total).toFixed(2);
                ventasRegistradas += `${numero}: $ ${totalVenta}\n`;
            }

            alert(ventasRegistradas);
        } else {
            alert("No hay ventas registradas.");
        }
    },
    mostrarTotalGastos: () => {
        const currentUser = localStorage.getItem("currentUsername");
        const totalGastos = Gastos.calcularTotalGastos(currentUser);
        const totalGastosElement = document.getElementById('totalGastos');
        totalGastosElement.textContent = `Egresos: $ ${totalGastos}`;
    },
    mostrarTotalSaldo: () => {
        const currentUser = localStorage.getItem("currentUsername");
        const totalVentas = parseFloat(Ventas.calcularTotalVentas(currentUser));
        const totalGastos = parseFloat(Gastos.calcularTotalGastos(currentUser));

        const saldoActual = (totalVentas - totalGastos).toFixed(2);

        const totalSaldoElement = document.getElementById('totalSaldo');
        totalSaldoElement.textContent = `Saldo actual: $ ${saldoActual}`;
    },
};

// Módulo de cálculo de gastos
const Gastos = {
    calcularTotalGastos: (currentUser) => {
        const storedGastos = localStorage.getItem(`gastos_${currentUser}`);
        if (storedGastos) {
            const gastos = JSON.parse(storedGastos);
            console.log(gastos); // Verificar si los datos de gastos se están obteniendo correctamente.

            // Iterar sobre los gastos y sumar los montos.
            const totalGastos = gastos.reduce((total, gasto) => total + parseFloat(gasto.total), 0);
            console.log(totalGastos); // Verificar si el cálculo del total de gastos es correcto.

            if (isNaN(totalGastos)) {
                console.log("¡El cálculo del total de gastos resultó en NaN!"); // Verificar si el resultado es NaN.
            }

            return totalGastos.toFixed(2);
        }
        console.log("No hay gastos registrados."); // Verificar si los gastos están almacenados correctamente en localStorage.
        return '00.00';
    },
};


// Llamamos a las funciones de mostrar ventas y gastoss
VentasUI.mostrarTotalVentas();
VentasUI.mostrarTotalGastos();
VentasUI.mostrarTotalSaldo();

// Asignar el evento de clic al botón "verVentas"
const verVentasButton = document.getElementById('verVentas');

// Función para mostrar las ventas en la ventana modal
function mostrarVentasModal() {
    const currentUser = localStorage.getItem("currentUsername");
    const storedVentas = localStorage.getItem(`ventas_${currentUser}`);
    const modal = document.getElementById('modalVerVentas');
    const ventasTableBody = document.getElementById('ventasTableBody');

    if (storedVentas) {
        const ventas = JSON.parse(storedVentas);

        ventas.sort((a, b) => Ventas.obtenerNumeroVenta(a) - Ventas.obtenerNumeroVenta(b));

        let ventasHTML = '';

        for (const venta of ventas) {
            const { numero, total } = venta;
            const totalVenta = parseFloat(total).toFixed(2);
            ventasHTML += `
                <tr>
                    <td>${numero}</td>
                    <td>$ ${totalVenta}</td>
                </tr>
            `;
        }

        ventasTableBody.innerHTML = ventasHTML;
        modal.style.display = 'block';
    } else {
        ventasTableBody.innerHTML = '<tr><td colspan="2">No hay ventas registradas.</td></tr>';
        modal.style.display = 'block';
    }
}

// Asignar el evento de clic al botón "verVentas" para mostrar la ventana modal
verVentasButton.addEventListener('click', mostrarVentasModal);

// Evento de clic para cerrar la ventana modal
const closeModalButton = document.querySelector('.modal-close');
closeModalButton.addEventListener('click', () => {
    const modal = document.getElementById('modalVerVentas');
    modal.style.display = 'none';
});


// Función para cerrar la sesión
function cerrarSesion(event) {
    event.preventDefault(); // Detener el comportamiento predeterminado del enlace

    Swal.fire({
        icon: 'question',
        title: '¿Estás seguro de cerrar la sesión?',
        showDenyButton: true,
        confirmButtonText: 'Cerrar sesión',
        denyButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("currentUsername");
            window.location.href = "../index.html";
        }
    });
}

// Obtener el enlace de "Cerrar sesión" por su id
const cerrarSesionLink = document.getElementById("logoutLink");

// Asignar el evento de clic para cerrar sesión
cerrarSesionLink.addEventListener("click", cerrarSesion);

VentasUI.mostrarTotalVentas();
VentasUI.mostrarTotalGastos();