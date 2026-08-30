/* ======================================================
   WHATSAPP - PELUDITOS
====================================================== */

const TELEFONO_WHATSAPP = "34615300815";


/* ======================================================
   OBTENER DATOS DEL CLIENTE
====================================================== */

function obtenerDatosCliente(){

    return {

        nombre:
            document.getElementById("clienteNombre")?.value.trim() || "",

        telefono:
            document.getElementById("clienteTelefono")?.value.trim() || "",

        direccion:
            document.getElementById("clienteDireccion")?.value.trim() || "",

        codigoPostal:
            document.getElementById("clienteCodigoPostal")?.value.trim() || "",

        localidad:
            document.getElementById("clienteLocalidad")?.value.trim() || "",

        entrega:
            document.getElementById("clienteEntrega")?.value || ""

    };

}


/* ======================================================
   VALIDAR DATOS
====================================================== */

function validarDatosCliente(){

    const datos =
        obtenerDatosCliente();


    if(!datos.nombre){

        alert(
            "Por favor, introduce tu nombre y apellidos."
        );

        document
            .getElementById("clienteNombre")
            ?.focus();

        return false;

    }


    if(!datos.telefono){

        alert(
            "Por favor, introduce tu teléfono."
        );

        document
            .getElementById("clienteTelefono")
            ?.focus();

        return false;

    }


    if(!datos.entrega){

        alert(
            "Por favor, selecciona cómo quieres recibir tu pedido."
        );

        document
            .getElementById("clienteEntrega")
            ?.focus();

        return false;

    }


    /* ==================================================
       ENVÍO A DOMICILIO
    ================================================== */

    if(
        datos.entrega === "Envío a domicilio"
    ){

        if(!datos.direccion){

            alert(
                "Para el envío a domicilio necesitamos tu dirección."
            );

            document
                .getElementById("clienteDireccion")
                ?.focus();

            return false;

        }


        if(!datos.codigoPostal){

            alert(
                "Para el envío a domicilio necesitamos tu código postal."
            );

            document
                .getElementById("clienteCodigoPostal")
                ?.focus();

            return false;

        }


        if(!datos.localidad){

            alert(
                "Para el envío a domicilio necesitamos tu localidad."
            );

            document
                .getElementById("clienteLocalidad")
                ?.focus();

            return false;

        }

    }


    return true;

}


/* ======================================================
   CREAR MENSAJE
====================================================== */

function crearMensajeWhatsApp(){

    if(carrito.length === 0){

        return null;

    }


    const datos =
        obtenerDatosCliente();


    let mensaje =
        "Hola Peluditos \n\n" +

        "Quiero hacer el siguiente pedido:\n\n";


    let total = 0;


    /* ==================================================
       PRODUCTOS
    ================================================== */

    carrito.forEach(producto => {


        const subtotal =
            producto.precio *
            producto.cantidad;


        total +=
            subtotal;


        /*
        ==============================================
        PRODUCTO
        ==============================================
        */

        mensaje +=

            producto.nombre +
            "\n";


        /*
        ==============================================
        PESO / FORMATO
        ==============================================
        */

        if(
            producto.peso &&
            producto.peso.toString().trim() !== ""
        ){

            mensaje +=

                "Formato: " +
                producto.peso +
                "\n";

        }


        /*
        ==============================================
        CANTIDAD
        ==============================================
        */

        mensaje +=

            "Cantidad: " +
            producto.cantidad +
            "\n";


        /*
        ==============================================
        PRECIO
        ==============================================
        */

        mensaje +=

            "Precio unidad: " +
            producto.precio.toFixed(2) +
            " €\n";


        /*
        ==============================================
        SUBTOTAL
        ==============================================
        */

        mensaje +=

            "Subtotal: " +
            subtotal.toFixed(2) +
            " €\n\n";

    });


    /* ==================================================
       TOTAL
    ================================================== */

    mensaje +=

        "━━━━━━━━━━━━━━━━━━\n" +

        "TOTAL PRODUCTOS: " +

        total.toFixed(2) +

        " €\n" +

        "━━━━━━━━━━━━━━━━━━\n\n";


    /* ==================================================
       DATOS CLIENTE
    ================================================== */

    mensaje +=

        "DATOS DEL CLIENTE\n\n" +

        "Nombre: " +
        datos.nombre +
        "\n" +

        "Teléfono: " +
        datos.telefono +
        "\n";


    /* ==================================================
       DIRECCIÓN
    ================================================== */

    if(datos.direccion){

        mensaje +=

            "Dirección: " +
            datos.direccion +
            "\n";

    }


    if(datos.codigoPostal){

        mensaje +=

            "Código postal: " +
            datos.codigoPostal +
            "\n";

    }


    if(datos.localidad){

        mensaje +=

            "Localidad: " +
            datos.localidad +
            "\n";

    }


    /* ==================================================
       ENTREGA
    ================================================== */

    mensaje +=

        "\n ENTREGA\n" +

        datos.entrega +

        "\n\n";


    /* ==================================================
       AVISO
    ================================================== */

    mensaje +=

        "AVISO\n" +

        "El importe mostrado es orientativo. " +

        "En los pedidos con envío a domicilio puede " +

        "aplicarse un cargo adicional dependiendo de " +

        "la zona y del tipo de envío.\n\n";


    /* ==================================================
       CONFIRMACIÓN
    ================================================== */

    mensaje +=

        "Este mensaje es una solicitud de pedido.\n" +

        "El pedido quedará pendiente de confirmación " +

        "por parte del equipo de Peluditos.\n\n" +

        "¡Gracias!";


    return mensaje;

}


