/* ======================================================
   CARRITO - PELUDITOS
====================================================== */


/* ======================================================
   CARGAR CARRITO
====================================================== */

let carrito = cargarCarrito();


/* ======================================================
   CARGAR DESDE LOCALSTORAGE
====================================================== */

function cargarCarrito(){

    const datos =
        localStorage.getItem(
            "peluditos_carrito"
        );


    if(!datos){

        return [];

    }


    try{

        const carritoGuardado =
            JSON.parse(datos);


        if(!Array.isArray(carritoGuardado)){

            return [];

        }


        return carritoGuardado.map(
            item => {

                return {

                    id:
                        item.id,

                    nombre:
                        item.nombre || "",

                    peso:
                        item.peso || null,

                    precio:
                        Number(item.precio) || 0,

                    cantidad:
                        Number(item.cantidad) || 1,

                    imagen:
                        item.imagen || ""

                };

            }
        );

    }


    catch(error){

        console.error(
            "Error cargando carrito:",
            error
        );

        return [];

    }

}


/* ======================================================
   GUARDAR CARRITO
====================================================== */

function guardarCarrito(){

    localStorage.setItem(
        "peluditos_carrito",
        JSON.stringify(carrito)
    );

}


/* ======================================================
   BUSCAR PRODUCTO
====================================================== */

function buscarProducto(
    id,
    peso = null
){

    return carrito.find(
        producto => {

            return (
                producto.id === id &&
                producto.peso === peso
            );

        }
    );

}


/* ======================================================
   OBTENER PRODUCTO DEL CATÁLOGO
====================================================== */

function obtenerProductoCatalogo(id){

    return productos.find(
        producto =>
            producto.id === id
    );

}


/* ======================================================
   OBTENER PESOS
====================================================== */

function obtenerPesosCarrito(producto){

    if(!producto){

        return [];

    }


    if(Array.isArray(producto.peso)){

        return producto.peso;

    }


    if(
        typeof producto.peso === "string" &&
        producto.peso.trim() !== ""
    ){

        return producto.peso
            .split("|")
            .map(
                peso =>
                    peso.trim()
            )
            .filter(
                peso =>
                    peso !== ""
            );

    }


    return [];

}


/* ======================================================
   OBTENER PRECIOS
====================================================== */

function obtenerPreciosCarrito(producto){

    if(!producto){

        return [];

    }


    if(Array.isArray(producto.precio)){

        return producto.precio;

    }


    if(
        typeof producto.precio === "string"
    ){

        return producto.precio
            .split("|")
            .map(
                precio =>
                    Number(
                        precio
                            .trim()
                            .replace(",", ".")
                    )
            )
            .filter(
                precio =>
                    !isNaN(precio)
            );

    }


    const precio =
        Number(
            producto.precio
        );


    return isNaN(precio)
        ? []
        : [precio];

}


/* ======================================================
   OBTENER PRECIOS DE OFERTA
====================================================== */

function obtenerPreciosOfertaCarrito(producto){

    if(!producto){

        return [];

    }


    if(
        producto.precioOferta === null ||
        producto.precioOferta === undefined
    ){

        return [];

    }


    if(
        Array.isArray(
            producto.precioOferta
        )
    ){

        return producto.precioOferta;

    }


    if(
        typeof producto.precioOferta === "string"
    ){

        /*
        IMPORTANTE:

        Conservamos los huecos.

        8||35

        =

        [8, null, 35]
        */

        return producto.precioOferta
            .split("|")
            .map(
                precio => {

                    if(
                        precio.trim() === ""
                    ){

                        return null;

                    }


                    const numero =
                        Number(
                            precio
                                .trim()
                                .replace(",", ".")
                        );


                    return isNaN(numero)
                        ? null
                        : numero;

                }
            );

    }


    const precio =
        Number(
            producto.precioOferta
        );


    return isNaN(precio)
        ? []
        : [precio];

}


/* ======================================================
   OBTENER ÍNDICE DEL PESO
====================================================== */

function obtenerIndicePeso(
    producto,
    peso
){

    const pesos =
        obtenerPesosCarrito(
            producto
        );


    if(!peso){

        return 0;

    }


    const indice =
        pesos.indexOf(
            peso
        );


    return indice === -1
        ? 0
        : indice;

}


/* ======================================================
   OBTENER PRECIO REAL
====================================================== */

