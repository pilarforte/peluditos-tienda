
/* ======================================================
   INICIAR CUANDO CARGUE LA PÁGINA
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    iniciar
);


/* ======================================================
   FUNCIÓN PRINCIPAL
====================================================== */

async function iniciar(){

    console.log(
        "======================================"
    );

    console.log(
        "INICIANDO WEB PELUDITOS"
    );

    console.log(
        "======================================"
    );


    /* ==================================================
       1. CARGAR PRODUCTOS DESDE GOOGLE SHEETS
       ================================================== */

    try{

        await cargarProductos();

        console.log(
            "Productos cargados desde Google Sheets."
        );

    }

    catch(error){

        console.error(
            "Error cargando productos:",
            error
        );

    }


    /* ==================================================
       2. CARGAR CATEGORÍAS
       ================================================== */

    try{

        await cargarCategorias();

        console.log(
            "Categorías cargadas correctamente."
        );

    }

    catch(error){

        console.error(
            "Error cargando categorías:",
            error
        );

    }


    /* ==================================================
       3. MOSTRAR CATEGORÍAS
       ================================================== */

    try{

        mostrarCategorias();

    }

    catch(error){

        console.error(
            "Error mostrando categorías:",
            error
        );

    }


    /* ==================================================
       4. MOSTRAR PRODUCTOS
       ================================================== */

    try{

        mostrarProductos();

    }

    catch(error){

        console.error(
            "Error mostrando productos:",
            error
        );

    }


    /* ==================================================
       5. ACTUALIZAR CONTADOR DEL CARRITO
       ================================================== */

    try{

        actualizarContador();

    }

    catch(error){

        console.error(
            "Error actualizando contador:",
            error
        );

    }


    /* ==================================================
       6. DIBUJAR CARRITO
       ================================================== */

    try{

        dibujarCarrito();

    }

    catch(error){

        console.error(
            "Error dibujando carrito:",
            error
        );

    }


    /* ==================================================
       7. INICIAR PANEL DEL CARRITO
       ================================================== */

    try{

        iniciarPanelCarrito();

    }

    catch(error){

        console.error(
            "Error iniciando panel del carrito:",
            error
        );

    }


    /* ==================================================
       8. INICIAR BUSCADOR
       ================================================== */

    try{

        iniciarBuscador();

    }

    catch(error){

        console.error(
            "Error iniciando buscador:",
            error
        );

    }


    /* ==================================================
       9. INICIAR WHATSAPP
       ================================================== */

    try{

        iniciarWhatsApp();

    }

    catch(error){

        console.error(
            "Error iniciando WhatsApp:",
            error
        );

    }


    /* ==================================================
       10. ACTUALIZAR PRECIOS DEL CARRITO
       ==================================================

       IMPORTANTE:

       Ahora que Google Sheets ya está cargado,
       podemos comprobar que los precios guardados
       en el carrito corresponden con los precios
       actuales del catálogo.
    */

    try{

        actualizarPreciosCarrito();

    }

    catch(error){

        console.error(
            "Error actualizando precios del carrito:",
            error
        );

    }


    /* ==================================================
       FIN
       ================================================== */

    console.log(
        "======================================"
    );

    console.log(
        "WEB PELUDITOS INICIADA CORRECTAMENTE"
    );

    console.log(
        "======================================"

    );

}