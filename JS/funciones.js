let registros = JSON.parse(localStorage.getItem("registros")) || [];
const cuenta1 = { usuario: "Admin", correo: "Admin", contraseña: "12345" };

if (!registros.some(usersregistrados => usersregistrados.correo === cuenta1.correo)) {
    registros.push(cuenta1);
    localStorage.setItem("registros", JSON.stringify(registros));
}

// ==========================================
// 2. CONTROL DEL MODAL DE ALERTA CUSTOM
// ==========================================
let URL_DESTINO = null;
let ACCION_POST_ALERT = null;

function mostrarAlertCustom(mensaje, titulo = "Legacy Motors", urlRedireccion = null, accionAlCerrar = null) {
    const modal = document.getElementById('customAlert');
    if (!modal) return;
    
    const elemMensaje = document.getElementById('alertMensaje');
    if (elemMensaje) elemMensaje.textContent = mensaje;
    
    URL_DESTINO = urlRedireccion;
    ACCION_POST_ALERT = accionAlCerrar;
    modal.classList.add('active');
}

function cerrarAlertCustom() {
    const modal = document.getElementById('customAlert');
    if (modal) modal.classList.remove('active');
    
    if (typeof ACCION_POST_ALERT === 'function') {
        ACCION_POST_ALERT();
        ACCION_POST_ALERT = null;
    } else if (URL_DESTINO) {
        window.location.href = URL_DESTINO;
    }
}

// ==========================================
// 3. AUTENTICACIÓN (LOGIN, REGISTRO Y SESIÓN)
// ==========================================
function registrar(event) {
    if (event) event.preventDefault(); 

    const usuarioInput = document.getElementById("reg-usuario");
    const correoInput = document.getElementById("reg-correo");
    const passwordInput = document.getElementById("reg-password");

    const usuario = usuarioInput ? usuarioInput.value.trim() : "";
    const correo = correoInput ? correoInput.value.trim() : "";
    const contraseña = passwordInput ? passwordInput.value.trim() : "";

    if (correo === "" || contraseña === "") {
        mostrarAlertCustom("Debe llenar todos los campos requeridos.", "Legacy Motors");
        return;
    }

    registros = JSON.parse(localStorage.getItem("registros")) || [];

    if (registros.some(user => user.correo === correo || (user.usuario && user.usuario === usuario))) {
        mostrarAlertCustom("Este correo o usuario ya está registrado.", "Legacy Motors");
        return;
    }

    const nuevoRegistro = {
        usuario: usuario || correo,
        correo: correo,
        contraseña: contraseña
    };

    registros.push(nuevoRegistro);
    localStorage.setItem("registros", JSON.stringify(registros));
    
    limpiar();

    mostrarAlertCustom(
        "¡Cuenta creada con éxito! Ahora puedes iniciar sesión.",
        "Legacy Motors",
        null,
        function() {
            const authCard = document.getElementById('authCard');
            if (authCard) authCard.classList.remove('slide-active');
            
            const loginCorreo = document.getElementById('login-correo');
            if (loginCorreo) loginCorreo.value = correo;
        }
    );
}

function iniciarLOGIN(event) {
    if (event) event.preventDefault(); 

    const correoInput = document.getElementById("login-correo");
    const passwordInput = document.getElementById("login-password");

    const correo = correoInput ? correoInput.value.trim() : "";
    const contraseña = passwordInput ? passwordInput.value.trim() : "";

    registros = JSON.parse(localStorage.getItem("registros")) || [];

    const usuario = registros.find(user => 
        (user.correo === correo || user.usuario === correo) && user.contraseña === contraseña
    );    
    const correoExistente = registros.some(user => user.correo === correo || user.usuario === correo);

    if (usuario) {
        localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
        limpiar();
        mostrarAlertCustom(`¡Bienvenido de nuevo, ${usuario.usuario || usuario.correo}!`, "Legacy Motors", "index.html");
    } 
    else if (!correoExistente) {
        mostrarAlertCustom("Los datos de usuario no existen.", "Legacy Motors");
    } 
    else {
        mostrarAlertCustom("Correo o contraseña incorrectos.", "Legacy Motors");
    }
} 