function obtenerPrecioVariante(
    producto,
    peso
){

    const precios =
        obtenerPreciosCarrito(
            producto
        );


    if(precios.length === 0){

        return 0;

    }


    const indice =
        obtenerIndicePeso(
            producto,
            peso
        );


    let precio =
        precios[indice];


    if(
        precio === undefined ||
        isNaN(precio)
    ){

        precio =
            precios[0];

    }


    /*
    ==============================================
    OFERTA
    ==============================================
    */

    /*
    Si OFERTA = NO,
    ignoramos completamente
    precio_oferta.
    */

    if(
        producto.oferta !== true
    ){

        return precio;

    }


    const preciosOferta =
        obtenerPreciosOfertaCarrito(
            producto
        );


    const precioOferta =
        preciosOferta[indice];


    if(
        precioOferta !== undefined &&
        precioOferta !== null &&
        !isNaN(precioOferta) &&
        precioOferta < precio
    ){

        return precioOferta;

    }


    return precio;

}


/* ======================================================
   AÑADIR AL CARRITO
====================================================== */

function agregarCarrito(
    id,
    peso = null,
    precioSeleccionado = null,
    precioOfertaSeleccionado = null
){

    const producto =
        obtenerProductoCatalogo(
            id
        );


    if(!producto){

        console.error(
            "Producto no encontrado:",
            id
        );

        return;

    }


    /*
    ==============================================
    PESOS
    ==============================================
    */

    const pesos =
        obtenerPesosCarrito(
            producto
        );


    if(
        peso === undefined ||
        peso === ""
    ){

        peso =
            pesos.length > 0
                ? pesos[0]
                : null;

    }


    /*
    ==============================================
    PRECIO
    ==============================================
    */

    let precioReal =
        obtenerPrecioVariante(
            producto,
            peso
        );


    /*
    Si la interfaz nos ha enviado
    el precio seleccionado,
    lo utilizamos.
    */

    if(
        precioSeleccionado !== null &&
        precioSeleccionado !== undefined &&
        !isNaN(
            Number(
                precioSeleccionado
            )
        )
    ){

        precioReal =
            Number(
                precioSeleccionado
            );


        /*
        Aplicar oferta SOLO
        si OFERTA = SI
        */

        if(
            producto.oferta === true &&
            precioOfertaSeleccionado !== null &&
            precioOfertaSeleccionado !== undefined &&
            !isNaN(
                Number(
                    precioOfertaSeleccionado
                )
            )
        ){

            const oferta =
                Number(
                    precioOfertaSeleccionado
                );


            if(
                oferta < precioReal
            ){

                precioReal =
                    oferta;

            }

        }

    }


    /*
    ==============================================
    BUSCAR VARIANTE EXISTENTE
    ==============================================
    */

    const existente =
        buscarProducto(
            producto.id,
            peso
        );


    if(existente){

        existente.cantidad++;

        existente.precio =
            precioReal;

    }


    else{

        carrito.push({

            id:
                producto.id,

            nombre:
                producto.nombre,

            peso:
                peso,

            precio:
                precioReal,

            cantidad:
                1,

            imagen:
                producto.imagen

        });

    }


    /*
    ==============================================
    GUARDAR
    ==============================================
    */

    guardarCarrito();


    actualizarContador();

    dibujarCarrito();

}


/* ======================================================
   CONTADOR
====================================================== */

function actualizarContador(){

    const contador =
        document.getElementById(
            "contador"
        )
        ||
        document.getElementById(
            "contador-carrito"
        );


    if(!contador){

        return;

    }


    let total = 0;


    carrito.forEach(
        producto => {

            total +=
                Number(
                    producto.cantidad
                ) || 0;

        }
    );


    contador.textContent =
        total;

}


/* ======================================================
   DIBUJAR CARRITO
====================================================== */

