$(document).ready(function () {
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        renderizarCarrito();
    }
});
// Base de datos
const baseDeDatos = [
    {
        id: 1,
        nombre: 'Camara',
        precio: 100,
        imagen: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
        id: 2,
        nombre: 'Sweater',
        precio: 70,
        imagen: 'https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
        id: 3,
        nombre: 'Jeanes azules',
        precio: 40,
        imagen: 'https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
        id: 4,
        nombre: 'Auriculares',
        precio: 28,
        imagen: 'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1  '
    },
    {
        id: 5,
        nombre: 'Conjunto',
        precio: 120,
        imagen: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
        id: 6,
        nombre: 'Camisas',
        precio: 90,
        imagen: 'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }

];

let carrito = [];
const divisa = '$';
const DOMitems = document.querySelector('#items');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotal = document.querySelector('#total');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');

// Funciones

/**
 * Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
 */
function renderizarProductos() {
    baseDeDatos.forEach((info) => {
        // Estructura
        const miNodo = document.createElement('div');
        miNodo.classList.add('card', 'col-sm-4');
        // Body
        const miNodoCardBody = document.createElement('div');
        miNodoCardBody.classList.add('card-body');
        // Titulo
        const miNodoTitle = document.createElement('h5');
        miNodoTitle.classList.add('card-title');
        miNodoTitle.textContent = info.nombre;
        // Imagen
        const miNodoImagen = document.createElement('img');
        miNodoImagen.classList.add('img-fluid');
        miNodoImagen.setAttribute('src', info.imagen);
        // Precio
        const miNodoPrecio = document.createElement('p');
        miNodoPrecio.classList.add('card-text');
        miNodoPrecio.textContent = `${info.precio}${divisa}`;
        // Boton
        const miNodoBoton = document.createElement('button');
        miNodoBoton.classList.add('btn', 'btn-primary');
        miNodoBoton.textContent = 'Añadir al carrito';
        miNodoBoton.setAttribute('marcador', info.id);
        miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
        // Insertamos
        miNodoCardBody.appendChild(miNodoImagen);
        miNodoCardBody.appendChild(miNodoTitle);
        miNodoCardBody.appendChild(miNodoPrecio);
        miNodoCardBody.appendChild(miNodoBoton);
        miNodo.appendChild(miNodoCardBody);
        DOMitems.appendChild(miNodo);
    });
}
function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

/**
 * Evento para anyadir un producto al carrito de la compra
 */
function anyadirProductoAlCarrito(evento) {
    // Añadimos el Nodo a nuestro carrito
    carrito.push(evento.target.getAttribute('marcador'))
    // Actualizamos el carrito
    renderizarCarrito();
    guardarCarritoEnLocalStorage();

}

/**
 * Dibuja todos los productos guardados en el carrito
 */
function renderizarCarrito() {
    // Vaciamos todo el html
    DOMcarrito.textContent = '';
    // Quitamos los duplicados
    const carritoSinDuplicados = [...new Set(carrito)];
    // Generamos los Nodos a partir de carrito
    carritoSinDuplicados.forEach((item) => {
        // Obtenemos el item que necesitamos de la variable base de datos
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
            // ¿Coincide las id? Solo puede existir un caso
            return itemBaseDatos.id === parseInt(item);
        });
        // Cuenta el número de veces que se repite el producto
        const numeroUnidadesItem = carrito.reduce((total, itemId) => {
            // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
            return itemId === item ? total += 1 : total;
        }, 0);
        // Creamos el nodo del item del carrito
        const miNodo = document.createElement('li');
        miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
        miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
        // Boton de borrar
        const miBoton = document.createElement('button');
        miBoton.classList.add('btn', 'btn-danger', 'mx-5');
        miBoton.textContent = 'X';
        miBoton.style.marginLeft = '1rem';
        miBoton.dataset.item = item;
        miBoton.addEventListener('click', borrarItemCarrito);
        // Mezclamos nodos
        miNodo.appendChild(miBoton);
        DOMcarrito.appendChild(miNodo);
    });
    // Renderizamos el precio total en el HTML
    DOMtotal.textContent = calcularTotal();
}

/**
 * Evento para borrar un elemento del carrito
 */
function borrarItemCarrito(evento) {
    // Obtenemos el producto ID que hay en el boton pulsado
    const id = evento.target.dataset.item;
    // Borramos todos los productos
    carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
    });
    // volvemos a renderizar
    renderizarCarrito();
    guardarCarritoEnLocalStorage();

}

/**
 * Calcula el precio total teniendo en cuenta los productos repetidos
 */
function calcularTotal() {
    // Recorremos el array del carrito
    return carrito.reduce((total, item) => {
        // De cada elemento obtenemos su precio
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        // Los sumamos al total
        return total + miItem[0].precio;
    }, 0).toFixed(2);
}

/**
 * Vacia el carrito y vuelve a dibujarlo
 */
function vaciarCarrito() {
    // Limpiamos los productos guardados
    carrito = [];
    // Renderizamos los cambios
    renderizarCarrito();
    guardarCarritoEnLocalStorage();
}
// Eventos
DOMbotonVaciar.addEventListener('click', vaciarCarrito);
// Función para cargar tarjetas de productos desde el JSON local utilizando fetch
async function cargarTarjetasDesdeJSON() {
    const contenedorProductos = document.getElementById('tarjetasProductos');

    try {
        // Utilizamos fetch para obtener el contenido del archivo JSON local
        const response = await fetch('./productos.json');

        if (!response.ok) {
            throw new Error('Error al cargar los datos del JSON local');
        }

        // Parseamos el JSON y obtenemos los datos
        const productosJSON = await response.json();

        // Limitamos la cantidad de tarjetas a mostrar (en este caso, solo dos)
        const productosLimitados = productosJSON.slice(0, 2);

        // Creamos tarjetas para cada producto del JSON local
        productosLimitados.forEach(producto => {
            // Crear elementos HTML (similar al código anterior)
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('card', 'col-sm-4', 'mb-3');

            const imagenElement = document.createElement('img');
            imagenElement.classList.add('img-fluid');
            imagenElement.style.maxHeight = '150px';
            imagenElement.setAttribute('src', producto.imagen);

            const nombreElement = document.createElement('h5');
            nombreElement.classList.add('card-title');
            nombreElement.textContent = producto.nombre;

            const precioElement = document.createElement('p');
            precioElement.classList.add('card-text');
            precioElement.textContent = `${producto.precio}$`;

            // Botón "Añadir al carrito"
            const botonAgregar = document.createElement('button');
            botonAgregar.classList.add('btn', 'btn-danger'); // Estilo rojo
            botonAgregar.textContent = 'Agotado';
            botonAgregar.disabled = true; // Deshabilitar el botón
            // Agregar elementos al contenedor de la tarjeta
            tarjeta.appendChild(imagenElement);
            tarjeta.appendChild(nombreElement);
            tarjeta.appendChild(precioElement);
            tarjeta.appendChild(botonAgregar);

            // Agregar tarjeta al contenedor de productos
            contenedorProductos.appendChild(tarjeta);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Llamar a la función para cargar tarjetas desde el JSON local
cargarTarjetasDesdeJSON();

// Inicio
renderizarProductos();
renderizarCarrito();