function limpiar() {
    if (document.getElementById("login-correo")) document.getElementById("login-correo").value = "";
    if (document.getElementById("login-password")) document.getElementById("login-password").value = "";
    if (document.getElementById("reg-correo")) document.getElementById("reg-correo").value = "";
    if (document.getElementById("reg-password")) document.getElementById("reg-password").value = "";
    if (document.getElementById("reg-usuario")) document.getElementById("reg-usuario").value = "";
}

function actualizarBotonNavegacion() {
    const btnSesion = document.getElementById("btn-sesion");
    if (!btnSesion) return;

    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (usuarioActivo) {
        btnSesion.textContent = "Cuenta";
        btnSesion.href = "cuenta.html";
    } else {
        btnSesion.textContent = "Iniciar sesión";
        btnSesion.href = "login.html";
    }
}

function cargarDatosCuenta() {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!usuarioActivo) {
        window.location.href = "login.html";
        return;
    }

    // Actualiza el texto del nombre
    const elemNombre = document.getElementById("nombre-usuario-display");
    if (elemNombre) {
        elemNombre.textContent = usuarioActivo.usuario || usuarioActivo.correo || "USUARIO";
    }

    // Cambia la imagen si el usuario es Admin
    const avatarImg = document.getElementById("avatar-usuario-display");
    if (avatarImg) {
        const nombreUsuario = (usuarioActivo.usuario || usuarioActivo.correo || "").toLowerCase();
        
        if (nombreUsuario === "admin") {
            avatarImg.src = "Imagenes_EXTRA/Mod_Icon.png";
        } else {
            avatarImg.src = "Imagenes_EXTRA/Isologo.png"; // Ajusta la extensión si es .png o .jpg
        }
    }
}

function cerrarSesion(event) {
    if (event) event.preventDefault();

    // 1. Forzar tema oscuro inmediatamente
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
    actualizarLogo();

    // 2. Limpiar la sesión del usuario
    localStorage.removeItem("usuarioActivo");
    localStorage.removeItem("user");
    sessionStorage.clear();
    
    // 3. Mostrar la alerta custom con redirección a index.html
    if (typeof mostrarAlertCustom === "function" && document.getElementById('customAlert')) {
        mostrarAlertCustom("Se ha cerrado sesión.", "Legacy Motors", "index.html");
    } else {
        window.location.href = "index.html";
    }
}

// ==========================================
// 4. CONTROL DE TEMA Y LOGO DINÁMICO
// ==========================================
const rutaOscura = '/Multimedia/letters_logo1.png';
const rutaClara = '/Multimedia/Letters_Logo2.png';

function actualizarLogo() {
    const tema = document.documentElement.getAttribute('data-theme') || 'dark';
    const logos = document.querySelectorAll('.logo-img, .footer-logo, .alert-logo');
    
    // RUTA COMPLETA con subcarpeta incluida
    const rutaOscura = 'Multimedia/letters_logo1.png';
    const rutaClara = 'Multimedia/letters_logo2.png';

    const nuevaRuta = (tema === 'light') ? rutaClara : rutaOscura;

    logos.forEach(logo => {
        if (!logo) return;
        
        // Asignamos la ruta directa con carpeta
        logo.src = nuevaRuta;
    });
}

// 1. Cargar el tema guardado en cuanto descarga el script
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);

// 2. Observador para cambios de tema en tiempo real
const observer = new MutationObserver(actualizarLogo);
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

// 3. Verificación inicial cuando la estructura del HTML esté lista
document.addEventListener("DOMContentLoaded", actualizarLogo);