/* ======================================================
   ENVIAR POR WHATSAPP
====================================================== */

function enviarWhatsApp(){

    if(carrito.length === 0){

        alert(
            "Tu pedido está vacío."
        );

        return;

    }


    /* ==================================================
       COMPROBAR DATOS
    ================================================== */

    if(!validarDatosCliente()){

        return;

    }


    /* ==================================================
       GUARDAR DATOS
    ================================================== */

    if(
        typeof guardarDatosCliente === "function"
    ){

        guardarDatosCliente();

    }


    /* ==================================================
       CREAR MENSAJE
    ================================================== */

    const mensaje =
        crearMensajeWhatsApp();


    if(!mensaje){

        return;

    }


    /* ==================================================
       ABRIR WHATSAPP
    ================================================== */

    const url =

        "https://wa.me/" +

        TELEFONO_WHATSAPP +

        "?text=" +

        encodeURIComponent(
            mensaje
        );


    window.open(
        url,
        "_blank"
    );

}


/* ======================================================
   INICIAR BOTÓN WHATSAPP
====================================================== */

function iniciarWhatsApp(){

    const boton =
        document.getElementById(
            "btnWhatsapp"
        );


    if(!boton){

        return;

    }


    boton.addEventListener(
        "click",
        enviarWhatsApp
    );

}


/* ======================================================
   COPIAR PEDIDO
====================================================== */

async function copiarPedido(){


    /* ==================================================
       COMPROBAR CARRITO
    ================================================== */

    if(carrito.length === 0){

        alert(
            "Tu pedido está vacío."
        );

        return;

    }


    /* ==================================================
       COMPROBAR DATOS
    ================================================== */

    if(!validarDatosCliente()){

        return;

    }


    /* ==================================================
       GUARDAR DATOS
    ================================================== */

    if(
        typeof guardarDatosCliente === "function"
    ){

        guardarDatosCliente();

    }


    /* ==================================================
       CREAR MENSAJE
    ================================================== */

    const mensaje =
        crearMensajeWhatsApp();


    if(!mensaje){

        return;

    }


    /* ==================================================
       COPIAR
    ================================================== */

    try{

        await navigator.clipboard.writeText(
            mensaje
        );


        alert(

            "Pedido copiado correctamente.\n\n" +

            "Ahora puedes abrir WhatsApp y " +

            "pegar el mensaje para enviarlo."

        );


    }

    catch(error){

        console.error(
            "Error copiando el pedido:",
            error
        );


        /* ==================================================
           MÉTODO ALTERNATIVO
        ================================================== */

        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            mensaje;


        textarea.style.position =
            "fixed";


        textarea.style.left =
            "-9999px";


        document.body.appendChild(
            textarea
        );


        textarea.select();


        try{

            document.execCommand(
                "copy"
            );


            alert(

                "Pedido copiado correctamente.\n\n" +

                "Ahora puedes abrir WhatsApp y " +

                "pegar el mensaje para enviarlo."

            );

        }

        catch(errorAlternativo){

            alert(

                "No hemos podido copiar el pedido automáticamente. " +

                "Puedes seleccionar y copiar el texto manualmente."

            );

        }


        document.body.removeChild(
            textarea
        );

    }

}


/* ======================================================
   INICIAR BOTÓN COPIAR
====================================================== */

function iniciarCopiarPedido(){

    const boton =
        document.getElementById(
            "btnCopiarPedido"
        );


    if(!boton){

        return;

    }


    boton.addEventListener(
        "click",
        copiarPedido
    );

}


/* ======================================================
   INICIAR
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        iniciarWhatsApp();

        iniciarCopiarPedido();

    }
);