// Obtener referencia a la tabla
const table = document.querySelector('table');
const codigoInput = document.getElementById('codigoInput');
const descripcionInput = document.getElementById('descripcionInput');
const precioInput = document.getElementById('precioInput');
const cantidadInput = document.getElementById('cantidadInput');

let carrito = [];
let numeroVenta = 1;
let ventas = [];

// Al cargar la página, obtener el valor de numeroVenta almacenado en el localStorage
document.addEventListener('DOMContentLoaded', () => {
    const storedNumeroVenta = localStorage.getItem('numeroVenta');
    if (storedNumeroVenta) {
        numeroVenta = parseInt(storedNumeroVenta);
    }
    cargarVentas();
});

// Función para almacenar el valor de numeroVenta en el localStorage
function guardarNumeroVenta() {
    localStorage.setItem('numeroVenta', numeroVenta.toString());
}

table.addEventListener('click', (event) => {
    if (event.target.tagName === 'TD' && event.target.parentNode.classList.contains('row')) {
        const filaSeleccionada = event.target.parentNode;
        const [codigo, descripcion, precioTexto] = filaSeleccionada.querySelectorAll('.row__col1, .row__col2, .row__col3');
        codigoInput.value = codigo.textContent;
        descripcionInput.value = descripcion.textContent;
        precioInput.value = parseFloat(precioTexto.textContent.replace('$', '')) || '';
    }
});

const addToCartButton = document.getElementById('addToCart');
addToCartButton.addEventListener('click', () => {
    const codigo = codigoInput.value;
    const descripcion = descripcionInput.value;
    const precio = parseFloat(precioInput.value) || 0;
    const cantidad = parseInt(cantidadInput.value) || 1;

    if (codigo.trim() === '' || descripcion.trim() === '' || isNaN(precio)) {
        alert('Por favor, seleccione un producto');
        return;
    }

    if (cantidad < 1) {
        alert('La cantidad debe ser igual o mayor a 1.');
        return;
    }

    carrito.push({
        codigo,
        descripcion,
        precio,
        cantidad
    });

    codigoInput.value = '';
    descripcionInput.value = '';
    precioInput.value = '';
    cantidadInput.value = 1;

    mostrarCarritoModal(); 
});

const mostrarMensaje = (mensaje) => {
    alert(mensaje);
};

function mostrarCarrito() {
    console.log(carrito);
    mostrarCarritoModal();
}

function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem('carrito');
    mostrarCarritoModal();
}

function almacenarVenta(totalVenta) {
    const venta = {
        numero: `Venta-${numeroVenta}`,
        total: totalVenta
    };
    numeroVenta++;
    guardarNumeroVenta(); 
    localStorage.setItem('venta', JSON.stringify(venta));
    ventas.push(venta); // Agregar la venta al array de ventas
    localStorage.setItem('ventas', JSON.stringify(ventas)); // Guardar el array de ventas en el localStorage
    mostrarMensaje(`${venta.numero} almacenada correctamente. Total: $${venta.total}`);
}

const viewCartButton = document.getElementById('viewCart');
viewCartButton.addEventListener('click', mostrarCarrito);

const emptyCartButton = document.getElementById('emptyCart');
emptyCartButton.addEventListener('click', vaciarCarrito);

const carritoModal = document.getElementById('carritoModal');

function mostrarCarritoModal() {
    const carritoBodyModal = document.getElementById('carritoBodyModal');
    carritoBodyModal.innerHTML = '';
    let total = 0;

    for (const producto of carrito) {
        const { codigo, cantidad, descripcion, precio } = producto;
        const subtotal = parseFloat(precio) * parseInt(cantidad);
        const totalTexto = subtotal.toFixed(2);
        total += subtotal;

        const filaCarrito = document.createElement('tr');
        filaCarrito.innerHTML = `
            <td>${codigo}</td>
            <td>${cantidad}</td>
            <td>${descripcion}</td>
            <td>${precio}</td>
            <td>${totalTexto}</td>
        `;

        carritoBodyModal.appendChild(filaCarrito);
    }

    const totalInput = document.getElementById('totalInput');
    totalInput.value = total.toFixed(2);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    carritoModal.style.display = 'block';
}

const cerrarCarritoModal = () => {
    carritoModal.style.display = 'none';
};

const closeModalButton = document.getElementById('closeModal');
closeModalButton.addEventListener('click', cerrarCarritoModal);

const facturarButton = document.getElementById('cerrarVenta');
facturarButton.addEventListener('click', () => {
    const totalVenta = parseFloat(document.getElementById('totalInput').value);
    if (isNaN(totalVenta) || totalVenta <= 0) {
        alert('No hay ningun producto a facturar');
        return;
    }
    almacenarVenta(totalVenta);
    vaciarCarrito();
    cerrarCarritoModal();
});

window.addEventListener('click', (event) => {
    if (event.target === carritoModal) {
        cerrarCarritoModal();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const storedCarrito = localStorage.getItem('carrito');
    if (storedCarrito) {
        carrito = JSON.parse(storedCarrito);
    }
    cargarVentas();
});


// Función para cargar las ventas almacenadas en el localStorage
function cargarVentas() {
    const storedVentas = localStorage.getItem('ventas');
    if (storedVentas) {
        ventas = JSON.parse(storedVentas);
    }
}

// Función para mostrar la ventana modal de ventas
function mostrarVentasModal() {
    const ventasModal = document.getElementById('ventasModal');
    const ventasBodyModal = document.getElementById('ventasBodyModal');
    ventasBodyModal.innerHTML = '';

    for (const venta of ventas) {
        const filaVenta = document.createElement('tr');
        filaVenta.innerHTML = `
            <td>${venta.numero}</td>
            <td>Venta de contado</td>
            <td>${venta.total}</td>
        `;
        ventasBodyModal.appendChild(filaVenta);
    }

    ventasModal.style.display = 'block';
}

// Obtener referencia al botón de cierre de la ventana modal de ventas
const closeVentasModalButton = document.getElementById('closeVentasModal');
closeVentasModalButton.addEventListener('click', cerrarVentasModal);

// Función para cerrar la ventana modal de ventas
function cerrarVentasModal() {
    const ventasModal = document.getElementById('ventasModal');
    ventasModal.style.display = 'none';
}

// Agregar evento de clic fuera de la ventana modal de ventas para cerrarla
window.addEventListener('click', (event) => {
    const ventasModal = document.getElementById('ventasModal');
    if (event.target === ventasModal) {
        cerrarVentasModal();
    }
});
