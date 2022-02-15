//
// Clase base con funciones Opensoft
//
let Opensoft = function () {

    let _ejecutar = [];

    let _Init = function () {
        moment.locale('es');
        //_IniciarCarouseles();

        if (sessionStorage.getItem('Usuario')) {

            let params = "usuarioId=" + Opensoft.ObtenerDatoUsuarioLogueado("UsuarioId");

            _Get("Home", "ObtenerMenu", params, function (data) {
                localStorage.setItem('menuIzquierdo', JSON.stringify(data.Menu));
                _CargarMenuLateralIzquierdo(data.Menu);
            }, function (respuesta, data) {
                if (localStorage.getItem('menuIzquierdo')) {
                    let menuIzquierdo = JSON.parse(localStorage.getItem('menuIzquierdo'));
                    _CargarMenuLateralIzquierdo(menuIzquierdo);
                }
            });
        }

        _IniciarMenuUsuario();
    };

    // GENERALES
    let _Http = function (metodo, controlador, accion, parametros, _callbackExito, _callbackError) {

        if (metodo == "GET") {
            
            accion += "?" + parametros;
            parametros = {};
        }

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (this.readyState != 4) return;

            if (this.status == 200) {
                if (this.responseText) {
                    let data = JSON.parse(this.responseText);

                    if (data) {
                        if (data.Codigo == 0) {
                            if (_callbackExito) _callbackExito(data.Data);
                        } else {
                            if (_callbackError) _callbackError(null, data);
                        }
                    } else {
                        if (_callbackError) _callbackError(null, data);
                    }
                } else {
                    if (_callbackError) _callbackError(this.responseText);
                }
            } else {
                if (_callbackError) _callbackError(this.responseText);
            }
        };

        let URL = Config.UrlApi + controlador + '/' + accion;



        xhr.open(metodo, URL, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

        xhr.send(JSON.stringify(parametros));
    };

    let _Post = function (controlador, accion, parametros, _callbackExito, _callbackError) {
        _Http('POST', controlador, accion, parametros, _callbackExito, _callbackError);
    };

    let _Get = function (controlador, accion, parametros, _callbackExito, _callbackError) {
        _Http('GET', controlador, accion, parametros, _callbackExito, _callbackError);
    };

    let _Ready = function (_callback) {
        if (_callback) _ejecutar.push(_callback);
    };

    let _Ejecutar = function () {
        return _ejecutar;
    };

    let _OnEnter = function (ev, _callback) {
        if (ev.key == "Enter") {
            if (_callback) _callback();
        }
    };

    let _SimularClick = function (elemento) {
        // Create our event (with options)
        let evt = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });

        // If cancelled, don't dispatch our event
        let canceled = !elemento.dispatchEvent(evt);
    };

    // MENÚ
    let _CargarMenuLateralIzquierdo = function (menu) {

        if (menu && menu.length > 0) {
            let listadoMenuIzquierdo = document.querySelector('.menu-izquierdo .contenedor-menu-izquierdo .listado-menu-izquierdo');

            if (listadoMenuIzquierdo) {
                listadoMenuIzquierdo.innerHTML = "";

                menu.forEach(function (itemMenu) {
                    let li = '<li class="opcion-menu-izquierdo"><a href="' + itemMenu.URLReferencia + '">' + itemMenu.Nombre + '</a></li>';
                    listadoMenuIzquierdo.innerHTML += li;
                });
            }
        }
    };

    let _IniciarMenuUsuario = function () {



        let menuUsuario = document.querySelector(".menu-usuario");
        let usuario = JSON.parse(sessionStorage.getItem("Usuario"));

        if (usuario) {

            document.querySelector(".menu-usuario-superior .btn-usuario .foto-usuario.visible").src = usuario.UrlFoto;
            menuUsuario.querySelector(".icono-menu-usuario").src = usuario.UrlFoto;
        }
        
        if (menuUsuario) {
            let listadoMenu = menuUsuario.querySelector(".listado-menu-usuario");

            // CARGA EL NOMBRE DEL USUARIO LOGUEADO
            let usuarioLogueado = sessionStorage.getItem('Usuario');
            if (usuarioLogueado) {
                usuarioLogueado = JSON.parse(usuarioLogueado);
                menuUsuario.querySelector('.nombre-menu-usuaio').innerHTML = usuarioLogueado.Nombre;
            }

            // CARGA EL LISTADO DE OPCIONES DEL MENÚ DE USUARIO
            listadoMenu.innerHTML = "";
            Config.OpcionesMenuUsuario.forEach(function (opcionMenu) {
                listadoMenu.innerHTML += '<li class="opcion-menu-usuario"><a href="' + opcionMenu.Url + '">' + opcionMenu.Titulo + '</a></li>';
            });
            listadoMenu.innerHTML += '<li class="opcion-menu-usuario"><a href="#" onclick="Opensoft.CerrarSesion()">Salir <i class="fa fa-sign-out-alt"></i></a></li>';
        }
    };

    let _ClickMenuIzquierdo = function (boton) {
        let icono = boton.querySelector("i");
        icono.classList.toggle('fa-list-ul');
        icono.classList.toggle('fa-times');

        let menuIzquierdo = document.querySelector(".menu-izquierdo");
        menuIzquierdo.classList.toggle('visible');

        let menuUsuario = document.querySelector(".menu-usuario");
        menuUsuario.classList.remove('visible');

        let fotoUsuario = document.querySelector(".menu-usuario-superior .foto-usuario");
        fotoUsuario.classList.add('visible');

        let iconoUsuario = document.querySelector(".menu-usuario-superior .cerrar-menu-usuario");
        iconoUsuario.classList.remove('visible');
    };

    let _ClickMenuUsuario = function (boton) {
        let foto = boton.querySelector(".foto-usuario");
        foto.classList.toggle('visible');

        let icono = boton.querySelector(".cerrar-menu-usuario");
        icono.classList.toggle('visible');

        let menuUsuario = document.querySelector(".menu-usuario");
        menuUsuario.classList.toggle('visible');

        let menuIzquierdo = document.querySelector(".menu-izquierdo");
        menuIzquierdo.classList.remove('visible');

        let iconoHamburguesa = document.querySelector(".menu-hamburguesa-superior i");
        iconoHamburguesa.classList.add('fa-list-ul');
        iconoHamburguesa.classList.remove('fa-times');
    };

    let _FechaToTextoHace = function (fecha) {
        let unidad = '';
        let medida = 0;

        medida = moment().diff(moment(fecha, 'DD/MM/YYYY'), 'years');
        if (medida > 0) {
            if (medida > 1) unidad = 'años';
            if (medida = 1) unidad = 'año';
        } else {
            medida = moment().diff(moment(fecha, 'DD/MM/YYYY'), 'months');
            if (medida > 0) {
                if (medida > 1) unidad = 'meses';
                if (medida = 1) unidad = 'mes';
            } else {
                medida = moment().diff(moment(fecha, 'DD/MM/YYYY'), 'days');
                if (medida > 0) {
                    if (medida > 1) unidad = 'días';
                    if (medida = 1) unidad = 'día';
                } else {
                    medida = moment().diff(moment(fecha, 'DD/MM/YYYY'), 'hours');
                    if (medida > 0) {
                        if (medida > 1) unidad = 'horas';
                        if (medida = 1) unidad = 'hora';
                    } else {
                        medida = moment().diff(moment(fecha, 'DD/MM/YYYY'), 'minutes');
                        if (medida > 0) {
                            if (medida > 1) unidad = 'minutos';
                            if (medida = 1) unidad = 'minuto';
                        } else {
                            medida = moment().diff(moment(fecha, 'DD/MM/YYYY'), 'seconds');

                            if (medida > 1) unidad = 'segundos';
                            if (medida = 1) unidad = 'segundo';
                        }
                    }
                }
            }
        }

        return "Hace " + medida + " " + unidad;
    };

    let _CerrarSesion = function () {
        sessionStorage.removeItem("Usuario");
        location.href = "login.html";
    };

    // CAROUSEL
    let _IniciarCarouseles = function () {
        let carouseles = document.querySelectorAll(".carousel-opensoft");
        carouseles.forEach(function (carousel, index) {
            let contenedorElementos = carousel.querySelector(".elementos-carousel");
            let cantElementos = _ElementosActivos(contenedorElementos);

            elementosIniciales = contenedorElementos.querySelectorAll(".elemento-carousel:nth-child(-n+" + cantElementos + ")");

            elementosIniciales.forEach(function (elemento, index) {
                elemento.classList.add("activo");
            });

            let botonIzquierdo = carousel.querySelector(".contenedor-boton-carousel.boton-izquierdo-carousel");
            let botonDerecho = carousel.querySelector(".contenedor-boton-carousel.boton-derecho-carousel");

            botonIzquierdo.onclick = function () {
                _MoverCarouselIzquierda(contenedorElementos, botonDerecho, botonIzquierdo);
            };

            botonDerecho.onclick = function () {
                _MoverCarouselDerecha(contenedorElementos, botonDerecho, botonIzquierdo);
            };

            botonDerecho.style.visibility = 'visible';
            botonIzquierdo.style.visibility = 'hidden';
        });
    };

    let _ReiniciarCarousel = function (selector, _callbackDerecha, _callbackIzquierda) {
        let carousel = document.querySelector(selector);

        if (carousel.classList.contains("carousel-opensoft")) {

            let contenedorElementos = carousel.querySelector(".elementos-carousel");
            let cantElementos = _ElementosActivos(contenedorElementos);

            elementosIniciales = contenedorElementos.querySelectorAll(".elemento-carousel:nth-child(-n+" + cantElementos + ")");

            elementosIniciales.forEach(function (elemento, index) {
                elemento.classList.add("activo");
            });

            let botonIzquierdo = carousel.querySelector(".contenedor-boton-carousel.boton-izquierdo-carousel");
            let botonDerecho = carousel.querySelector(".contenedor-boton-carousel.boton-derecho-carousel");

            botonIzquierdo.onclick = function () {
                _MoverCarouselIzquierda(contenedorElementos, botonDerecho, botonIzquierdo);
                if (_callbackIzquierda) _callbackIzquierda();
            };

            botonDerecho.onclick = function () {
                _MoverCarouselDerecha(contenedorElementos, botonDerecho, botonIzquierdo);
                if (_callbackDerecha) _callbackDerecha();
            };

            botonDerecho.style.visibility = 'visible';
            botonIzquierdo.style.visibility = 'hidden';
        }
    };

    let _ElementosActivos = function (contenedorElementos) {
        let cantElementos = 1;

        if (contenedorElementos.classList.contains("un-elemento")) cantElementos = 1;
        if (contenedorElementos.classList.contains("dos-elementos")) cantElementos = 2;
        if (contenedorElementos.classList.contains("tres-elementos")) cantElementos = 3;
        if (contenedorElementos.classList.contains("cuatro-elementos")) cantElementos = 4;

        return cantElementos;
    };

    let _MoverCarouselDerecha = function (contenedorElementos, botonDerecha, botonIzquierda) {
        let cantElementos = _ElementosActivos(contenedorElementos);
        let elementosTodos = contenedorElementos.querySelectorAll(".elemento-carousel");
        let ultimoElemento = elementosTodos[elementosTodos.length - 1];
        let elementosActivos = contenedorElementos.querySelectorAll(".elemento-carousel.activo");
        let ultimoActivo = elementosActivos[elementosActivos.length - 1];

        if (ultimoActivo != ultimoElemento) {
            let proximo = ultimoActivo;

            for (let x = 0; x < cantElementos; x++) {
                if (proximo.nextElementSibling) {
                    proximo = proximo.nextElementSibling;
                    proximo.classList.add("activo");
                }
            }

            elementosActivos.forEach(function (elemento, index) {
                elemento.classList.remove("activo");
            });

            elementosActivos = contenedorElementos.querySelectorAll(".elemento-carousel.activo");
            ultimoActivo = elementosActivos[elementosActivos.length - 1];

            if (ultimoActivo == ultimoElemento) {
                botonDerecha.style.visibility = 'hidden';
            } else {
                botonDerecha.style.visibility = 'visible';
            }

            botonIzquierda.style.visibility = 'visible';
        }
    };

    let _MoverCarouselIzquierda = function (contenedorElementos, botonDerecha, botonIzquierda) {
        let cantElementos = _ElementosActivos(contenedorElementos);
        let primerElemento = contenedorElementos.querySelectorAll(".elemento-carousel")[0];
        let elementosActivos = contenedorElementos.querySelectorAll(".elemento-carousel.activo");
        let primerActivo = elementosActivos[0];

        if (primerActivo != primerElemento) {
            let anterior = primerActivo;

            for (let x = 0; x < cantElementos; x++) {
                if (anterior.previousElementSibling) {
                    anterior = anterior.previousElementSibling;
                    anterior.classList.add("activo");
                }
            }

            elementosActivos.forEach(function (elemento, index) {
                elemento.classList.remove("activo");
            });

            elementosActivos = contenedorElementos.querySelectorAll(".elemento-carousel.activo");
            primerActivo = elementosActivos[0];

            if (primerActivo == primerElemento) {
                botonIzquierda.style.visibility = 'hidden';
            } else {
                botonIzquierda.style.visibility = 'visible';
            }

            botonDerecha.style.visibility = 'visible';
        }
    };

    //Imagenes
    let _HacerZoomImagen = function (img, descripcion) {

        zoom();

        document.body.style.overflow = "hidden";


        // Obtiene el modal de imagen
        var modal = document.getElementById('divModalImagen');
        var modalImg = document.getElementById("imgModal");

        var captionText = document.getElementById("divDescripcionImagen");

        modal.style.display = "block";
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        captionText.innerHTML = descripcion;


        modal.onclick = function () {
            modalImg.className += " out";
            document.body.style.overflow = "auto";

            setTimeout(function () {
                modal.style.display = "none";
                modalImg.className = "modal-content";
            }, 400);
        }
    }

    // RUT
    let _ValidaRut = function (strValor) {
        if (strValor == "") {
            return true;
        }

        var rut = strValor;
        var er = / |-|\./g;
        rut = rut.replace(er, "");
        var DV = rut.substring(rut.length - 1, rut.length);
        if (isNaN(DV)) DV = DV.toUpperCase();
        var parteNumerica = rut.substring(0, rut.length - 1);

        if (_VerificaRut(parteNumerica) == DV) {
            strValor = rut;
            return true;
        }
        else {
            return false;
        }
    };

    let _VerificaRut = function (iRut) {
        var digit;
        var ind;
        var Lar;
        var Suma;
        var RutAux;
        var DigCal;
        var fac;

        DigCal = "";
        RutAux = iRut;
        Lar = RutAux.length;
        if (Lar < 9) {
            var Cad = "000000000";
            RutAux = Cad.substr(1, 9 - Lar) + RutAux;
        }
        fac = "432765432";
        Suma = 0;
        ind = 9;
        while (ind > 1) {
            Pa = RutAux.substr(ind - 1, 1);
            Pb = fac.substr(ind - 1, 1);
            Suma = parseFloat(Suma) + parseFloat(Pa) * parseFloat(Pb);
            ind = ind - 1;
        }
        digit = 11 - (Suma - parseInt(Suma / 11) * 11);
        if (digit == 10) {
            DigCal = "K";
        } else {
            if (digit == 11) {
                DigCal = 0;
            } else {
                DigCal = digit;
            }
        }
        return DigCal;
    };

    // USUARIO
    let _ObtenerUsuarioLogueado = function () {
        if (sessionStorage.getItem("Usuario")) {
            return JSON.parse(sessionStorage.getItem("Usuario"));
        }

        return null;
    };

    let _ObtenerDatoUsuarioLogueado = function (dato) {
        let usuario = _ObtenerUsuarioLogueado();

        return usuario[dato];
    };


    //Retorna objeto con metodos publicos
    return {
        init: function () {
            _Init();
        },
        Get: _Get,
        Post: _Post,
        ValidaRut: _ValidaRut,
        Ready: _Ready,
        Ejecutar: _Ejecutar,
        OnEnter: _OnEnter,
        ClickMenuIzquierdo: _ClickMenuIzquierdo,
        ClickMenuUsuario: _ClickMenuUsuario,
        FechaToTextoHace: _FechaToTextoHace,
        ReiniciarCarousel: _ReiniciarCarousel,
        CerrarSesion: _CerrarSesion,
        ObtenerUsuarioLogueado: _ObtenerUsuarioLogueado,
        ObtenerDatoUsuarioLogueado: _ObtenerDatoUsuarioLogueado,
        HacerZoomImagen: _HacerZoomImagen,
        SimularClick: _SimularClick
    };
}();

document.addEventListener("DOMContentLoaded", function () {
    Opensoft.init();
    Opensoft.Ejecutar().forEach(function (init) {
        init();
    });
});