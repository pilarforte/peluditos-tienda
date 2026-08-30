/* ======================================================
   PRODUCTOS - PELUDITOS
   GOOGLE SHEETS
====================================================== */


/* ======================================================
   URL DE GOOGLE SHEETS
====================================================== */

const URL_GOOGLE_SHEETS =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vT7rDaqU4bNpEm7QHNhFRESMraBJKoQNN_1PwmqJabVg8-_pPgEUHWoLKF64vF-oXdXy5nl6wPJLydb/pub?gid=0&single=true&output=csv";


/* ======================================================
   CARGAR PRODUCTOS
====================================================== */

async function cargarProductos(){

    try{

        console.log(
            "Cargando productos desde Google Sheets..."
        );


        const respuesta =
            await fetch(
                URL_GOOGLE_SHEETS + "&t=" + Date.now()
            );


        if(!respuesta.ok){

            throw new Error(
                "Google Sheets ha respondido con HTTP " +
                respuesta.status
            );

        }


        const csv =
            await respuesta.text();


        console.log(
            "CSV recibido:"
        );

        console.log(csv);


        const productosSheets =
            convertirCSV(csv);


        console.log(
            "Productos detectados:",
            productosSheets
        );


        if(productosSheets.length === 0){

            throw new Error(
                "Google Sheets no contiene productos válidos"
            );

        }


        /*
        ==============================================
        VACIAR PRODUCTOS LOCALES
        ==============================================
        */

        productos.length = 0;


        /*
        ==============================================
        CARGAR PRODUCTOS
        ==============================================
        */

        productosSheets.forEach(
            producto => {

                productos.push(
                    producto
                );

            }
        );


        console.log(
            "Productos cargados correctamente:",
            productos
        );


        /*
        ==============================================
        ACTUALIZAR CATÁLOGO
        ==============================================
        */

        if(typeof actualizarCatalogo === "function"){

            actualizarCatalogo();

        }


        /*
        ==============================================
        ACTUALIZAR CARRITO
        ==============================================
        */

        if(typeof actualizarPreciosCarrito === "function"){

            actualizarPreciosCarrito();

        }

    }


    catch(error){

        console.error(
            "Error cargando Google Sheets:",
            error
        );

        console.log(
            "Se mantienen los productos locales."
        );

    }

}


/* ======================================================
   CONVERTIR CSV
====================================================== */

function convertirCSV(csv){

    /*
    Normalizar saltos de línea
    */

    const texto =
        csv
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
            .trim();


    if(!texto){

        return [];

    }


    /*
    ==============================================
    SEPARAR FILAS RESPETANDO COMILLAS
    ==============================================
    */

    const filas =
        separarFilasCSV(texto);


    if(filas.length <= 1){

        return [];

    }


    const productosCSV = [];


    /*
    ==============================================
    RECORRER PRODUCTOS
    ==============================================
    */

    for(
        let i = 1;
        i < filas.length;
        i++
    ){

        const columnas =
            separarCSV(
                filas[i]
            );


        if(columnas.length < 9){

            console.warn(
                "Fila ignorada:",
                filas[i]
            );

            continue;

        }


        const producto = {

            /*
            ID
            */

            id:
                Number(
                    (columnas[0] || "").trim()
                ),


            /*
            NOMBRE
            */

            nombre:
                (columnas[1] || "").trim(),


            /*
            DESCRIPCIÓN
            */

            descripcion:
                (columnas[2] || "").trim(),


            /*
            PRECIOS
            */

            precio:
                convertirPrecios(
                    columnas[3] || ""
                ),


            /*
            PRECIOS OFERTA

            IMPORTANTE:
            conserva los huecos.

            Ejemplo:

            8||35

            se convierte en:

            [8, null, 35]

            */

            precioOferta:
                convertirPreciosOferta(
                    columnas[4] || ""
                ),


            /*
            CATEGORÍA
            */

            categoria:
                Number(
                    (columnas[5] || "").trim()
                ),


            /*
            IMAGEN
            */

            imagen:
                construirRutaImagen(
                    (columnas[6] || "").trim()
                ),


            /*
            ACTIVO
            */

            activo:
                (columnas[7] || "")
                    .trim()
                    .toUpperCase() === "SI",


            /*
            OFERTA
            */

            oferta:
                (columnas[8] || "")
                    .trim()
                    .toUpperCase() === "SI",


            /*
            MARCA
            */

            marca:
                columnas[9]
                    ? columnas[9].trim()
                    : "",


            /*
            PESOS
            */

            peso:
                convertirPesos(
                    columnas[10] || ""
                ),


            /*
            CÓDIGO DE BARRAS
            */

            codigoBarras:
                columnas[11]
                    ? columnas[11].trim()
                    : ""

        };


        /*
        ==============================================
        SOLO PRODUCTOS VÁLIDOS Y ACTIVOS
        ==============================================
        */

        if(
            producto.id &&
            producto.nombre &&
            producto.activo
        ){

            productosCSV.push(
                producto
            );

        }

    }


    return productosCSV;

}


