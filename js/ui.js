
const listaCategorias =
    document.getElementById("listaCategorias");

const listaProductos =
    document.getElementById("listaProductos");


/* ======================================================
   CREAR CATEGORIA
====================================================== */

function crearCategoria(categoria){

    const card =
        document.createElement("div");

    card.className = "categoria";

    card.dataset.id =
        categoria.id;

    card.innerHTML = `
        <i class="${categoria.icono}"></i>

        <h3>
            ${categoria.nombre}
        </h3>
    `;

    card.addEventListener("click",()=>{

        document
            .querySelectorAll(".categoria")
            .forEach(c => {

                c.classList.remove("activa");

            });

        card.classList.add("activa");

        filtrarCategoria(
            categoria.id
        );

    });

    return card;

}


/* ======================================================
   MOSTRAR CATEGORIAS
====================================================== */

function mostrarCategorias(){

    listaCategorias.innerHTML = "";

    categorias.forEach(categoria=>{

        const card =
            crearCategoria(categoria);

        /*
        Dejamos "Todos" seleccionado
        */

        if(categoria.id === 0){

            card.classList.add("activa");

        }

        listaCategorias.appendChild(card);

    });

}


/* ======================================================
   OBTENER PESOS DEL PRODUCTO
====================================================== */

function obtenerPesos(producto){

    /*
    Si no existe peso
    */

    if(!producto || !producto.peso){

        return [];

    }


    /*
    Si ya es un array
    */

    if(Array.isArray(producto.peso)){

        return producto.peso;

    }


    /*
    Compatibilidad con productos antiguos
    */

    return producto.peso
        .split("|")
        .map(peso => peso.trim())
        .filter(peso => peso !== "");

}


/* ======================================================
   OBTENER PRECIOS DEL PRODUCTO
====================================================== */

function obtenerPrecios(producto){

    if(!producto){

        return [];

    }


    /*
    Si ya es un array
    */

    if(Array.isArray(producto.precio)){

        return producto.precio;

    }


    /*
    Compatibilidad con productos antiguos
    */

    if(
        typeof producto.precio === "string" &&
        producto.precio.includes("|")
    ){

        return producto.precio
            .split("|")
            .map(precio => {

                return Number(
                    precio
                        .trim()
                        .replace(",", ".")
                );

            })
            .filter(precio => !isNaN(precio));

    }


    /*
    Producto con un solo precio
    */

    const precio =
        Number(producto.precio);

    return isNaN(precio)
        ? []
        : [precio];

}


/* ======================================================
   OBTENER PRECIOS DE OFERTA
====================================================== */

