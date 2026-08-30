/* ======================================================
   FILTROS Y BUSCADOR
====================================================== */

let categoriaSeleccionada = 0;
let textoBusqueda = "";

/* ==========================================
   FILTRAR Y PINTAR
========================================== */

function actualizarCatalogo(){

    let lista = [...productos];

    // Filtrar por categoría

    if(categoriaSeleccionada !== 0){

        lista = lista.filter(producto =>
            producto.categoria === categoriaSeleccionada
        );

    }

    // Filtrar por texto

    if(textoBusqueda.trim() !== ""){

        const texto = textoBusqueda.toLowerCase();

        lista = lista.filter(producto =>

            producto.nombre.toLowerCase().includes(texto) ||

            producto.descripcion.toLowerCase().includes(texto)

        );

    }

    mostrarProductos(lista);

}

/* ==========================================
   CAMBIAR CATEGORIA
========================================== */

function filtrarCategoria(id){

    categoriaSeleccionada = id;

    actualizarCatalogo();

}

/* ==========================================
   BUSCADOR
========================================== */

function iniciarBuscador(){

    const caja = document.getElementById("txtBuscar");

    caja.addEventListener("input",(e)=>{

        textoBusqueda = e.target.value;

        actualizarCatalogo();

    });

}