// 4. VERIFICACIÓN FINAL: Se ejecuta al final de todo cuando la página termina de cargar completamente
window.addEventListener("load", () => {
    actualizarLogo();
});
// ==========================================
// 5. ÍNDICE Y SISTEMA DE BÚSQUEDA
// ==========================================
const productosBusqueda = [
    ["Turbo GT-500", "turbos.html#detalle-turbo"],
    ["Turbo Extreme", "turbos.html#detalle-nos"],
    ["Turbo Sport", "turbos.html#detalle-discos"],
    ["Turbo Pro", "turbos.html#detalle-suspension"],
    ["Turbo Boost", "turbos.html#detalle-carroceria"],
    ["Turbo Max", "turbos.html#detalle-max"],
    ["Turbo Eco-Drive", "turbos.html#detalle-eco"],
    ["Turbo Titan", "turbos.html#detalle-titan"],
    ["Turbo Apex", "turbos.html#detalle-apex"],
    ["Turbo Velocity", "turbos.html#detalle-velocity"],
    ["Kit NOS Básico", "NOS.html#detalle-nos-basico"],
    ["Kit NOS Avanzado", "NOS.html#detalle-nos-avanzado"],
    ["Sistema NOS Profesional", "NOS.html#detalle-nos-profesional"],
    ["Kit NOS de Rendimiento", "NOS.html#detalle-nos-rendimiento"],
    ["Kit NOS Pro-Tuning", "NOS.html#detalle-nos-protuning"],
    ["Kit NOS Nitro-Max", "NOS.html#detalle-nos-max"],
    ["Kit NOS Eco-Shot", "NOS.html#detalle-nos-eco"],
    ["Kit NOS Titan-X", "NOS.html#detalle-nos-titan"],
    ["Kit NOS Apex-Flow", "NOS.html#detalle-nos-apex"],
    ["Kit NOS Velocity-Pro", "NOS.html#detalle-nos-velocity"],
    ["Disco Ventilado", "discos.html#detalle-freno-ventilado"],
    ["Disco Perforado", "discos.html#detalle-freno-perforado"],
    ["Disco Ranurado", "discos.html#detalle-freno-ranurado"],
    ["Kit Alto Rendimiento", "discos.html#detalle-freno-alto-rendimiento"],
    ["Disco Deportivo", "discos.html#detalle-freno-deportivo"],
    ["Disco Cerámico Pro", "discos.html#detalle-freno-ceramico-pro"],
    ["Disco Flotante Bi-Material", "discos.html#detalle-freno-flotante"],
    ["Kit Carbón-Cerámico", "discos.html#detalle-freno-carbon-ceramico"],
    ["Disco X-Spec Híbrido", "discos.html#detalle-freno-xspec"],
    ["Kit Big Brake Street-Pro", "discos.html#detalle-freno-big-brake"],
    ["Amortiguadores Deportivos", "suspen.html#detalle-amortiguadores-deportivos"],
    ["Muelles Regulables", "suspen.html#detalle-muelles-regulables"],
    ["Suspensión Neumática", "suspen.html#detalle-suspension-neumatica"],
    ["Barra Estabilizadora", "suspen.html#detalle-barra-estabilizadora"],
    ["Kits de Control", "suspen.html#detalle-kits-control"],
    ["Coilovers 36 Vías", "suspen.html#detalle-coilovers-36vias"],
    ["Brazos Ajustables", "suspen.html#detalle-brazos-ajustables"],
    ["Barra de Torreta Superior", "suspen.html#detalle-barra-torreta"],
    ["Kit Bujes de Poliuretano", "suspen.html#detalle-bujes-poliuretano"],
    ["Camber Plates Regulables", "suspen.html#detalle-camber-plates"],
    ["Alerón Deportivo", "carroceria.html#detalle-aleron-deportivo"],
    ["Kit Widebody", "carroceria.html#detalle-kit-widebody"],
    ["Parachoques Delantero", "carroceria.html#detalle-parachoques-delantero"],
    ["Difusor Trasero", "carroceria.html#detalle-difusor-trasero"],
    ["Aletas Laterales", "carroceria.html#detalle-aletas-laterales"],
    ["Capó en Fibra de Carbono", "carroceria.html#detalle-capo-carbono"],
    ["Canards Aerodinámicos", "carroceria.html#detalle-canards-aero"],
    ["Faldones Laterales Pro", "carroceria.html#detalle-faldones-laterales"],
    ["Espejos Aero Carbon", "carroceria.html#detalle-espejos-aero"],
    ["Splitter Delantero", "carroceria.html#detalle-splitter-delantero"]
].map(([nombre, url]) => ({ nombre, texto: nombre, url }));