function obtenerPreciosOferta(producto){

    if(
        !producto ||
        producto.precioOferta === null ||
        producto.precioOferta === undefined
    ){

        return [];

    }


    /*
    Si ya es un array
    */

    if(
        Array.isArray(
            producto.precioOferta
        )
    ){

        return producto.precioOferta;

    }


    /*
    Compatibilidad con productos antiguos
    */

    if(
        typeof producto.precioOferta === "string" &&
        producto.precioOferta.includes("|")
    ){

        return producto.precioOferta
            .split("|")
            .map(precio => {

                if(precio.trim() === ""){

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

            });

    }


    const precio =
        Number(producto.precioOferta);

    return isNaN(precio)
        ? []
        : [precio];

}


/* ======================================================
   CREAR DESPLEGABLE DE PESOS
====================================================== */

function crearSelectorPeso(
    producto,
    contenedor
){

    const pesos =
        obtenerPesos(producto);


    /*
    Si no hay pesos no mostramos nada
    */

    if(pesos.length === 0){

        return;

    }


    /*
    ==================================================
    HTML DEL DESPLEGABLE
    ==================================================
    */

    contenedor.innerHTML = `

        <div class="selector-peso">

            <label class="titulo-peso">
                Peso:
            </label>

            <select
                class="select-peso"
                aria-label="Seleccionar peso">

                ${pesos.map(
                    (peso,index)=>`

                    <option
                        value="${index}"
                        ${index === 0 ? "selected" : ""}>

                        ${peso}

                    </option>

                `).join("")}

            </select>

        </div>

    `;

}


/* ======================================================
   OBTENER PRECIO SEGÚN PESO
====================================================== */

function obtenerPrecioSeleccionado(
    producto,
    indice
){

    const precios =
        obtenerPrecios(producto);


    if(precios.length === 0){

        return 0;

    }


    /*
    Si existe precio para ese índice
    */

    if(
        precios[indice] !== undefined
    ){

        return precios[indice];

    }


    /*
    Si no existe usamos el primero
    */

    return precios[0];

}


/* ======================================================
   OBTENER OFERTA SEGÚN PESO
====================================================== */

function obtenerOfertaSeleccionada(
    producto,
    indice
){

    const preciosOferta =
        obtenerPreciosOferta(producto);


    if(
        preciosOferta.length === 0
    ){

        return null;

    }


    if(
        preciosOferta[indice] !== undefined &&
        preciosOferta[indice] !== null
    ){

        return preciosOferta[indice];

    }


    return null;

}


/* ======================================================
   ACTUALIZAR PRECIO DE PRODUCTO
====================================================== */

function actualizarPrecioProducto(
    card,
    producto,
    indice
){

    const precio =
        obtenerPrecioSeleccionado(
            producto,
            indice
        );


    const precioOferta =
        obtenerOfertaSeleccionada(
            producto,
            indice
        );


    const tieneOferta =
        producto.oferta &&
        precioOferta !== null &&
        precioOferta < precio;


    const bloquePrecio =
        card.querySelector(
            ".bloque-precio-producto"
        );


    if(!bloquePrecio){

        return;

    }


    if(tieneOferta){

        bloquePrecio.innerHTML = `

            <div class="precio-oferta">

                <span class="precio-anterior">

                    ${precio.toFixed(2)} €

                </span>

                <span class="precio-nuevo">

                    ${precioOferta.toFixed(2)} €

                </span>

            </div>

        `;

    }

    else{

        bloquePrecio.innerHTML = `

            <p class="precio">

                ${precio.toFixed(2)} €

            </p>

        `;

    }


    /*
    ==================================================
    ACTUALIZAR ETIQUETA OFERTA
    ==================================================
    */

    const imagenProducto =
        card.querySelector(
            ".imagen-producto"
        );


    if(imagenProducto){

        const etiquetaExistente =
            imagenProducto.querySelector(
                ".etiqueta-oferta"
            );


        if(tieneOferta){

            if(!etiquetaExistente){

                imagenProducto.insertAdjacentHTML(
                    "afterbegin",
                    `
                    <span class="etiqueta-oferta">
                        OFERTA
                    </span>
                    `
                );

            }

        }

        else{

            if(etiquetaExistente){

                etiquetaExistente.remove();

            }

        }

    }

}


/* ======================================================
   CREAR PRODUCTO
====================================================== */

function crearProducto(producto){

    const card =
        document.createElement("article");


    card.className =
        "producto";


    const pesos =
        obtenerPesos(producto);


    const precios =
        obtenerPrecios(producto);


    /*
    Precio inicial
    */

    const precioInicial =
        precios.length > 0
            ? precios[0]
            : 0;


    const ofertaInicial =
        obtenerOfertaSeleccionada(
            producto,
            0
        );


    const tieneOfertaInicial =
        producto.oferta &&
        ofertaInicial !== null &&
        ofertaInicial < precioInicial;


    /*
    ==================================================
    ETIQUETA OFERTA
    ==================================================
    */

    let etiquetaOferta = "";


    if(tieneOfertaInicial){

        etiquetaOferta = `

            <span class="etiqueta-oferta">

                OFERTA

            </span>

        `;

    }


    /*
    ==================================================
    BLOQUE PRECIO
    ==================================================
    */

    let bloquePrecio = "";


    if(tieneOfertaInicial){

        bloquePrecio = `

            <div class="precio-oferta">

                <span class="precio-anterior">

                    ${precioInicial.toFixed(2)} €

                </span>

                <span class="precio-nuevo">

                    ${ofertaInicial.toFixed(2)} €

                </span>

            </div>

        `;

    }

    else{

        bloquePrecio = `

            <p class="precio">

                ${precioInicial.toFixed(2)} €

            </p>

        `;

    }


    /*
    ==================================================
    HTML DEL PRODUCTO
    ==================================================
    */

    card.innerHTML = `

        <div class="imagen-producto">

            ${etiquetaOferta}

            <img
                src="${producto.imagen}"
                alt="${producto.nombre}">

        </div>


        <div class="info-producto">

            ${
                producto.marca
                    ? `
                        <span class="marca-producto">
                            ${producto.marca}
                        </span>
                    `
                    : ""
            }

            <h3>

                ${producto.nombre}

            </h3>


            <p class="descripcion">

                ${producto.descripcion}

            </p>


            ${
                pesos.length > 0
                    ? `
                        <div
                            class="selector-peso-producto">
                        </div>
                      `
                    : ""
            }


            <div class="bloque-precio-producto">

                ${bloquePrecio}

            </div>


            <button
                class="btn-anadir"
                data-id="${producto.id}">

                <i class="fa-solid fa-cart-plus"></i>

                Añadir al pedido

            </button>


            <button
                class="btn-detalles"
                data-id="${producto.id}">

                <i class="fa-solid fa-eye"></i>

                Ver detalles

            </button>

        </div>

    `;


    /*
    ==================================================
    SELECTOR DE PESO
    ==================================================
    */

    const contenedorPeso =
        card.querySelector(
            ".selector-peso-producto"
        );


    if(contenedorPeso){

        crearSelectorPeso(
            producto,
            contenedorPeso
        );


        const selector =
            contenedorPeso.querySelector(
                ".select-peso"
            );


        if(selector){

            selector.addEventListener(
                "change",
                ()=>{

                    const indice =
                        Number(
                            selector.value
                        );


                    /*
                    Cambiar precio
                    */

                    actualizarPrecioProducto(
                        card,
                        producto,
                        indice
                    );


                    /*
                    Guardar selección
                    */

                    card.dataset
                        .pesoSeleccionado =
                        indice;

                }
            );

        }


        /*
        Primer peso seleccionado
        */

        card.dataset
            .pesoSeleccionado = 0;

    }


    /*
    ==================================================
    BOTÓN AÑADIR
    ==================================================
    */

    const botonAnadir =
        card.querySelector(
            ".btn-anadir"
        );


    botonAnadir.addEventListener(
        "click",
        ()=>{

            const indice =
                Number(
                    card.dataset
                        .pesoSeleccionado || 0
                );


            const pesoSeleccionado =
                pesos.length > 0
                    ? pesos[indice]
                    : null;


            const precio =
                obtenerPrecioSeleccionado(
                    producto,
                    indice
                );


            const precioOferta =
                obtenerOfertaSeleccionada(
                    producto,
                    indice
                );


            agregarCarrito(
                producto.id,
                pesoSeleccionado,
                precio,
                precioOferta
            );

        }
    );


    /*
    ==================================================
    BOTÓN DETALLES
    ==================================================
    */

    const botonDetalles =
        card.querySelector(
            ".btn-detalles"
        );


    botonDetalles.addEventListener(
        "click",
        ()=>{

            abrirModalProducto(
                producto.id
            );

        }
    );


    return card;

}


/* ======================================================
   MODAL PRODUCTO
====================================================== */

function abrirModalProducto(id){

    const producto =
        productos.find(
            producto =>
                producto.id === id
        );


    if(!producto){

        return;

    }


    const modal =
        document.getElementById(
            "modalProducto"
        );


    const contenido =
        document.getElementById(
            "contenidoModal"
        );


    const pesos =
        obtenerPesos(producto);


    const precios =
        obtenerPrecios(producto);


    const precioInicial =
        precios.length > 0
            ? precios[0]
            : 0;


    const ofertaInicial =
        obtenerOfertaSeleccionada(
            producto,
            0
        );


    contenido.innerHTML = `

        <div class="detalle-producto">

            <div>

                <img
                    class="detalle-producto-imagen"
                    src="${producto.imagen}"
                    alt="${producto.nombre}">

            </div>


            <div class="detalle-producto-info">

                <h2>

                    ${producto.nombre}

                </h2>

            ${
                producto.descripcion
                    ? `<p class="detalle-producto-descripcion">${producto.descripcion}</p>`
                    : ""
            }

            ${
                producto.descripcionDetallada
                    ? `<div class="detalle-producto-descripcion-detallada">${producto.descripcionDetallada}</div>`
                    : ""
            }

                ${
                    pesos.length > 0
                        ? `
                            <div
                                id="selectorPesoModal"
                                class="selector-peso-modal">
                            </div>
                          `
                        : ""
                }


                <div
                    id="precioModal"
                    class="detalle-producto-precio">

                    ${
                        producto.oferta &&
                        ofertaInicial !== null &&
                        ofertaInicial < precioInicial

                            ?

                            `
                            <span class="precio-anterior">

                                ${precioInicial.toFixed(2)} €

                            </span>

                            <span class="precio-nuevo">

                                ${ofertaInicial.toFixed(2)} €

                            </span>
                            `

                            :

                            `${precioInicial.toFixed(2)} €`
                    }

                </div>


                <button
                    class="btn-modal-anadir"
                    id="btnModalAnadir">

                    <i class="fa-solid fa-cart-plus"></i>

                    Añadir al pedido

                </button>

            </div>

        </div>

    `;


    /*
    ==================================================
    SELECTOR DE PESO DEL MODAL
    ==================================================
    */

    const selectorModal =
        document.getElementById(
            "selectorPesoModal"
        );


    if(selectorModal){

        crearSelectorPeso(
            producto,
            selectorModal
        );


        const selector =
            selectorModal.querySelector(
                ".select-peso"
            );


        if(selector){

            selector.addEventListener(
                "change",
                ()=>{

                    const indice =
                        Number(
                            selector.value
                        );


                    const precio =
                        obtenerPrecioSeleccionado(
                            producto,
                            indice
                        );


                    const oferta =
                        obtenerOfertaSeleccionada(
                            producto,
                            indice
                        );


                    const precioModal =
                        document.getElementById(
                            "precioModal"
                        );


                    if(
                        producto.oferta &&
                        oferta !== null &&
                        oferta < precio
                    ){

                        precioModal.innerHTML = `

                            <span
                                class="precio-anterior">

                                ${precio.toFixed(2)} €

                            </span>

                            <span
                                class="precio-nuevo">

                                ${oferta.toFixed(2)} €

                            </span>

                        `;

                    }

                    else{

                        precioModal.innerHTML = `

                            ${precio.toFixed(2)} €

                        `;

                    }


                    /*
                    Guardar índice seleccionado
                    */

                    selectorModal.dataset
                        .pesoSeleccionado =
                        indice;

                }

            );

        }


        selectorModal.dataset
            .pesoSeleccionado = 0;

    }


    /*
    ==================================================
    ABRIR MODAL
    ==================================================
    */

    modal.classList.add(
        "abierto"
    );


    /*
    ==================================================
    BOTÓN AÑADIR DEL MODAL
    ==================================================
    */

    document
        .getElementById(
            "btnModalAnadir"
        )
        .addEventListener(
            "click",
            ()=>{

                const indice =
                    selectorModal
                        ? Number(
                            selectorModal.dataset
                                .pesoSeleccionado || 0
                          )
                        : 0;


                const pesoSeleccionado =
                    pesos.length > 0
                        ? pesos[indice]
                        : null;


                const precio =
                    obtenerPrecioSeleccionado(
                        producto,
                        indice
                    );


                const precioOferta =
                    obtenerOfertaSeleccionada(
                        producto,
                        indice
                    );


                agregarCarrito(
                    producto.id,
                    pesoSeleccionado,
                    precio,
                    precioOferta
                );

            }
        );

}


/* ======================================================
   CERRAR MODAL
====================================================== */

function cerrarModalProducto(){

    const modal =
        document.getElementById(
            "modalProducto"
        );


    if(!modal){

        return;

    }


    modal.classList.remove(
        "abierto"
    );

}


const botonCerrarModal =
    document.getElementById(
        "cerrarModal"
    );


if(botonCerrarModal){

    botonCerrarModal.addEventListener(
        "click",
        cerrarModalProducto
    );

}


const modalProducto =
    document.getElementById(
        "modalProducto"
    );


if(modalProducto){

    modalProducto.addEventListener(
        "click",
        (evento)=>{

            if(
                evento.target.id ===
                "modalProducto"
            ){

                cerrarModalProducto();

            }

        }
    );

}


/* ======================================================
   MOSTRAR PRODUCTOS
====================================================== */

function mostrarProductos(
    lista = productos
){

    listaProductos.innerHTML = "";


    if(lista.length === 0){

        listaProductos.innerHTML = `

            <div class="sin-resultados">

                <i
                    class="fa-solid fa-magnifying-glass">
                </i>


                <h3>
                    No hemos encontrado productos
                </h3>


                <p>
                    Prueba con otra búsqueda.
                </p>

            </div>

        `;

        return;

    }


    lista.forEach(producto=>{

        listaProductos.appendChild(

            crearProducto(
                producto
            )

        );

    });

}