/* ======================================================
   SEPARAR FILAS CSV
====================================================== */

function separarFilasCSV(texto){

    const filas = [];

    let fila = "";

    let dentroComillas = false;


    for(
        let i = 0;
        i < texto.length;
        i++
    ){

        const caracter =
            texto[i];


        if(caracter === '"'){

            /*
            Comillas dobles escapadas
            */

            if(
                dentroComillas &&
                texto[i + 1] === '"'
            ){

                fila += '""';

                i++;

                continue;

            }


            dentroComillas =
                !dentroComillas;


            fila += caracter;

            continue;

        }


        /*
        Salto de línea fuera de comillas
        */

        if(
            caracter === "\n" &&
            !dentroComillas
        ){

            filas.push(
                fila
            );

            fila = "";

        }

        else{

            fila += caracter;

        }

    }


    if(fila.trim() !== ""){

        filas.push(
            fila
        );

    }


    return filas;

}


/* ======================================================
   CONVERTIR PESOS
====================================================== */

function convertirPesos(valor){

    if(!valor){

        return [];

    }


    return valor
        .trim()
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


/* ======================================================
   CONVERTIR PRECIOS
====================================================== */

function convertirPrecios(valor){

    if(!valor){

        return [];

    }


    return valor
        .trim()
        .split("|")
        .map(
            precio => {

                const numero =
                    Number(
                        precio
                            .trim()
                            .replace(",", ".")
                    );


                return numero;

            }
        )
        .filter(
            precio =>
                !isNaN(precio)
        );

}


/* ======================================================
   CONVERTIR PRECIOS DE OFERTA
====================================================== */

function convertirPreciosOferta(valor){

    if(!valor){

        return [];

    }


    /*
    IMPORTANTE:

    NO usamos filter() aquí.

    Si tenemos:

    8||35

    obtenemos:

    [8, null, 35]

    Esto mantiene cada oferta
    asociada a su peso.
    */

    return valor
        .trim()
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


/* ======================================================
   SEPARAR COLUMNAS CSV
====================================================== */

function separarCSV(linea){

    const resultado = [];

    let campo = "";

    let dentroComillas = false;


    for(
        let i = 0;
        i < linea.length;
        i++
    ){

        const caracter =
            linea[i];


        /*
        ==============================================
        COMILLAS
        ==============================================
        */

        if(caracter === '"'){

            if(
                dentroComillas &&
                linea[i + 1] === '"'
            ){

                campo += '"';

                i++;

                continue;

            }


            dentroComillas =
                !dentroComillas;


            continue;

        }


        /*
        ==============================================
        COMA
        ==============================================
        */

        if(
            caracter === "," &&
            !dentroComillas
        ){

            resultado.push(
                campo
            );

            campo = "";

        }

        else{

            campo += caracter;

        }

    }


    resultado.push(
        campo
    );


    return resultado;

}


/* ======================================================
   CONSTRUIR RUTA DE IMAGEN
====================================================== */

function construirRutaImagen(nombre){

    if(!nombre){

        return "";

    }


    /*
    URL EXTERNA
    */

    if(
        nombre.startsWith("http://") ||
        nombre.startsWith("https://")
    ){

        return nombre;

    }


    /*
    IMAGEN LOCAL
    */

    return "img/productos/" + nombre;

}