function dibujarCarrito(){

    const contenedorPagina =
        document.getElementById(
            "carritoPagina"
        );


    const contenedorPanel =
        document.getElementById(
            "contenidoCarrito"
        );


    const contenedor =
        contenedorPagina ||
        contenedorPanel;


    if(!contenedor){

        return;

    }


    const totalPanel =
        document.getElementById(
            "importeTotal"
        );


    const subtotalPagina =
        document.getElementById(
            "subtotalCarrito"
        );


    const totalPagina =
        document.getElementById(
            "totalCarrito"
        );


    contenedor.innerHTML = "";


    let importe = 0;


    /*
    ==============================================
    CARRITO VACÍO
    ==============================================
    */

    if(carrito.length === 0){

        contenedor.innerHTML = `

            <div class="carrito-vacio">

                <i class="fa-solid fa-cart-shopping"></i>

                <h3>
                    Tu pedido está vacío
                </h3>

                <p>
                    Añade productos para preparar
                    tu pedido.
                </p>

            </div>

        `;


        if(totalPanel){

            totalPanel.textContent =
                "0,00 €";

        }


        if(subtotalPagina){

            subtotalPagina.textContent =
                "0,00 €";

        }


        if(totalPagina){

            totalPagina.textContent =
                "0,00 €";

        }


        return;

    }


    /*
    ==============================================
    PRODUCTOS
    ==============================================
    */

    carrito.forEach(
        producto => {

            const subtotal =
                producto.precio *
                producto.cantidad;


            importe +=
                subtotal;


            const tarjeta =
                document.createElement(
                    "div"
                );


            tarjeta.className =
                "item-carrito";


            tarjeta.innerHTML = `

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                >


                <div class="info-item">

                    <h4>
                        ${producto.nombre}
                    </h4>


                    ${
                        producto.peso
                            ?
                            `
                            <p class="peso-carrito">

                                Formato:
                                <strong>
                                    ${producto.peso}
                                </strong>

                            </p>
                            `
                            :
                            ""
                    }


                    <p>
                        ${producto.precio.toFixed(2)} €
                        / unidad
                    </p>


                    <strong class="subtotal-item">

                        Subtotal:
                        ${subtotal.toFixed(2)} €

                    </strong>


                    <div class="controles">

                        <button
                            type="button"
                            data-accion="menos">

                            −

                        </button>


                        <strong>
                            ${producto.cantidad}
                        </strong>


                        <button
                            type="button"
                            data-accion="mas">

                            +

                        </button>


                        <button
                            type="button"
                            data-accion="borrar">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </div>

            `;


            contenedor.appendChild(
                tarjeta
            );


            /*
            BOTÓN +
            */

            const btnMas =
                tarjeta.querySelector(
                    '[data-accion="mas"]'
                );


            if(btnMas){

                btnMas.addEventListener(
                    "click",
                    () => {

                        sumarCantidad(
                            producto.id,
                            producto.peso
                        );

                    }
                );

            }


            /*
            BOTÓN -
            */

            const btnMenos =
                tarjeta.querySelector(
                    '[data-accion="menos"]'
                );


            if(btnMenos){

                btnMenos.addEventListener(
                    "click",
                    () => {

                        restarCantidad(
                            producto.id,
                            producto.peso
                        );

                    }
                );

            }


            /*
            BORRAR
            */

            const btnBorrar =
                tarjeta.querySelector(
                    '[data-accion="borrar"]'
                );


            if(btnBorrar){

                btnBorrar.addEventListener(
                    "click",
                    () => {

                        eliminarProducto(
                            producto.id,
                            producto.peso
                        );

                    }
                );

            }

        }
    );


    /*
    ==============================================
    TOTALES
    ==============================================
    */

    const importeTexto =
        importe.toFixed(2) +
        " €";


    if(totalPanel){

        totalPanel.textContent =
            importeTexto;

    }


    if(subtotalPagina){

        subtotalPagina.textContent =
            importeTexto;

    }


    if(totalPagina){

        totalPagina.textContent =
            importeTexto;

    }

}


/* ======================================================
   PANEL CARRITO
====================================================== */

function iniciarPanelCarrito(){

    const boton =
        document.getElementById(
            "btnCarrito"
        );


    const cerrar =
        document.getElementById(
            "cerrarCarrito"
        );


    const panel =
        document.getElementById(
            "panelCarrito"
        );


    const overlay =
        document.getElementById(
            "overlay"
        );


    if(
        !boton ||
        !cerrar ||
        !panel ||
        !overlay
    ){

        return;

    }


    boton.addEventListener(
        "click",
        () => {

            panel.classList.add(
                "abierto"
            );

            overlay.classList.add(
                "activo"
            );

            dibujarCarrito();

        }
    );


    cerrar.addEventListener(
        "click",
        cerrarPanel
    );


    overlay.addEventListener(
        "click",
        cerrarPanel
    );

}


function cerrarPanel(){

    const panel =
        document.getElementById(
            "panelCarrito"
        );


    const overlay =
        document.getElementById(
            "overlay"
        );


    if(panel){

        panel.classList.remove(
            "abierto"
        );

    }


    if(overlay){

        overlay.classList.remove(
            "activo"
        );

    }

}


/* ======================================================
   SUMAR
====================================================== */

function sumarCantidad(
    id,
    peso = null
){

    const producto =
        buscarProducto(
            id,
            peso
        );


    if(!producto){

        return;

    }


    producto.cantidad++;


    guardarCarrito();

    actualizarContador();

    dibujarCarrito();

}


/* ======================================================
   RESTAR
====================================================== */

