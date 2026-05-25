
/**
 * Normaliza una ruta en string a un array de segmentos.
 * - Elimina espacios extra
 * - Quita slashes iniciales/finales
 * - Filtra segmentos vacíos
 */
function splitPath(path) {
    if (typeof path !== 'string') return [];
    return path
        .trim()
        .replace(/^\/+|\/+$/g, '') // quita / al inicio/fin
        .split('/')
        .filter(Boolean);
}

function addPaths(acc, ...paths) {
    if (!acc || typeof acc !== 'object') acc = {};

    for (const raw of paths) {
        const parts = splitPath(raw);
        parts.forEach((segment, idx) => {
            const key = `nv${idx + 1}`;
            if (!acc[key]) acc[key] = [];
            if (!acc[key].includes(segment)) {
                acc[key].push(segment);
            }
        });
    }
    return acc;
}

/**
 * Crea un acumulador nuevo a partir de rutas.
 * Útil si quieres construir desde cero en una sola llamada.
 */
export function buscador(data, globalFilter) {
    if (!globalFilter) return [...data];
    const filterValue = globalFilter.toLowerCase().trim();
    // const fields = getDynamicFilterFields(data);
    // console.log("65", filterValue, fields, data);
    let resultado = []
    data.forEach(e => {
        let objT = limpiarCaracteres(JSON.stringify(e), { caracteresAConservar: [" ", "$", "%", "-", ":", "/", "?", "=", "_"] })
        if (objT.toLowerCase().includes(filterValue)) {
            resultado.push(e)
        }
    });
    // console.log("73", resultado);
    return resultado
};
export function cortarTexto(texto, maxCaracteres) {
    if (typeof texto !== "string") return texto;
    return texto.length > maxCaracteres
        ? texto.slice(0, maxCaracteres)
        : texto;
}
export function construirNiveles(...paths) {
    return addPaths({}, ...paths);
}
export function aprovarRespuesta(obj) {
    let valido = false
    if (obj.faltante.length == 0 && obj.tiposErroneos.length == 0) {
        valido = true
    }
    return valido
}
export function validarPermisos(permisos, id) {
    let permisovalido = false
    permisos?.map((e) => {
        if (e.id == id) {
            permisovalido = true
        }
    })
    return permisovalido
}
export function generarRandom(longitud = 10) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';

    for (let i = 0; i < longitud; i++) {
        const index = Math.floor(Math.random() * caracteres.length);
        resultado += caracteres[index];
    }

    return resultado;
}
export function agregarCero(numero) {
    return numero < 10 ? '0' + numero : String(numero);
}

