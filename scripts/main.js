document.addEventListener("DOMContentLoaded", () => {
    const productTableBody = document.querySelector("#productTable tbody");
    const codigoInput = document.getElementById('codigoInput');
    const descripcionInput = document.getElementById('descripcionInput');
    const precioInput = document.getElementById('precioInput');
    const cantidadInput = document.getElementById('cantidadInput');
    const addToCartButton = document.getElementById('addToCart');
    const viewCartButton = document.getElementById('viewCart');
    const emptyCartButton = document.getElementById('emptyCart');
    const facturarButton = document.getElementById('cerrarVenta');
    const carritoModal = document.getElementById('carritoModal');
    const carritoBodyModal = document.getElementById('carritoBodyModal');
    const totalInput = document.getElementById('totalInput');

    let carrito = cargarCarrito();
    let ventas = cargarVentas(); 
    let numeroVenta = obtenerNumeroVentaActual();

    // Función para cargar el carrito desde el localStorage
    function cargarCarrito() {
        const currentUser = localStorage.getItem("currentUsername");
        return JSON.parse(localStorage.getItem(`carrito_${currentUser}`)) || [];
    }

    // Función para cargar las ventas desde el localStorage
    function cargarVentas() {
        const currentUser = localStorage.getItem("currentUsername");
        return JSON.parse(localStorage.getItem(`ventas_${currentUser}`)) || [];
    }

    // Función para obtener el número de venta actual
    function obtenerNumeroVentaActual() {
        const ultimaVenta = ventas[ventas.length - 1];
        if (ultimaVenta) {
            const ultimoNumeroVenta = parseInt(ultimaVenta.numero.split("-")[1]);
            if (!isNaN(ultimoNumeroVenta)) {
                return ultimoNumeroVenta + 1;
            }
        }
        return 1;
    }

    // Función para guardar el carrito en el localStorage
    function guardarCarrito() {
        const currentUser = localStorage.getItem("currentUsername");
        localStorage.setItem(`carrito_${currentUser}`, JSON.stringify(carrito));
    }

    // Función para guardar el número de venta actual en el localStorage
    function guardarNumeroVentaActual() {
        localStorage.setItem('numeroVenta', JSON.stringify(numeroVenta));
    }

    // Evento de clic para agregar productos al carrito
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

        const productoEnCarrito = carrito.find(item => item.codigo === codigo);

        if (productoEnCarrito) {
            productoEnCarrito.cantidad += cantidad;
        } else {
            carrito.push({
                codigo,
                descripcion,
                precio,
                cantidad
            });
        }

        guardarCarrito();
        mostrarCarritoModal();

        // Limpiar los campos de entrada después de agregar el producto
        codigoInput.value = '';
        descripcionInput.value = '';
        precioInput.value = '';
        cantidadInput.value = 1;
    });

    // Función para mostrar el carrito en la ventana modal
    function mostrarCarritoModal() {
        carritoBodyModal.innerHTML = '';
        let total = 0;

        for (const producto of carrito) {
            const { codigo, descripcion, precio, cantidad } = producto;
            const subtotal = parseFloat(precio) * parseInt(cantidad);
            const totalTexto = subtotal.toFixed(2);
            total += subtotal;

            const filaCarrito = document.createElement('tr');
            filaCarrito.innerHTML = `
                <td>${codigo}</td>
                <td>${cantidad}</td>
                <td>${descripcion}</td>
                <td>$${precio.toFixed(2)}</td>
                <td>$${totalTexto}</td>
            `;

            carritoBodyModal.appendChild(filaCarrito);
        }

        totalInput.value = `$${total.toFixed(2)}`;
        carritoModal.style.display = 'block';
    }

    // Función para cerrar la ventana modal del carrito
    function cerrarCarritoModal() {
        carritoModal.style.display = 'none';
    }

    // Evento de clic para mostrar el carrito
    viewCartButton.addEventListener('click', mostrarCarritoModal);

    // Evento de clic para cerrar la ventana modal del carrito
    const closeModalButton = document.getElementById('closeModal');
    closeModalButton.addEventListener('click', cerrarCarritoModal);

    // Función para vaciar el carrito
    function vaciarCarrito() {
        carrito = [];
        guardarCarrito();
        mostrarCarritoModal();
    }

    // Evento de clic para vaciar el carrito
    emptyCartButton.addEventListener('click', vaciarCarrito);

    // Función para almacenar la venta y vaciar el carrito
    function almacenarVenta(totalVenta) {
        const currentUser = localStorage.getItem("currentUsername");
        const venta = {
            numero: `Venta-${numeroVenta}`,
            total: totalVenta
        };
        ventas.push(venta);
        localStorage.setItem(`ventas_${currentUser}`, JSON.stringify(ventas));
        vaciarCarrito();
        guardarNumeroVentaActual();
    
        alert(`${venta.numero} almacenada correctamente. Total: $${venta.total}`);
    }

    // Evento de clic para facturar
    facturarButton.addEventListener('click', () => {
        const totalVenta = parseFloat(totalInput.value.replace('$', ''));
        if (isNaN(totalVenta) || totalVenta <= 0) {
            alert('No hay ningún producto a facturar');
            return;
        }
        almacenarVenta(totalVenta);
    });

    // Cargar los productos desde el JSON y mostrarlos en la tabla
    fetch("../data.json")
        .then(response => response.json())
        .then(data => {
            data.items.forEach(product => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td class="col1">${product.Codigo}</td>
                    <td class="col2">${product.Descripcion}</td>
                    <td class="col3">$${product.Precio.toFixed(2)}</td>`;
                productTableBody.appendChild(row);

                // Agregar evento de clic a cada fila de la tabla
                row.addEventListener("click", () => {
                    // Extraer información del producto seleccionado
                    const { Codigo: codigo, Descripcion: descripcion, Precio: precio } = product;

                    // Asignar la información a los inputs correspondientes
                    codigoInput.value = codigo;
                    descripcionInput.value = descripcion;
                    precioInput.value = precio.toFixed(2);
                });
            });
        })
        .catch(error => {
            console.error("Error al cargar los productos:", error);
        });
});