function restarCantidad(
    id,
    peso = null
){

    const producto =
        buscarProducto(
            id,
            peso
        );


    if(!producto){

        return;

    }


    producto.cantidad--;


    if(
        producto.cantidad <= 0
    ){

        eliminarProducto(
            id,
            peso
        );

        return;

    }


    guardarCarrito();

    actualizarContador();

    dibujarCarrito();

}


/* ======================================================
   ELIMINAR
====================================================== */

function eliminarProducto(
    id,
    peso = null
){

    carrito =
        carrito.filter(
            producto => {

                return !(
                    producto.id === id &&
                    producto.peso === peso
                );

            }
        );


    guardarCarrito();

    actualizarContador();

    dibujarCarrito();

}


/* ======================================================
   ACTUALIZAR PRECIOS
====================================================== */

function actualizarPreciosCarrito(){

    if(!Array.isArray(carrito)){

        return;

    }


    carrito.forEach(
        item => {

            const producto =
                productos.find(
                    producto =>
                        producto.id === item.id
                );


            if(!producto){

                return;

            }


            item.nombre =
                producto.nombre;


            item.imagen =
                producto.imagen;


            item.precio =
                obtenerPrecioVariante(
                    producto,
                    item.peso
                );

        }
    );


    guardarCarrito();

    actualizarContador();

    dibujarCarrito();

}


/* ======================================================
   VACIAR CARRITO
====================================================== */

function vaciarCarrito(){

    if(carrito.length === 0){

        return;

    }


    const confirmar =
        confirm(
            "¿Quieres vaciar todo el pedido?"
        );


    if(!confirmar){

        return;

    }


    carrito.length = 0;


    guardarCarrito();

    actualizarContador();

    dibujarCarrito();

}


/* ======================================================
   BOTÓN VACIAR
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const boton =
            document.getElementById(
                "btnVaciarCarrito"
            );


        if(!boton){

            return;

        }


        boton.addEventListener(
            "click",
            vaciarCarrito
        );

    }
);


/* ======================================================
   IR AL CARRITO
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const boton =
            document.getElementById(
                "btnIrCarrito"
            );


        if(!boton){

            return;

        }


        boton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "carrito.html";

            }
        );

    }
);


/* ======================================================
   DATOS DEL CLIENTE
====================================================== */

function guardarDatosCliente(){

    const datos = {

        nombre:
            document.getElementById(
                "clienteNombre"
            )?.value || "",

        telefono:
            document.getElementById(
                "clienteTelefono"
            )?.value || "",

        direccion:
            document.getElementById(
                "clienteDireccion"
            )?.value || "",

        codigoPostal:
            document.getElementById(
                "clienteCodigoPostal"
            )?.value || "",

        localidad:
            document.getElementById(
                "clienteLocalidad"
            )?.value || "",

        entrega:
            document.getElementById(
                "clienteEntrega"
            )?.value || ""

    };


    localStorage.setItem(
        "peluditos_datos_cliente",
        JSON.stringify(datos)
    );

}


/* ======================================================
   CARGAR DATOS CLIENTE
====================================================== */

function cargarDatosCliente(){

    const datosGuardados =
        localStorage.getItem(
            "peluditos_datos_cliente"
        );


    if(!datosGuardados){

        return;

    }


    try{

        const datos =
            JSON.parse(
                datosGuardados
            );


        const campos = {

            clienteNombre:
                datos.nombre,

            clienteTelefono:
                datos.telefono,

            clienteDireccion:
                datos.direccion,

            clienteCodigoPostal:
                datos.codigoPostal,

            clienteLocalidad:
                datos.localidad,

            clienteEntrega:
                datos.entrega

        };


        Object.entries(
            campos
        ).forEach(
            ([id, valor]) => {

                const campo =
                    document.getElementById(
                        id
                    );


                if(campo){

                    campo.value =
                        valor || "";

                }

            }
        );

    }


    catch(error){

        console.error(
            "Error leyendo datos del cliente:",
            error
        );

    }

}


/* ======================================================
   INICIAR DATOS CLIENTE
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        cargarDatosCliente();


        const campos = [

            "clienteNombre",
            "clienteTelefono",
            "clienteDireccion",
            "clienteCodigoPostal",
            "clienteLocalidad",
            "clienteEntrega"

        ];


        campos.forEach(
            id => {

                const campo =
                    document.getElementById(
                        id
                    );


                if(!campo){

                    return;

                }


                campo.addEventListener(
                    "input",
                    guardarDatosCliente
                );


                campo.addEventListener(
                    "change",
                    guardarDatosCliente
                );

            }
        );

    }
);