export function obtenerDiaSemana(fecha) {
    const dias = [
        "domingo",
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado"
    ];
    const [year, month, day] = fecha.split("-");
    const fechaObj = new Date(year, month - 1, day);
    return dias[fechaObj.getDay()];
}
export function cumplioEstructura(obj) {
    let valido = true
    let re = obj.report
    const llaves = Object.keys(re)
    llaves.forEach(e => {
        if (re.tiposErroneos.length > 0 || re.faltante.length > 0) {
            valido = false
        }
    });
    return valido
}
export function validarEstructura(
    template,
    data,
    options = { mode: 'omit-missing', strictTypes: true, reportExtras: true }
) {
    const opts = {
        mode: 'omit-missing',
        strictTypes: false,
        reportExtras: false,
        ...options,
    };

    const report = {
        faltante: [],
        tiposErroneos: [],
        extras: [],
        vacios: [], // 👈 NUEVO
    };

    const isPlainObject = (v) =>
        Object.prototype.toString.call(v) === '[object Object]';

    const typeOf = (v) => (Array.isArray(v) ? 'array' : typeof v);

    const isVacio = (v) =>
        v === null || v === undefined || v === '' || v === 0;

    const pushMissing = (path) => report.faltante.push(path);
    const pushTypeMismatch = (path, expected, actual) =>
        report.tiposErroneos.push({ path, expected, actual });
    const pushExtra = (path) => report.extras.push(path);
    const pushVacio = (path) => report.vacios.push(path); // 👈 NUEVO

    function walk(tpl, val, path) {

        // =====================
        // ARRAY
        // =====================
        if (Array.isArray(tpl)) {
            if (!Array.isArray(val)) {
                pushMissing(path);
                return opts.mode === 'keep-missing' ? tpl.slice() : undefined;
            }

            if (tpl.length === 0) {
                return val.slice();
            }

            const itemTpl = tpl[0];
            const out = [];

            for (let i = 0; i < val.length; i++) {
                const vItem = val[i];
                const child = walk(itemTpl, vItem, `${path}[${i}]`);

                if (child !== undefined) {
                    out.push(child);
                }
            }

            return out;
        }

        // =====================
        // OBJECT
        // =====================
        if (isPlainObject(tpl)) {
            if (!isPlainObject(val)) {
                pushMissing(path);
                return opts.mode === 'keep-missing' ? { ...tpl } : undefined;
            }

            const out = {};

            for (const key of Object.keys(tpl)) {
                const child = walk(
                    tpl[key],
                    val[key],
                    path ? `${path}.${key}` : key
                );

                if (child !== undefined) {
                    out[key] = child;
                } else if (opts.mode === 'keep-missing') {
                    out[key] = tpl[key];
                }
            }

            if (opts.reportExtras) {
                for (const key of Object.keys(val)) {
                    if (!(key in tpl)) {
                        pushExtra(path ? `${path}.${key}` : key);
                    }
                }
            }

            if (Object.keys(out).length === 0 && opts.mode === 'omit-missing') {
                return undefined;
            }

            return out;
        }

        // =====================
        // HOJA (VALOR FINAL)
        // =====================
        if (val === undefined) {
            pushMissing(path);
            return opts.mode === 'keep-missing' ? tpl : undefined;
        }

        // 👇 NUEVO: detectar vacíos
        if (isVacio(val)) {
            pushVacio(path);
        }

        if (opts.strictTypes && tpl !== null) {
            const expected = typeOf(tpl);
            const actual = typeOf(val);

            if (expected !== actual) {
                pushTypeMismatch(path, expected, actual);
                return opts.mode === 'keep-missing' ? tpl : undefined;
            }
        }

        return val;
    }

    const value = walk(template, data, '');

    const stripLeadingDot = (s) => (s.startsWith('.') ? s.slice(1) : s);

    report.faltante = report.faltante.map(stripLeadingDot);
    report.tiposErroneos = report.tiposErroneos.map((e) => ({
        ...e,
        path: stripLeadingDot(e.path),
    }));
    report.extras = report.extras.map(stripLeadingDot);
    report.vacios = report.vacios.map(stripLeadingDot); // 👈 NUEVO

    return { value, report };
}