const indiceBusqueda = [
    ...productosBusqueda,
    { nombre: "Inicio", texto: "inicio modificaciones tuning", url: "index.html" },
    { nombre: "Sobre Nosotros", texto: "sobre nosotros sobre la web mision visión vision", url: "sobre_nosotros.html" },
    { nombre: "Contactos", texto: "contactos redes sociales soporte tecnico técnico", url: "contactos.html" },
    { nombre: "Turbo Extreme", texto: "turbo extreme", url: "turbos.html#detalle-nos" },
    { nombre: "Turbos", texto: "turbos turbo turbo gt-500 turbo extreme turbo sport", url: "turbos.html" },
    { nombre: "Óxido Nitroso (NOS)", texto: "oxido nitroso óxido nitroso nos kit nos basico básico avanzado profesional rendimiento", url: "NOS.html" },
    { nombre: "Discos de Freno", texto: "discos disco de freno disco ventilado perforado ranurado kit alto rendimiento", url: "discos.html" },
    { nombre: "Suspensiones", texto: "suspensiones suspension suspensión amortiguadores deportivos muelles regulables neumatica neumática barra estabilizadora", url: "suspen.html" },
    { nombre: "Carrocería", texto: "carroceria carrocería aleron alerón deportivo kit widebody parachoques delantero difusor trasero", url: "carroceria.html" }
];

function normalizarBusqueda(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function buscarEnSitio(event) {
    if (event) event.preventDefault();

    const input = event ? event.currentTarget : document.querySelector(".search-wrapper input");
    const consulta = normalizarBusqueda(input ? input.value : "");

    if (!consulta) return;

    const resultado = indiceBusqueda.find(item => normalizarBusqueda(item.texto) === consulta) ||
        indiceBusqueda.find(item => normalizarBusqueda(item.texto).includes(consulta));

    if (resultado) {
        window.location.href = resultado.url;
    } else {
        mostrarAlertCustom("No encontramos productos o secciones para esa búsqueda.", "Legacy Motors");
    }
}

// 6. INICIALIZADOR ÚNICO (DOM CONTENT LOADED)

document.addEventListener("DOMContentLoaded", () => {
    // A. Aplicar tema guardado y actualizar logo desde el inicio
    const currentTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", currentTheme);
    
    actualizarBotonNavegacion();
    actualizarLogo(); // <-- Se ejecuta con el tema correcto recuperado

    // B. Carga de datos de cuenta si corresponde
    if (window.location.pathname.includes("cuenta.html")) {
        cargarDatosCuenta();
    }

    // C. Control del selector de tema (Radio Buttons)
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    const currentRadio = document.querySelector(`input[name="theme"][value="${currentTheme}"]`);
    if (currentRadio) currentRadio.checked = true;

    themeRadios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            const selectedTheme = e.target.value;
            
            // 1. Guardar y aplicar tema
            localStorage.setItem("theme", selectedTheme);
            document.documentElement.setAttribute("data-theme", selectedTheme);
            
            // 2. FORZAR el cambio de logo al instante sin esperar la recarga
            actualizarLogo();
        });
    });

    // D. Botón de Cerrar Sesión
    const logoutBtns = document.querySelectorAll('.btn-logout, #btn-logout, [onclick="cerrarSesion()"]');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', cerrarSesion);
    });

    // E. Inicialización del Autocompletado de Búsqueda
    document.querySelectorAll(".search-wrapper").forEach(wrapper => {
        const input = wrapper.querySelector("input");
        if (!input) return;

        const resultados = document.createElement("div");
        resultados.className = "search-results";
        resultados.setAttribute("role", "listbox");
        wrapper.appendChild(resultados);
        let opcionActiva = -1;

        input.setAttribute("aria-label", "Buscar productos o secciones");
        input.setAttribute("autocomplete", "off");

        input.addEventListener("input", () => {
            const consulta = normalizarBusqueda(input.value);
            resultados.innerHTML = "";
            opcionActiva = -1;

            if (!consulta) {
                resultados.hidden = true;
                return;
            }

            const coincidencias = indiceBusqueda
                .filter(item => normalizarBusqueda(item.texto).includes(consulta))
                .slice(0, 6);

            coincidencias.forEach(item => {
                const opcion = document.createElement("button");
                opcion.type = "button";
                opcion.className = "search-result";
                opcion.textContent = item.nombre;
                opcion.setAttribute("role", "option");
                opcion.addEventListener("click", () => {
                    window.location.href = item.url;
                });
                resultados.appendChild(opcion);
            });

            resultados.hidden = coincidencias.length === 0;
        });

        input.addEventListener("keydown", event => {
            const opciones = resultados.querySelectorAll(".search-result");

            if (event.key === "ArrowDown" && opciones.length) {
                event.preventDefault();
                opcionActiva = (opcionActiva + 1) % opciones.length;
                opciones[opcionActiva].focus();
            } else if (event.key === "ArrowUp" && opciones.length) {
                event.preventDefault();
                opcionActiva = (opcionActiva - 1 + opciones.length) % opciones.length;
                opciones[opcionActiva].focus();
            } else if (event.key === "Escape") {
                resultados.hidden = true;
            } else if (event.key === "Enter") {
                buscarEnSitio(event);
            }
        });

        document.addEventListener("click", event => {
            if (!wrapper.contains(event.target)) resultados.hidden = true;
        });
    });

    // F. Hash de navegación
    if (window.location.hash && typeof cambiarVista === "function") {
        const detalle = document.getElementById(window.location.hash.slice(1));
        if (detalle) cambiarVista(detalle.id);
    }
});

