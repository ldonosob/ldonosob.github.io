importScripts('App/Content/js/sw-utils.js');

const STATIC_CACHE    = 'santarita-static-v1.311';
const DYNAMIC_CACHE   = 'santarita-dynamic-v1.311';

const APP_SHELL = [
    //HTML 
    '/',
    'index.html',
    'App/Layout/certificado_antiguedad.html',
    'App/Layout/documento.html',
    'App/Layout/error.html',
    'App/Layout/home.html',
    'App/Layout/login.html',
    'App/Layout/mi_perfil.html',
    'App/Layout/modificar_contrasena.html',
    'App/Layout/noticia.html',
    'App/Layout/offline.html',
    'App/Layout/saldo_vacaciones.html',
    'App/Layout/cumpleanos.html',
    //CSS
    'App/Content/css/_general.css',
    'App/Content/css/carousel.css',
    'App/Content/css/certificado_antiguedad.css',
    'App/Content/css/default.css',
    'App/Content/css/documento.css',
    'App/Content/css/home.css',
    'App/Content/css/login.css',
    'App/Content/css/noticia.css',
    'App/Content/css/offline.css',
    'App/Content/css/saldo_vacaciones.css',
    'App/Content/css/cumpleanos.css',
    '_librerias/Fontawasome/css/all.min.css',
    '_librerias/TinySlider/tiny-slider.css',
    '_librerias/Datepicker/css/datepicker.css',    
    //JS
    'App/Content/js/certificado_antiguedad.js',
    'App/Content/js/default.js',
    'App/Content/js/documento.js',
    'App/Content/js/home.js',
    'App/Content/js/login.js',
    'App/Content/js/noticia.js',
    'App/Content/js/mi_perfil.js',
    'App/Content/js/offline.js',
    'App/Content/js/saldo_vacaciones.js',
    'App/Content/js/modificar_contrasena.js',
    'App/Content/js/cumpleanos.js',
    'App/Content/js/sw-utils.js',
    '_librerias/OpenNet/_general.js',
    '_librerias/MomentJS/moment-with-locales.min.js',
    '_librerias/TinySlider/tiny-slider.js',
    '_librerias/Zoom/zoom.js',
    '_librerias/Datepicker/js/datepicker-full.js',
    '_librerias/Datepicker/js/locales/es.js',
    //IMG
    'App/Content/images/favicon.ico',
    'App/Content/images/firma-marta.png',
    'App/Content/images/fondo-login.jpg',
    'App/Content/images/fondo-login2.jpg',
    'App/Content/images/logo-negro.png',
    'App/Content/images/logo-top-SRE.png',
    'App/Content/images/logo-top2.png',
    'App/Content/images/LogoCertificado.png',
    'App/Content/images/no_disponible.png',
    'App/Content/images/usuario.png',
    'App/Content/images/no-internet-2.png', 

    'App/Content/images/icons/SR_App_icono_144.png',
    'App/Content/images/icons/SR_App_icono_168.png',
    'App/Content/images/icons/SR_App_icono_192.png',
    'App/Content/images/icons/SR_App_icono_512.png'
];


self.addEventListener('install', e => {
    
    self.skipWaiting();

    const cacheStatic = caches.open( STATIC_CACHE ).then(cache => 
        cache.addAll( APP_SHELL ));

    e.waitUntil( cacheStatic );
});

self.addEventListener('activate', e => {

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

            if (  key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }
        });
    });

    e.waitUntil( respuesta );
});


self.addEventListener('fetch', function (event) {


    let respuesta;

    /* Estrategia: Cache con llamadas a internet(especificas).
     * 
     * En el caso de que el request vaya a consumir métodos de la API (obtención de datos)...
     * No va a ir directamente al caché, sino que obtendrá directo desde la api, en el caso de no tener conexión retorna lo del caché.
     * Mantendra noticias, documentos, likes y comentarios actualizados siempre.
    */

    if (event.request.url.includes('/api/')) {

        respuesta = fetch(event.request).then(newRes => {

            return actualizaCacheDinamico(DYNAMIC_CACHE, event.request, newRes);
        }).catch(error => {

            if (event.request.headers.get('accept').includes('text/html')) {

                return caches.match('App/Layout/offline.html');
            }
        });

    } else {
        
        respuesta = caches.match(event.request).then(res => {

            if (res) {

                return res;
            } else {

                return fetch(event.request).then(newRes => {

                    return actualizaCacheDinamico(DYNAMIC_CACHE, event.request, newRes);
                }).catch(error => {

                    if (event.request.headers.get('accept').includes('text/html')) {

                        return caches.match('App/Layout/offline.html');
                    }
                });
            }
        });
    }

    /* Estrategia: Cache con actualizacion de internet (todos los request.)     * 
     * Siempre estará un paso atrás... es decir si da un like o se cargan noticias se mostraran en la siguiente recarga del sitio
     * 
     */
    
    //respuesta = caches.match(event.request).then(res => {

    //    if (event.request.method === 'POST') {

    //        return fetch(event.request).then(newRes => {

    //            return newRes;
    //        });
    //    }
               
    //    fetch(event.request).then(newRes => {

    //        return actualizaCacheDinamico(DYNAMIC_CACHE, event.request, newRes);
    //    }).catch(error => {

    //        if (event.request.headers.get('accept').includes('text/html')) {

    //            return caches.match('App/Layout/offline.html');
    //        }
    //    });

    //    return caches.match(event.request);                             
    //});

       
    event.respondWith( respuesta );
});  