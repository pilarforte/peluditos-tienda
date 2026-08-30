/* ======================================================
   CATEGORÍAS - GOOGLE SHEETS
====================================================== */

const URL_GOOGLE_CATEGORIAS =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vT7rDaqU4bNpEm7QHNhFRESMraBJKoQNN_1PwmqJabVg8-_pPgEUHWoLKF64vF-oXdXy5nl6wPJLydb/pub?gid=746967435&single=true&output=csv";


/* ======================================================
   CARGAR CATEGORÍAS
====================================================== */

async function cargarCategorias(){

    try{

        console.log(
            "Cargando categorías..."
        );

        const respuesta =
            await fetch(
                URL_GOOGLE_CATEGORIAS
            );

        if(!respuesta.ok){

            throw new Error(
                "Error HTTP " +
                respuesta.status
            );

        }

        const csv =
            await respuesta.text();

        console.log(
            "CSV categorías:",
            csv
        );

        const categoriasSheets =
            convertirCategoriasCSV(csv);

        console.log(
            "Categorías detectadas:",
            categoriasSheets
        );

        if(
            categoriasSheets.length === 0
        ){

            throw new Error(
                "No hay categorías válidas"
            );

        }

        categorias.length = 0;

        /*
        ============================================
        CATEGORÍA TODOS
        ============================================
        */

        categorias.push({

            id: 0,

            nombre: "Todos",

            icono:
                "fa-solid fa-border-all"

        });

        /*
        ============================================
        AÑADIR CATEGORÍAS DE SHEETS
        ============================================
        */

        categoriasSheets.forEach(
            categoria => {

                categorias.push(
                    categoria
                );

            }
        );

        mostrarCategorias();

    }
    catch(error){

        console.error(
            "Error cargando categorías:",
            error
        );

        console.log(
            "Se mantienen las categorías locales."
        );

    }

}


/* ======================================================
   CONVERTIR CSV
====================================================== */

function convertirCategoriasCSV(csv){

    const filas =
        csv.trim().split("\n");

    if(filas.length <= 1){

        return [];

    }

    const resultado = [];

    for(
        let i = 1;
        i < filas.length;
        i++
    ){

        const columnas =
            separarCSV(filas[i]);

        if(columnas.length < 4){

            continue;

        }

        const categoria = {

            id:
                Number(
                    columnas[0].trim()
                ),

            nombre:
                columnas[1].trim(),

            icono:
                columnas[2].trim(),

            activo:
                columnas[3]
                .trim()
                .toUpperCase() === "SI"

        };

        if(
            categoria.id &&
            categoria.nombre &&
            categoria.activo
        ){

            resultado.push(
                categoria
            );

        }

    }

    return resultado;

}