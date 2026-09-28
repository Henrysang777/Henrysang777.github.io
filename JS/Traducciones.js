(function () {
    "use strict";

    const STORAGE_KEY = "language";
    let observerInstance = null; // Instancia global para pausar el observador

    const TRADUCCIONES = {
        // ---- HEADER Y NAVEGACIÓN ----
        "Buscar...": "Search...",
        "PRODUCTOS": "PRODUCTS",
        "Categorías": "Categories",
        "Turbos": "Turbos",
        "Óxido Nitroso (NOS)": "Nitrous Oxide (NOS)",
        "Discos de Freno": "Brake Discs",
        "Suspensiones": "Suspension",
        "Carrocería": "Body Kit",
        "Inicio": "Home",
        "Sobre Nosotros": "About Us",
        "Contactos": "Contact",
        "Iniciar sesión": "Log In",
        "Cuenta": "Account",
        "Mi Cuenta": "My Account",

        // ---- FOOTER ----
        "Tu portal definitivo de piezas de alto rendimiento y tuning.": "Your ultimate destination for high-performance and tuning parts.",
        "NOSOTROS": "ABOUT US",
        "Misión y Visión": "Mission & Vision",
        "SOPORTE": "SUPPORT",
        "Atención al Cliente": "Customer Support",
        "Preguntas Frecuentes": "FAQ",
        "Política de Privacidad": "Privacy Policy",
        "Términos del Servicio": "Terms of Service",
        "© 2026 Legacy Motors | Todos los derechos reservados | Hecho con pasión por el rendimiento.": "© 2026 Legacy Motors | All rights reserved | Made with passion for performance.",

        // ---- SECCIÓN SOBRE NOSOTROS ----
        "Sobre la web": "About the site",
        "Legacy Motors es una plataforma web informativa diseñada para apasionados del automovilismo, el tuning y las modificaciones visuales y mecánicas. Nuestra meta es proporcionar información clara, detallada y accesible sobre piezas de alto rendimiento para que enthusiasts y proyectos de tuning tengan una referencia confiable.": "Legacy Motors is an informative web platform designed for automotive enthusiasts, tuning, and visual or mechanical modifications. Our goal is to provide clear, detailed, and accessible information about high-performance parts so enthusiasts and project builders have a reliable reference.",
        "Misión": "Mission",
        "Proporcionar una plataforma accesible e intuitiva con información precisa sobre componentes de modificaciones vehiculares, educando y guiando a la comunidad entusiasta hacia decisiones informadas sobre el rendimiento y estética de sus vehículos.": "To provide an accessible and intuitive platform with accurate information about vehicle modification components, educating and guiding the enthusiast community toward informed decisions regarding performance and aesthetics.",
        "Visión": "Vision",
        "Convertirnos en el sitio web de referencia sobre tuning y modificaciones en la región, siendo reconocidos por la calidad de nuestro contenido, facilidad de uso y compromiso con la cultura automotriz.": "To become the premier reference website for tuning and modifications in the region, recognized for high-quality content, ease of use, and commitment to car culture.",
        "Valores": "Values",
        "Claridad y Transparencia": "Clarity and Transparency",
        "Ofrecemos especificaciones técnicas reales sin sobrecargar con tecnicismos innecesarios.": "We provide real technical specifications without cluttering with unnecessary technicalities.",
        "Confianza y Credibilidad": "Trust and Credibility",
        "Contenido investigado para brindar datos precisos sobre piezas y compatibilidad.": "Researched content to deliver precise data on parts and compatibility.",
        "Usabilidad y Funcionalidad": "Usability and Functionality",
        "Una interfaz limpia, navegable y optimizada para todo tipo de usuarios.": "A clean, easy-to-navigate interface optimized for all users.",
        "Accesibilidad y Soporte": "Accessibility and Support",
        "Información siempre disponible y de fácil acceso para la comunidad.": "Information always available and easy to access for the community.",
        "Desarrolladores": "Developers",

        // ---- CONTENEDORES .comp Y TARJETAS ----
        "¿QUÉ ES?": "WHAT IS IT?",
        "Nuestra especialidad": "Our specialty",
        "Tipos de modificaciones": "Types of modifications",
        "Discos de freno": "Brake Discs",
        "Video Informativo": "Informational Video",
        "Conoce más sobre nuestras piezas y proyectos de alto rendimiento.": "Learn more about our high-performance parts and projects.",
        "Catálogo": "Catalog",
        "Ver Catálogo": "View Catalog",
        "Ver Detalles": "View Details",
        "Ver Ficha Técnica": "View Spec Sheet",
        "Ficha Técnica": "Spec Sheet",
        "Añadir al Carrito": "Add to Cart",
        "Comprar Ahora": "Buy Now",
        "Disponible": "Available",
        "En stock": "In stock",
        "Agotado": "Out of stock",
        "Precio:": "Price:",
        "Precio": "Price",
        "Categoría:": "Category:",
        "Marca:": "Brand:",

        // ---- CATÁLOGOS Y FICHAS ----
        "Catálogo de Turbos": "Turbos Catalog",
        "Catálogo de Óxido Nitroso": "Nitrous Oxide Catalog",
        "Catálogo de Discos de Freno": "Brake Discs Catalog",
        "Catálogo de Suspensiones": "Suspension Catalog",
        "Catálogo de Carrocería": "Body Kit Catalog",
        "Volver al catálogo": "Back to catalog",
        "⬅ Volver al catálogo": "⬅ Back to catalog",
        "Volver al inicio": "Back to home",
        "<- Volver al inicio": "<- Back to home",
        "Especificaciones Técnicas": "Technical Specifications",
        "Compatibilidad Recomendada": "Recommended Compatibility",
        "Modelos Populares:": "Popular Models:",
        "Uso:": "Use:",
        "Garantía:": "Warranty:",
        "Garantía": "Warranty",
        "Material:": "Material:",
        "Material": "Material",
        "1 Año de fábrica": "1-Year factory warranty",
        "Precio referencial para tu proyecto.": "Reference price for your project.",
        "Alto Rendimiento": "High Performance",
        "Uso Deportivo": "Sport Use",
        "Uso en Pista": "Track Use",
        "Uso Diario / Callejero": "Daily / Street Use",

        // ---- LOGIN Y REGISTRO ----
        "Bienvenido de nuevo a Legacy Motors": "Welcome back to Legacy Motors",
        "Correo electrónico": "Email address",
        "Contraseña": "Password",
        "¿No tienes cuenta?": "Don't have an account?",
        "Haz clic aquí": "Click here",
        "Crear cuenta": "Create account",
        "Únete a la comunidad de modificaciones": "Join the modification community",
        "Nombre de usuario": "Username",
        "Registrarse": "Sign up",
        "¿Ya tienes una cuenta?": "Already have an account?",
        "Mensaje del sistema...": "System message...",
        "ACEPTAR": "ACCEPT",

        // ---- AJUSTES Y MI CUENTA ----
        "CONFIGURACION": "SETTINGS",
        "CARGANDO...": "LOADING...",
        "ASPECTO": "APPEARANCE",
        "Oscuro": "Dark",
        "Claro": "Light",
        "IDIOMA": "LANGUAGE",
        "IDIOMA [EN PRUEBA]": "LANGUAGE",
        "Español": "Spanish",
        "Inglés": "English",
        "Cerrar sesion": "Log out",

        // ---- CONTACTOS ----
        "Contactos Oficiales": "Official Contacts",
        "Redes Sociales": "Social Media",
        "Soporte Técnico": "Technical Support",
        "Contacto Telefónico": "Phone Contact"
    };

    const TAGS_IGNORADOS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "CODE", "INPUT"]);

    function obtenerIdioma() {
        return localStorage.getItem(STORAGE_KEY) || "es";
    }

    function guardarIdioma(lang) {
        localStorage.setItem(STORAGE_KEY, lang);
        aplicarTraduccion(lang);
    }

    function limpiarTexto(str) {
        return str ? str.replace(/\s+/g, " ").trim() : "";
    }

    function sincronizarBotonSesion(lang) {
        const btnSesion = document.getElementById("btn-sesion");
        if (!btnSesion) return;

        const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

        if (usuarioActivo) {
            btnSesion.textContent = lang === "en" ? "Account" : "Cuenta";
            btnSesion.href = "cuenta.html";
        } else {
            btnSesion.textContent = lang === "en" ? "Log In" : "Iniciar sesión";
            btnSesion.href = "login.html";
        }
    }

    function traducirElemento(el, lang) {
        if (!el) return;

        // Si el nodo es el botón de navegación, lo ignoramos para que lo procese sincronizarBotonSesion
        if (el.id === "btn-sesion" || (el.parentElement && el.parentElement.id === "btn-sesion")) {
            return;
        }

        // 1. Traducir Nodos de Texto
        if (el.nodeType === Node.TEXT_NODE) {
            const raw = el.textContent;
            const limpio = limpiarTexto(raw);
            if (!limpio) return;

            if (el._textoOriginal === undefined) {
                el._textoOriginal = limpio;
            }

            const base = el._textoOriginal;

            if (lang === "es") {
                el.textContent = raw.replace(limpio, base);
            } else if (TRADUCCIONES[base]) {
                el.textContent = raw.replace(limpio, TRADUCCIONES[base]);
            }
            return;
        }

        if (el.nodeType !== Node.ELEMENT_NODE) return;
        if (TAGS_IGNORADOS.has(el.tagName)) return;

        // 2. Atributos inline data-es / data-en
        if (el.hasAttribute("data-es") && el.hasAttribute("data-en")) {
            el.textContent = lang === "en" ? el.getAttribute("data-en") : el.getAttribute("data-es");
            return;
        }

        // 3. Atributos UI
        ["placeholder", "title", "alt", "value"].forEach((attr) => {
            if (el.hasAttribute && el.hasAttribute(attr)) {
                const valAttr = el.getAttribute(attr);
                const attrKey = `_attr_${attr}`;

                if (!el[attrKey]) {
                    el[attrKey] = limpiarTexto(valAttr);
                }

                const baseAttr = el[attrKey];

                if (lang === "es") {
                    el.setAttribute(attr, baseAttr);
                } else if (TRADUCCIONES[baseAttr]) {
                    el.setAttribute(attr, TRADUCCIONES[baseAttr]);
                }
            }
        });

        // 4. Recorrido recursivo
        el.childNodes.forEach((hijo) => traducirElemento(hijo, lang));
    }

    function aplicarTraduccion(lang) {
        // Pausar el observador para evitar bucles al reescribir nodos
        if (observerInstance) observerInstance.disconnect();

        document.documentElement.setAttribute("lang", lang);
        traducirElemento(document.body, lang);
        sincronizarBotonSesion(lang);
        sincronizarRadioButtons(lang);

        // Reactivar el observador tras hacer los cambios
        if (observerInstance) {
            observerInstance.observe(document.body, { childList: true, subtree: true });
        }
    }

    function sincronizarRadioButtons(lang) {
        document.querySelectorAll('input[name="language"]').forEach((radio) => {
            radio.checked = radio.value === lang;
        });
    }

    function escucharEventos() {
        document.body.addEventListener("change", (e) => {
            if (e.target && e.target.name === "language") {
                guardarIdioma(e.target.value);
            }
        });
    }

    function observarDOM() {
        observerInstance = new MutationObserver((mutations) => {
            const lang = obtenerIdioma();
            
            // Pausar momentáneamente mientras procesa mutaciones externas
            observerInstance.disconnect();

            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    traducirElemento(node, lang);
                });
            });

            sincronizarBotonSesion(lang);

            // Reanudar escucha
            observerInstance.observe(document.body, { childList: true, subtree: true });
        });

        observerInstance.observe(document.body, { childList: true, subtree: true });
    }

    function init() {
        const lang = obtenerIdioma();
        escucharEventos();
        observarDOM();
        aplicarTraduccion(lang);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();