// Control del menú desplegable de Productos
const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownContainer = document.querySelector(".dropdown-container");

if (dropdownBtn && dropdownContainer) {
    dropdownBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownContainer.classList.toggle("active");
    });

    // Cierra el menú si se hace clic en cualquier otro lado de la pantalla
    document.addEventListener("click", (e) => {
        if (!dropdownContainer.contains(e.target)) {
            dropdownContainer.classList.remove("active");
        }
    });
}

// Función global de traducción local
function aplicarIdioma(lang) {
    localStorage.setItem("site_lang", lang);

    const elementos = document.querySelectorAll("[data-i18n]");
    elementos.forEach(el => {
        const clave = el.getAttribute("data-i18n");
        if (diccionario[lang] && diccionario[lang][clave]) {
            // Manejo especial si el elemento es un input de búsqueda
            if (el.tagName === "INPUT" && el.hasAttribute("placeholder")) {
                el.placeholder = diccionario[lang][clave];
            } else {
                el.textContent = diccionario[lang][clave];
            }
        }
    });
}

// Inicialización de escuchadores al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("site_lang") || "es";

    // Marcar el radio button según la preferencia activa
    const activeRadio = document.querySelector(`input[name="language"][value="${savedLang}"]`);
    if (activeRadio) {
        activeRadio.checked = true;
    }

    // Aplicar traducción actual
    aplicarIdioma(savedLang);

    // Evento al cambiar selección de idioma
    const langRadios = document.querySelectorAll('input[name="language"]');
    langRadios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            aplicarIdioma(e.target.value);
        });
    });
});

// Exponer de forma global para que Traducciones.js la ejecute
window.actualizarBotonNavegacion = function() {
    const btnSesion = document.getElementById("btn-sesion");
    if (!btnSesion) return;

    // Buscar en los localStorages posibles
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo")) || JSON.parse(localStorage.getItem("user"));
    const lang = localStorage.getItem("language") || "es";

    if (usuarioActivo) {
        btnSesion.textContent = (lang === "en") ? "Account" : "Cuenta";
        btnSesion.href = "cuenta.html";
    } else {
        btnSesion.textContent = (lang === "en") ? "Log In" : "Iniciar sesión";
        btnSesion.href = "login.html";
    }
};

// Ejecutar automáticamente al cargar cualquier página
document.addEventListener("DOMContentLoaded", () => {
    window.actualizarBotonNavegacion();
});