export function convertirNiveles(obj) {
    const resultado = {};

    Object.entries(obj).forEach(([key, arr]) => {
        // arr = ["copy", "elektra", ...]
        resultado[key] = arr.map((item) => ({
            name: camelATexto(item),
            value: item
        }));
    });

    return resultado;
}
export function PrimeraMayuscula(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function camelATexto(str) {
    if (!str) return "";

    // Reemplaza transiciones mayúscula → espacio + minúscula
    const texto = str
        .replace(/([a-z])([A-Z])/g, "$1 $2")     // separa: paidMedia → paid Media
        .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2") // separa siglas: pMax → p Max
        .toLowerCase();

    // Primera letra en mayúscula
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}
export function mostrarJSON(json, contenedorId) {
    let objeto;

    // Si viene como string, intentamos parsearlo
    if (typeof json === "string") {
        try {
            objeto = JSON.parse(json);
        } catch (e) {
            document.getElementById(contenedorId).innerText = "JSON inválido";
            return;
        }
    } else {
        objeto = json;
    }

    // Convertir a texto formateado
    const jsonFormateado = JSON.stringify(objeto, null, 2);

    // Mostrar como texto (respeta formato)
    document.getElementById(contenedorId).innerText = jsonFormateado;
}

export function convertirCamelCase(str) {
    return str
        .toLowerCase()
        .trim()
        .split(/\s+/)                 // separa por uno o más espacios
        .map((word, index) => {
            if (index === 0) return word;                 // primera palabra en minúsculas
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join('');
}

export function logE({ mensaje = [], env = "", donde = "" } = {}) {
    if (env === "todos" && env !== "ninguno") {
        // Imprime cada elemento de forma natural (string, number, object, array, etc.)
        console.group(`LOG - ${donde}`);
        mensaje.forEach((e, i) => {
            console.log(`${i + 1}.-`, e);
        });
        console.groupEnd();
    } else {
        return false;
    }
}


export function RepetirDiv({ veces }) {
    return (
        <div>
            {[...Array(veces)].map((_, i) => (
                <div key={i}>Este es el div #{i + 1}</div>
            ))}
        </div>
    );
}
// import { RepetirDiv } from '@/js/scrips';
//Se ocupa asi{/* <RepetirDiv veces={15} /> */}
export const scrollToForm = (tipo) => {
    // console.log(tipo);
    const container = document.getElementById('acciones'); // contenedor de formularios
    const containerTablas = document.getElementById('tablas'); // contenedor de tablas
    const element = document.getElementById(`formulario${tipo}`);
    const elementTablas = document.getElementById(`tabla-${tipo}`);
    // console.log(element.offsetTop);
    if (container && element) {
        if (elementTablas?.offsetTop !== undefined) {
            container.scrollTo({
                top: element?.offsetTop - container?.offsetTop,
                behavior: 'smooth'
            });
            containerTablas.scrollTo({
                top: elementTablas?.offsetTop - containerTablas?.offsetTop - 125,
                behavior: 'smooth'
            });
        }
    }
};
export function formDataTieneContenido(formData) {
    for (let pair of formData.entries()) {
        if (pair[1]) {
            return true;
        }
    }
    return false;
}
export function validarArchivo({ archivos = [], extensiones = [] } = {}) {

    const extensionesValidas = extensiones.map(e => e.toLowerCase())

    const invalidos = archivos.filter(file => {

        if (!file?.name) return true

        const extension = file.name
            .split(".")
            .pop()
            ?.toLowerCase()

        return !extensionesValidas.includes(extension)
    })

    return {
        valido: invalidos.length === 0,
        invalidos
    }
}
export function ejecutarPeticionesParalelas(arr, acciones, condicion) {
    arr.forEach(async (p, i) => {
        try {
            let result = await p;
            // console.log(`✅ Petición ${i + 1} lista:`, result);
            if (Array.isArray(acciones) && typeof acciones[i] === "function") {
                acciones[i]({ resultado: result, mensaje: `✅ Petición ${i + 1} lista:`, respuesta: i });
            }
        } catch (err) {
            console.error(`❌ Petición ${i + 1} falló`, err);
        }
    });
    // console.log("termino 13:");
}
export function obtenerMimeType(nombreArchivo) {
    const extension = nombreArchivo.split('.').pop().toLowerCase();
    const tipos = {
        pdf: 'application/pdf',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        zip: 'application/zip',
        txt: 'text/plain',
        json: 'application/json',
        pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    };
    return tipos[extension] || 'application/octet-stream'; // por defecto
}
export function descargarArchivos(datos, completo) {
    // console.log("37", datos);
    // let mime = obtenerMimeType(completo !== undefined ? completo : nombre + extension)
    // const blob = new Blob([datos], { type: mime });
    const blobUrl = URL.createObjectURL(datos);
    // console.log("39", blobUrl);
    // Crear link de descarga y apuntar al Blob URL
    const link = document.createElement("a");
    // link.title = "prueba"
    link.href = blobUrl;
    link.download = completo;
    document.body.appendChild(link);

    // Ejecutar el evento click del enlace creado anteriormente
    // Es necesario hacerlo de esta manera porque en Firefox link.click() no funciona
    link.dispatchEvent(
        new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        })
    );
    // Eliminar el link del DOM
    document.body.removeChild(link);
}
export function limpiarCaracteres(texto, { caracteresAConservar = [] } = {}) {
    texto = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let resultado = '';
    for (let i = 0; i < texto.length; i++) {
        const caracter = texto[i];
        if (caracteresAConservar.includes(caracter) || /[a-zA-Z0-9]/.test(caracter)) {
            resultado += caracter;
        }
    }
    return resultado;
}
export function obtenerIdsArreglo(array, key, type) {
    return array.map(item => {
        const valor = item[key];
        switch (type) {
            case 'string':
                return String(valor);
            case 'int':
                return parseInt(valor, 10);
            case 'float':
                return parseFloat(valor);
            default:
                return valor; // Si no se especifica un tipo válido, se devuelve tal cual
        }
    });
}
export function sonObjetosIguales(obj1, obj2) {
    // Si los objetos son exactamente la misma referencia, son iguales.
    if (obj1 === obj2) {
        return true;
    }

    // Si alguno no es un objeto o es nulo, no son iguales (ya que no son la misma referencia).
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }

    // Obtener las claves de ambos objetos.
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Si el número de claves es diferente, no son iguales.
    if (keys1.length !== keys2.length) {
        return false;
    }

    // Iterar sobre las claves del primer objeto.
    for (const key of keys1) {
        // Si la clave no existe en el segundo objeto, no son iguales.
        if (!keys2.includes(key)) {
            return false;
        }

        // Comparar los valores de las claves. Si el valor es un objeto, recursivamente comparar.
        if (!sonObjetosIguales(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}

export function compararYEliminarDuplicados(arr1, arr2, claveComparacion) {
    // console.log("arr1:", JSON.stringify(arr1, null, 2));
    // console.log("arr2:", JSON.stringify(arr2, null, 2));
    // console.log("claveComparacion:", claveComparacion);

    const obtenerValorPorRuta = (obj, path) => {
        if (!obj || typeof obj !== 'object' || typeof path !== 'string' || path === '') {
            // console.warn("Entrada inválida para obtenerValorPorRuta:", { obj, path });
            return undefined;
        }
        const valor = path.split('.').reduce((current, key) => {
            return current && typeof current === 'object' ? current[key] : undefined;
        }, obj);
        // console.log(`Valor extraído para ${path} en objeto ${JSON.stringify(obj)}:`, valor);
        return valor;
    };

    // Crear un Set con los valores de claveComparacion de arr2
    const valoresArr2 = new Set();
    for (const item of arr2) {
        const valor = obtenerValorPorRuta(item, claveComparacion);
        if (valor !== undefined) {
            valoresArr2.add(valor);
        }
    }
    // console.log("valoresArr2:", valoresArr2);

    // Filtrar arr1 para conservar solo los elementos cuyos claveComparacion no están en arr2
    const resultado = arr1.filter(item => {
        const valor = obtenerValorPorRuta(item, claveComparacion);
        return valor === undefined || !valoresArr2.has(valor);
    });

    // console.log("Resultado filtrado:", JSON.stringify(resultado, null, 2));
    return resultado;
}
export function unificarComboNiveles(obj, idList, limpiar, labelList) {
    let arr = []
    let objs = {}
    obj.filter(e => {
        let id = ""
        let nombre = ""
        if (labelList !== undefined) {
            // console.log(f);
            idList.forEach(f => {
                id = id + e[f].id + "-"

            });
            labelList.forEach(f => {
                nombre = nombre + e[f].nombre + "-"
            });
        } else {
            idList.forEach(f => {
                id = id + e[f].id + "-"
                nombre = nombre + e[f].nombre + "-"
            });
        }
        objs.id = id.substring(0, id.length - 1)
        objs.nombre = nombre.substring(0, nombre.length - 1)
        let dato = JSON.stringify(objs)
        arr.push(JSON.parse(dato))
    })
    if (limpiar !== undefined) {
        let text = []
        let normal = []
        arr.forEach(e => {
            text.push(JSON.stringify(e))
        });
        const dataArr = new Set(text);
        let result = [...dataArr];
        result.forEach(e => {
            normal.push(JSON.parse(e))
        });
        arr = normal
    }
    return arr
}
export function UnificarNiveles(data, { llave = "empresas", niveles = 4 } = {}) {
    let unificado = []
    let obj = {}
    return UnificarHijos(data, obj, unificado, { key: llave, niveles: niveles })
}
export function UnificarHijos(data, obj, arr, { key = "", niveles = 0 } = {}) {
    data.forEach(e => {
        let keys = Object.keys(e)
        let counter = 0
        keys.forEach((f, g) => {
            let ke = key !== "" ? key : f
            if (Array.isArray(e[f])) {
                obj = { ...obj, [ke]: e }
                UnificarHijos(e[f], obj, arr, { key: f, niveles: niveles })
                counter++
            }
            if (counter == 0) {
                if (g == 0) {
                    obj = { ...obj, [ke]: e, id: e.id }
                    if (niveles == Object.keys(obj).length) {
                        arr.push(obj)
                    }
                }
            }
        })

    })
    return arr
}
export function separarPorNiveles(data, idKey = 'id', nivelKeys = ['empresa', 'negocio', 'producto']) {
    // Convertir data a array si no lo es
    const datos = Array.isArray(data) ? data : [data];

    // Función auxiliar para copiar objeto sin arreglos de hijos
    const copiarSinArreglosHijos = (obj) => {
        const copy = { ...obj };
        Object.keys(copy).forEach(key => {
            if (Array.isArray(copy[key]) && copy[key].every(item => item && typeof item === 'object')) {
                delete copy[key];
            }
        });
        return copy;
    };

    // Función auxiliar para encontrar arreglos de objetos en un nivel
    const obtenerArreglosHijos = (obj) => {
        return Object.values(obj).filter(
            val => Array.isArray(val) && val.every(item => item && typeof item === 'object')
        );
    };

    // Función recursiva para generar combinaciones de niveles
    const generarCombinaciones = (nivel0, nivelActual = 0, acumulado = {}) => {
        const resultados = [];

        // Guardar el objeto del nivel actual (sin hijos)
        const objetoActual = copiarSinArreglosHijos(nivel0);
        acumulado[nivelKeys[nivelActual]] = objetoActual;

        // Si estamos en el último nivel (producto), agregar el resultado
        if (nivelActual === nivelKeys.length - 1) {
            resultados.push({ ...acumulado });
            return resultados;
        }

        // Obtener los arreglos de hijos para el siguiente nivel
        const arreglosHijos = obtenerArreglosHijos(nivel0);
        if (arreglosHijos.length === 0) {
            // Si no hay hijos, devolver el resultado parcial (si aplica)
            if (nivelActual === 0) {
                return [];
            }
            resultados.push({ ...acumulado });
            return resultados;
        }

        // Iterar sobre el primer arreglo de hijos encontrado
        for (const hijo of arreglosHijos[0]) {
            // Generar combinaciones para el siguiente nivel
            const subResultados = generarCombinaciones(hijo, nivelActual + 1, { ...acumulado });
            resultados.push(...subResultados);
        }

        return resultados;
    };

    // Generar resultados para todos los objetos del nivel raíz
    const resultados = [];
    for (const item of datos) {
        if (!item || typeof item !== 'object') continue;
        resultados.push(...generarCombinaciones(item));
    }

    return resultados;
}
export function buscarPorNiveles(empresasData, visibilidad, idKey = 'id') {
    // Convertir empresasData a array si no lo es
    const empresas = Array.isArray(empresasData) ? empresasData : [empresasData];

    // Función auxiliar para copiar objeto sin arreglos de hijos
    const copiarSinArreglosHijos = (obj) => {
        const copy = { ...obj };
        // Eliminar todas las propiedades que sean arreglos de objetos
        Object.keys(copy).forEach(key => {
            if (Array.isArray(copy[key]) && copy[key].every(item => item && typeof item === 'object')) {
                delete copy[key];
            }
        });
        return copy;
    };

    // Función auxiliar para buscar un objeto por ID en un nivel
    const buscarEnNivel = (data, idToFind, nivelActual, nivelesEsperados) => {
        const idToFindNum = Number(idToFind);
        const items = Array.isArray(data) ? data : [data];

        for (const item of items) {
            if (!item || typeof item !== 'object') continue;

            // Verificar si el objeto actual tiene el ID coincidente
            if (item[idKey] === idToFindNum) {
                // Si es el último nivel esperado, devolver el objeto sin hijos
                if (nivelActual === nivelesEsperados.length - 1) {
                    return copiarSinArreglosHijos(item);
                }
                return item; // Devolver el objeto completo para buscar en el siguiente nivel
            }
        }
        return null;
    };

    // Crear el arreglo de resultados
    const resultado = visibilidad.map((vis) => {
        const ids = [vis.visibilidadID.empresaID, vis.visibilidadID.negocioID, vis.visibilidadID.productoID];
        const niveles = ['empresa', 'negocio', 'producto'];
        let resultadoNivel = {};
        let datosActuales = empresas;

        // Iterar por cada nivel (empresa, negocio, producto)
        for (let i = 0; i < niveles.length; i++) {
            const id = ids[i];
            const nivel = niveles[i];

            // Buscar en el nivel actual
            const encontrado = buscarEnNivel(datosActuales, id, i, niveles);
            if (!encontrado) {
                console.warn(`${nivel} con ID ${id} no encontrado`);
                resultadoNivel[nivel] = { id, error: "No encontrado" };
                break; // Salir si no se encuentra el nivel actual
            }

            // Guardar el objeto encontrado (sin hijos si es el último nivel)
            resultadoNivel[nivel] = copiarSinArreglosHijos(encontrado);

            // Preparar los datos para el siguiente nivel
            if (i < niveles.length - 1) {
                // Buscar todas las propiedades que sean arreglos de objetos
                const arreglosHijos = Object.values(encontrado).filter(
                    val => Array.isArray(val) && val.every(item => item && typeof item === 'object')
                );
                // Tomar el primer arreglo de objetos como datos para el siguiente nivel
                datosActuales = arreglosHijos.length > 0 ? arreglosHijos[0] : [];
            }
        }

        return resultadoNivel;
    });

    return resultado;
}
export function buscarIdArray(data, idToFind, idKey = 'id', childrenKeys = ['negocioList', 'productoList']) {
    // Convertir idToFind a número para asegurar comparación correcta
    const idToFindNum = Number(idToFind);

    // Asegurar que data sea un array
    const currentData = Array.isArray(data) ? data : [data];

    for (const item of currentData) {
        if (!item || typeof item !== 'object') continue;

        // Verificar si el objeto actual tiene el ID coincidente
        if (item[idKey] === idToFindNum) {
            // Crear una copia del objeto excluyendo las claves de hijos
            const result = { ...item };
            childrenKeys.forEach(key => {
                if (key in result) {
                    delete result[key];
                }
            });
            return result;
        }

        // Buscar recursivamente solo en las claves de hijos (negocioList, productoList)
        for (const key of childrenKeys) {
            if (item[key] && Array.isArray(item[key])) {
                const foundInChildren = buscarIdArray(item[key], idToFindNum, idKey, childrenKeys);
                if (foundInChildren) {
                    return foundInChildren;
                }
            }
        }
    }

    return null; // Retornar null si no se encuentra el ID
}
export function buscarPorCampo(data, searchValue, key = 'nombre', childrenKeys = ['negocioList', 'productoList']) {
    const currentData = Array.isArray(data) ? data : [data];

    for (const item of currentData) {
        if (!item || typeof item !== 'object') continue;

        if (item[key] === searchValue) {
            const result = { ...item };
            childrenKeys.forEach(childKey => {
                if (childKey in result) {
                    delete result[childKey];
                }
            });
            return result;
        }

        for (const childKey of childrenKeys) {
            if (item[childKey] && Array.isArray(item[childKey])) {
                const foundInChildren = buscarPorCampo(item[childKey], searchValue, key, childrenKeys);
                if (foundInChildren) {
                    return foundInChildren;
                }
            }
        }
    }

    return null;
}

export function modificarString(cadena, caracter1, caracter2) {
    if (cadena !== undefined) {
        return cadena.toString().replaceAll(caracter1, caracter2)
    }
}
export function validarFormulario(campos, formulario) {
    const errores = [];

    for (const campo of campos) {
        if (campo.required) {
            const valor = formulario[campo.id];
            // console.log("510", valor);
            if (valor === undefined || valor === '' || valor === null) {
                errores.push({ id: campo.id, mensaje: campo.error, campo: campo.title });
            }
            if (Array.isArray(valor)) {
                valor.forEach(e => {
                    if (e == undefined || e == '' || e == null) {
                        errores.push({ id: campo.id, mensaje: campo.error, campo: campo.title });
                    }
                });
            }
        }
    }

    return errores;
}
export function validarExtension(dato, extensiones) {
    let valido = false
    extensiones.forEach(e => {
        if (e.toLowerCase() == dato.toLowerCase()) {
            valido = true
        }
    });
    return valido
}
export function obtenerNumeroSemana(fecha) {
    if (typeof fecha !== "string") {
        if (fecha !== undefined) {
            let fechaAuxiliar = new Date(fecha.valueOf());
            let numeroDia = (fecha.getDay() + 6) % 7;
            fechaAuxiliar.setDate(fechaAuxiliar.getDate() - numeroDia + 3);
            let primerMartes = fechaAuxiliar.valueOf();
            fechaAuxiliar.setMonth(0, 1);
            if (fechaAuxiliar.getDay() != 4) {
                fechaAuxiliar.setMonth(0, 1 + ((4 - fechaAuxiliar.getDay()) + 7) % 7);
            }
            return 1 + Math.ceil((primerMartes - fechaAuxiliar) / 604800000);
        } else {
            console.log("obtenerNumeroSemana");
            console.log("el valor no existe");
        }
    }
}
export function revertirFecha(fecha, separador) {
    if (fecha !== null) {
        let formato = fecha.toString().split(separador)
        return formato[2] + separador + formato[1] + separador + formato[0]
    }
}
export function FormatFecha(data, separador) {
    let fecha = new Date(data);
    let dia = fecha.getDate() < 10 ? "0" + fecha.getDate() : fecha.getDate()
    let mes = fecha.getMonth() + 1 < 10 ? "0" + (fecha.getMonth() + 1) : fecha.getMonth() + 1
    let ano = fecha.getFullYear()
    return (ano + separador + mes + separador + dia)
}
export function obtenerFecha({ date = null, separador = "/", format = false } = {}) {
    if (date === null) return;

    function startOfWeek(date = new Date(), weekStartsOn = 1) {
        const d = new Date(date); // copia
        const day = d.getDay();   // 0..6 (0=domingo)
        // Desplazamiento: cuántos días retroceder desde 'date' hasta el inicio de semana
        const diff = (day - weekStartsOn + 7) % 7;
        d.setDate(d.getDate() - diff);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    function endOfWeek(date = new Date(), weekStartsOn = 1) {
        const start = startOfWeek(date, weekStartsOn);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        return end;
    }

    // --- Helper interno: parseo seguro (Firefox/Safari friendly) ---
    const parseFechaSafe = (value) => {
        if (value == null) return null;

        // Si ya es Date
        if (value instanceof Date) {
            return isNaN(value.getTime()) ? null : value;
        }

        const s = String(value).trim();
        if (!s) return null;

        // 1) "YYYY-MM-DD" (solo fecha) -> construir local (evita parse ambiguo)
        const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (m) {
            const [, y, mo, d] = m;
            const dt = new Date(Number(y), Number(mo) - 1, Number(d));
            return isNaN(dt.getTime()) ? null : dt;
        }

        // 2) ISO con hora/zona ("YYYY-MM-DDTHH:mm:ss.sss+00:00") -> estándar
        const dt = new Date(s);
        return isNaN(dt.getTime()) ? null : dt;
    };

    // --- Normaliza a Date sin depender de "YYYY/MM/DD" ---
    let formato = null;
    let inicioFin = null;

    // Mantengo tu intención original: si format o string, parsear.
    // SOLO cambiamos el método de parseo para no usar "/" (inestable)
    if (format || typeof date === "string") {
        formato = parseFechaSafe(date);
    } else {
        formato = parseFechaSafe(date);
    }

    if (!formato) return; // evita NaN en toda la cadena

    inicioFin = obtenerLimitesDelAnio(formato);

    // Tu formateo actual
    const fecha = FormatFecha(formato, separador);
    const vals = fecha.split(separador);

    // Aquí asumes que FormatFecha entrega: YYYY{sep}MM{sep}DD
    // (si no es así, dime y lo ajusto sin romper llamadas)
    const yearNum = Number(vals[0]);
    const mesNum = Number(vals[1]);
    const diaNum = Number(vals[2]);

    if (![yearNum, mesNum, diaNum].every(Number.isFinite)) {
        // Si algún formato no coincide, salimos para no devolver NaNs
        return;
    }

    // --- Cálculo robusto de inicio y fin de mes (sin strings) ---
    const inicioMes = new Date(yearNum, mesNum - 1, 1); // mesNum 1-12
    const finMes = new Date(yearNum, mesNum, 0);     // día 0 del mes siguiente

    return {
        inicioSemana: startOfWeek(date, 1),
        finSemana: endOfWeek(date, 1),
        inicioMes: inicioMes,
        finMes: finMes,
        dia: vals[2],
        mes: vals[1],
        year: vals[0],
        date: date,
        formato: fecha,
        reverso: revertirFecha(fecha, separador),
        semana: obtenerNumeroSemana(formato),
        format: formato,
        junto: vals[0] + vals[1] + vals[2],
        primerDia: inicioFin.primerDia,
        ultimoDia: inicioFin.ultimoDia
    };
}


function obtenerLimitesDelAnio(fecha) {
    // console.log(fecha);
    const anio = fecha.getFullYear();

    const primerDia = new Date(anio, 0, 1); // 1 de enero
    const ultimoDia = new Date(anio, 11, 31); // 31 de diciembre

    return {
        primerDia,
        ultimoDia
    };
}


export function buscarObjetoPorId(arrayDeObjetos, idBuscado) {
    // Utilizamos el método .find() que es ideal para buscar un único elemento.
    // .find() itera sobre el array y devuelve el primer elemento que satisface
    // la condición de la función de callback.
    return arrayDeObjetos.find(objeto => objeto.id === parseInt(idBuscado));
}
export function buscarEnArrayDeObjetos(arrayDeObjetos = [], valorBuscado = "") {
    const resultados = [];
    const valorLower = String(valorBuscado).toLowerCase(); // Convertir el valor buscado a minúsculas para búsqueda insensible a mayúsculas/minúsculas

    for (const objeto of arrayDeObjetos) {
        for (const key in objeto) {
            if (Object.prototype.hasOwnProperty.call(objeto, key)) {
                const valorPropiedad = String(objeto[key]).toLowerCase(); // Convertir el valor de la propiedad a minúsculas
                if (valorPropiedad.includes(valorLower)) {
                    resultados.push(objeto);
                    break; // Una vez que encontramos el valor en este objeto, pasamos al siguiente objeto
                }
            }
        }
    }
    return resultados;
}
export function soloNumeros(text) {
    let soloNumeros = Array.from(text);
    let numero = []
    soloNumeros.forEach(e => {
        if (!isNaN(parseInt(e))) {
            numero.push(e)
        }
    })
    soloNumeros = []
    return numero.toString().replaceAll(/,/g, '')
}

export function validarDia(numero) {
    let dia = soloNumeros(numero)
    return parseInt(dia) < 32 && dia.length < 3 ? dia : dia.substring(1, dia.length - 1)
}
export function validarMes(numero) {
    let dia = soloNumeros(numero)
    return parseInt(dia) < 13 && dia.length < 3 ? dia : dia.substring(1, dia.length - 1)
}
export function validarYear(numero) {
    let dia = soloNumeros(numero)
    return dia.length < 5 ? dia : dia.substring(1, dia.length - 1)
}
export function breadCrum(liga, tex, icono) {
    return (
        <span className="pointer" onClick={() => Router.push(liga)}>
            {icono !== undefined ?
                <i className={icono}></i> : <></>
            }
            {tex}
        </span>
    )
}
export function agregarDatosAObjetoPorId(arregloDeObjetos, idBuscado, nuevosDatos) {
    for (let i = 0; i < arregloDeObjetos.length; i++) {
        if (arregloDeObjetos[i].id === idBuscado) {
            arregloDeObjetos[i] = { ...arregloDeObjetos[i], ...nuevosDatos };
            return true;
        }
    }
    return false;
}
export function obtenerNuevoArregloConObjetosCopiadosPorIds(arregloDeObjetos, idsBuscados) {
    const nuevoArreglo = []; // Este será el nuevo arreglo con las copias

    // Iteramos sobre cada ID que nos han dado
    for (const idBuscado of idsBuscados) {
        // Buscamos el objeto correspondiente en el arreglo original
        const objetoEncontrado = arregloDeObjetos.find(objeto => objeto.id === idBuscado);

        // Si encontramos el objeto, creamos una copia y la agregamos a nuestro nuevo arreglo
        if (objetoEncontrado) {
            nuevoArreglo.push({ ...objetoEncontrado }); // ¡Aquí creamos la copia superficial!
        }
        // Opcional: Si quieres un mensaje para IDs no encontrados
        // else {
        //   console.warn(`Advertencia: No se encontró ningún objeto con el ID ${idBuscado}.`);
        // }
    }

    return nuevoArreglo; // Retornamos el nuevo arreglo con todas las copias
}

export function buscarEnArregloPorLlave(arreglo, llave, valor) {
    // Validamos que el primer argumento sea realmente un arreglo.
    if (!Array.isArray(arreglo)) {
        console.error("Error: El primer argumento proporcionado no es un arreglo.");
        return null;
    }
    // Usamos el método .find() que es ideal para esta tarea.
    const resultado = arreglo.find(objeto => objeto[llave] === valor);
    return resultado || null;
}
export function limpiarUrl(llaves, datos) {
    let text = ""
    llaves.forEach((e, i) => {
        if (typeof datos[e] == "object") {
            if (datos[e].length > 0) {
                text = text + "&" + llaves[i] + "=" + datos[e]
            }
        } else {
            if (datos[e] !== "" && datos[e] !== undefined && datos[e] !== null && datos[e] !== "Selecciona opcion") {
                text = text + "&" + llaves[i] + "=" + datos[e]
            }
        }
    })
    return text.slice(1)
}