let Home = function () {

    let _Init = function () {
        if (!sessionStorage.getItem("Usuario")) {
            location.href = "login.html";
        }

        let usuarioId = Opensoft.ObtenerDatoUsuarioLogueado("UsuarioId");

        Opensoft.Get("Home", "ObtenerDatos", "usuarioId=" + encodeURIComponent(usuarioId), function (data) {
            if (data.AccesosHome) {
                localStorage.setItem('accesosHome', JSON.stringify(data.AccesosHome));
                _CargarSeccionAccesosHome(data.AccesosHome);
            }

            if (data.SiempreConectados) {
                localStorage.setItem('siempreConectados', JSON.stringify(data.SiempreConectados));
                _CargarSeccionSiempreConectados(data.SiempreConectados);
            }

            if (data.NoticiasDestacadas) {
                localStorage.setItem('noticiasDestacadas', JSON.stringify(data.NoticiasDestacadas));
                _CargarSeccionNoticiasDestacadas(data.NoticiasDestacadas)
            }

            if (data.EntrevistaDelMes) {
                localStorage.setItem('entrevistaDelMes', JSON.stringify(data.EntrevistaDelMes));
                _CargarEntrevistaDelMes(data.EntrevistaDelMes)
            }

            if (data.DescorchadoDelMes) {
                localStorage.setItem('descorchadoDelMes', JSON.stringify(data.DescorchadoDelMes));
                _CargarSeccionDescorchadoMes(data.DescorchadoDelMes);
            }

            if (data.EspacioTedwine) {
                localStorage.setItem('espacioTedwine', JSON.stringify(data.EspacioTedwine));
                _CargarSeccionEspacioTedwine(data.EspacioTedwine);
            }


        }, function (respuesta, data) {

            if (localStorage.getItem('accesosHome')) {

                let accesosHome = JSON.parse(localStorage.getItem('accesosHome'));
                _CargarSeccionAccesosHome(accesosHome);
            }

            if (localStorage.getItem('siempreConectados')) {

                let siempreConectados = JSON.parse(localStorage.getItem('siempreConectados'));
                _CargarSeccionSiempreConectados(siempreConectados);
            }

            if (localStorage.getItem('noticiasDestacadas')) {

                let noticiasDestacadas = JSON.parse(localStorage.getItem('noticiasDestacadas'));
                _CargarSeccionNoticiasDestacadas(noticiasDestacadas);
            }

            if (localStorage.getItem('entrevistaDelMes')) {

                let entrevistaDelMes = JSON.parse(localStorage.getItem('entrevistaDelMes'));
                _CargarEntrevistaDelMes(entrevistaDelMes);
            }

            if (localStorage.getItem('descorchadoDelMes')) {

                let descorchadoDelMes = JSON.parse(localStorage.getItem('descorchadoDelMes'));
                _CargarSeccionDescorchadoMes(descorchadoDelMes);
            }

            if (localStorage.getItem('espacioTedwine')) {

                let espacioTedwine = JSON.parse(localStorage.getItem('espacioTedwine'));
                _CargarSeccionEspacioTedwine(espacioTedwine);
            }
        });
    };

    let _ToggleSeccionHome = function (boton, selector) {

        if (boton.classList.contains('fa-chevron-down')) {
            boton.classList.remove('fa-chevron-down');
            boton.classList.add('fa-chevron-right');
            document.querySelector(selector).style.display = 'none';
        } else if (boton.classList.contains('fa-chevron-right')) {
            boton.classList.add('fa-chevron-down');
            boton.classList.remove('fa-chevron-right');
            document.querySelector(selector).style.display = 'block';
        }
    };

    let _ToggleSeccionHomeDiv = function (div, selector) {

        let icono = div.querySelector("i");        
        
        if (icono.classList.contains('fa-chevron-down')) {
            icono.classList.remove('fa-chevron-down');
            icono.classList.add('fa-chevron-right');
            document.querySelector(selector).style.display = 'none';
        } else if (icono.classList.contains('fa-chevron-right')) {
            icono.classList.add('fa-chevron-down');
            icono.classList.remove('fa-chevron-right');
            document.querySelector(selector).style.display = 'block';
        }
    };
    
    // SECCIÓN ACCESOS HOME
    let _CargarSeccionAccesosHome = function (accesosHome) {
        let accesos = document.querySelector(".seccion-accesos-home .contenedor-seccion-home");
        accesos.innerHTML = '';

        accesosHome.forEach(function (acceso) {
            let accesoHome = '';
            accesoHome += '<a href="' + acceso.Url + '" class="acceso-home color-' + acceso.Color + '"  target="' + acceso.Target + '">';
            accesoHome += '    <div class="contenedor-icono-acceso">';
            accesoHome += '        <i class="icono-acceso ' + acceso.Icono + '"></i>';
            accesoHome += '    </div>';
            accesoHome += '    <div class="contenedor-texto-acceso">';
            accesoHome += '        <h4 class="texto-acceso">' + acceso.Texto + '</h4>';
            accesoHome += '    </div>';
            accesoHome += '</a>';

            accesos.innerHTML += accesoHome;
        });

    };

    // SECCIÓN SIEMPRE CONECTADOS
    let _CargarSeccionSiempreConectados = function (siempreConectados) {
        if (siempreConectados.length > 0) {
            let fotoInicial = siempreConectados[0];
            document.querySelector('.imagen-principal-siempre-conectados').src = fotoInicial.UrlFoto;
            document.querySelector('.info-imagen-principal .me-gusta-imagen-principal span').innerHTML = fotoInicial.CantMeGusta;
            document.querySelector('.info-imagen-principal .cant-comentarios-imagen-principal span').innerHTML = fotoInicial.CantComentarios;
            document.querySelector('.info-imagen-principal .fecha-imagen-principal').innerHTML = moment(fotoInicial.Fecha, 'DD/MM/YYYY').format('LL');
            document.querySelector('.nota-imagen-principal').innerHTML = fotoInicial.Nota;
            document.querySelector('.imagen-principal-siempre-conectados').setAttribute('data-foto', JSON.stringify(fotoInicial));

            //Like
            if (fotoInicial.LikeUsuario != "0") {
                document.querySelector('.me-gusta-imagen-principal i').style.color = "red";
            } else {
                document.querySelector('.me-gusta-imagen-principal i').style.color = "";
            } 

            _CargarComentariosSiempreConectados(fotoInicial.Comentarios);

            document.querySelector('.contenedor-otras-imagenes .otras-imagenes').innerHTML = "";
            siempreConectados.forEach(function (foto) {

                var div = document.createElement('div');
                div.className = "elemento-carousel";
                div.onclick = function () {
                    Home.CambiarFotoSiempreConectados(this);
                };

                div.innerHTML = '<img src="' + foto.UrlFoto + '" class="foto-elemento-carousel" />';
                div.setAttribute('data-foto', JSON.stringify(foto));

                document.querySelector('.contenedor-otras-imagenes .otras-imagenes').appendChild(div);                
            });
            
            _IniciarSliderSiempreConectados();
        }
    };

    let _CambiarFotoSiempreConectados = function (div) {

        var foto = JSON.parse(div.dataset.foto);

        document.querySelector('.imagen-principal-siempre-conectados').src = foto.UrlFoto;
        document.querySelector('.info-imagen-principal .me-gusta-imagen-principal span').innerHTML = foto.CantMeGusta;
        document.querySelector('.info-imagen-principal .cant-comentarios-imagen-principal span').innerHTML = foto.CantComentarios;
        document.querySelector('.info-imagen-principal .fecha-imagen-principal').innerHTML = moment(foto.Fecha, 'DD/MM/YYYY').format('LL');
        document.querySelector('.nota-imagen-principal').innerHTML = foto.Nota;

        if (foto.LikeUsuario != "0") {
            document.querySelector('.me-gusta-imagen-principal i').style.color = "red";
        } else {
            document.querySelector('.me-gusta-imagen-principal i').style.color = "";
        }

        //Div comentario
        document.querySelector('.imagen-principal-siempre-conectados').setAttribute('data-foto', JSON.stringify(foto));

        _CargarComentariosSiempreConectados(foto.Comentarios);
    };

    let _CargarComentariosSiempreConectados = function (comentarios) {
        document.querySelector('.comentarios-imagen-principal').innerHTML = "";

        if (comentarios && comentarios.length > 0) {
            comentarios.forEach(function (comentario, index) {
                let hace = Opensoft.FechaToTextoHace(comentario.FechaComentario);

                let strComentario = '';
                strComentario += '<div class="comentario-imagen-principal ' + (index < 2 ? "visible" : "") + '">';
                strComentario += '    <div class="foto-usuario-comentario">';
                strComentario += '        <img src="' + comentario.UrlFotoUsuario + '" />';
                strComentario += '    </div>';
                strComentario += '    <div class="contenedor-info-comentario">';
                strComentario += '        <div class="info-comentario">';
                strComentario += '            <label class="nombre-usuario-comentario">' + comentario.Usuario + '</label>';
                strComentario += '            <label class="hace-dias-comentario">' + hace + '</label>';
                strComentario += '        </div>';
                strComentario += '         <label class="comentario">"' + comentario.Comentario + '"</label>';
                strComentario += '    </div>';
                strComentario += '</div>';
                document.querySelector('.comentarios-imagen-principal').innerHTML += strComentario;
            });

            if (comentarios && comentarios.length > 2) {
                document.querySelector('.ver-todos-coment-imagen-principal').style.visibility = "visible";
                let boton = document.querySelector('.ver-todos-coment-imagen-principal label');
                boton.querySelector("label").innerHTML = "Ver más comentarios"
                let icono = boton.querySelector("i");
                icono.classList.add("fa-chevron-down");
                icono.classList.remove("fa-chevron-up");
            } else {
                document.querySelector('.ver-todos-coment-imagen-principal').style.visibility = "hidden";
            }
        } else {
            document.querySelector('.comentarios-imagen-principal').innerHTML = "<label>Sin comentarios...</label>";
            document.querySelector('.ver-todos-coment-imagen-principal').style.visibility = "hidden";
        }

    };

    let _CargarTodosLosComentarios = function (boton) {
        let todosComentarios = document.querySelectorAll(".comentario-imagen-principal").length;
        let comentariosVisibles = document.querySelectorAll(".comentario-imagen-principal.visible").length;

        if (todosComentarios == comentariosVisibles) {
            document.querySelectorAll(".comentario-imagen-principal").forEach(function (comentario, index) {
                if (index > 1) {
                    comentario.classList.remove("visible");
                    comentariosVisibles--;
                }
            });
        } else {
            document.querySelectorAll(".comentario-imagen-principal:not(.visible)").forEach(function (comentario, index) {
                if (index < 4) {
                    comentario.classList.add("visible");
                    comentariosVisibles++;
                }
            });
        }

        let texto = boton.querySelector("label");
        let icono = boton.querySelector("i");

        if (comentariosVisibles == todosComentarios) {
            texto.innerHTML = "Ver menos comentarios"
            icono.classList.add("fa-chevron-up");
            icono.classList.remove("fa-chevron-down");
        } else {
            texto.innerHTML = "Ver más comentarios"
            icono.classList.remove("fa-chevron-up");
            icono.classList.add("fa-chevron-down");
        }
    };
        
    // NOTICIAS DESTACADAS

    // SECCIÓN NOTICIAS DESTACADAS
    let _CargarSeccionNoticiasDestacadas = function (noticias) {
        
        document.querySelector('.seccion-noticias-destacadas .contenedor-slider').innerHTML = "";

        // NOTICIAS PRINCIPALES EN PORTADA PARA EL CAROUSEL
        noticias.filter((n) => n.EnPortada && n.EsPrincipal).forEach(function (noticia) {

            let elemento = '';

            elemento += '<div class="slide">';
            elemento += '<div class="contenedor-imagen">';
            elemento += '<a title="' + noticia.Titulo + '" href="' + noticia.UrlNoticia + '"><img class="slider-image" src="' + noticia.UrlFoto + '" /></a>';
            elemento += '</div>';
            elemento += '<div class="texto-elemento-slide">' + noticia.Titulo + '</div>';
            elemento += '<a class="link-noticia-principal" href="' + noticia.UrlNoticia + '">';
            elemento +=     '<p class="resumen-noticia-principal">' + noticia.Resumen + '</p>';
            elemento +=     '<div class="ver-mas-noticia-principal">';
            elemento +=      '  <span>Ver más <i class="fa fa-chevron-right"></i></span>';
            elemento +=     '</div>';
            elemento += '</a>';
            elemento += '</div>';

            document.querySelector('.seccion-noticias-destacadas .contenedor-slider').innerHTML += elemento;
        });

        
        //document.querySelector('.seccion-articulos-destacados-home .contenedor-seccion-home .noticias-destacadas').innerHTML = "";

        //// TOMAMOS LAS OTRAS 2 PRIMERAS NOTICIAS EN PORTADA QUE NO SON PRINCIPALES PARA ABAJO DEL CAROUSEL 
        //noticias.filter((n) => n.EnPortada && !n.EsPrincipal).forEach(function (noticia, index) {
        //    if (index < 2) {
        //        let tipo = index % 2 > 0 ? 'par' : 'impar';
        //        let elemento = '';

        //        if (tipo == 'impar') {
        //            elemento += '<a class="noticia-destacada odd" href="' + noticia.UrlNoticia + '">';
        //            elemento += '    <div class="imagen-noticia-destacada">';
        //            elemento += '        <img src="' + noticia.UrlFoto + '" />';
        //            elemento += '    </div>';
        //            elemento += '    <div class="titulo-noticia-destacada">';
        //            elemento += '        <div class="diagonal-titulo-noticia-destacada">&nbsp;</div>';
        //            elemento += '        <label>' + noticia.Titulo + '</label>';
        //            elemento += '    </div>';
        //            elemento += '</a>';
        //        }

        //        if (tipo == 'par') {
        //            elemento += '<a class="noticia-destacada even" href="' + noticia.UrlNoticia + '">';
        //            elemento += '    <div class="titulo-noticia-destacada">';
        //            elemento += '        <div class="diagonal-titulo-noticia-destacada">&nbsp;</div>';
        //            elemento += '        <label>' + noticia.Titulo + '</label>';
        //            elemento += '    </div>';
        //            elemento += '    <div class="imagen-noticia-destacada">';
        //            elemento += '        <img src="' + noticia.UrlFoto + '" />';
        //            elemento += '    </div>';
        //            elemento += '</a>';
        //        }

        //        document.querySelector('.seccion-articulos-destacados-home .contenedor-seccion-home .noticias-destacadas').innerHTML += elemento;
        //    }
        //});

        _IniciarSliderNoticias();
    };

    let _CargarEntrevistaDelMes = function (entrevistaMes) {

        document.querySelector('.seccion-home.seccion-entrevista-del-mes-home .contenedor-seccion-home').innerHTML = "";

        let seccionEntrevistaDelMes = "";

        seccionEntrevistaDelMes += '<img class="foto-entrevista-del-mes" onclick="Opensoft.HacerZoomImagen(this, \'' + entrevistaMes.Titulo + '\')" src="' + entrevistaMes.UrlFoto + '" />';

        seccionEntrevistaDelMes += '<a href="noticia.html?argCuerpoId=3&argEdicionId=">'
        seccionEntrevistaDelMes += '<label class="resumen-entrevista-del-mes">' + entrevistaMes.Resumen + '</label>';
        seccionEntrevistaDelMes += '<div class="ver-mas-entrevista-del-mes">';
        seccionEntrevistaDelMes += '<span>Ver más entrevistas del mes<i class="fa fa-chevron-right"></i></span>';
        seccionEntrevistaDelMes += '</div>';
        seccionEntrevistaDelMes += '</a>'

        document.querySelector('.seccion-home.seccion-entrevista-del-mes-home .contenedor-seccion-home').innerHTML = seccionEntrevistaDelMes;

    }
           
    // SECCIÓN DESCORCHADO MES
    let _CargarSeccionDescorchadoMes = function (descorchadoMes) {
        
        document.querySelector('.seccion-home.seccion-descorchado-mes-home .contenedor-seccion-home').innerHTML = "";

        let seccionDescorchado = "";

        seccionDescorchado += '<img class="foto-descorchado " onclick="Opensoft.HacerZoomImagen(this, \'' + descorchadoMes.Titulo + '\')" src="' + descorchadoMes.UrlFoto + '" />';

        seccionDescorchado += '<a href="noticia.html?argCuerpoId=4&argEdicionId=">'
        seccionDescorchado +=   '<label class="resumen-descorchado">' + descorchadoMes.Resumen + '</label>';
        seccionDescorchado +=   '<div class="ver-mas-descorchados">';
        seccionDescorchado +=       '<span>Ver más descorchados <i class="fa fa-chevron-right"></i></span>';
        seccionDescorchado +=   '</div>';
        seccionDescorchado += '</a>'

        document.querySelector('.seccion-home.seccion-descorchado-mes-home .contenedor-seccion-home').innerHTML = seccionDescorchado;
    };

    let _IniciarSliderNoticias = function () {

        var slider = tns({
            "container": ".contenedor-slider",
            "controlsContainer": null,
            "items": 1,
            "slideBy": "page",
            "autoplay": true,
            "mouseDrag": true,
            "controls": false,
            "controlsPosition": "bottom",
            "speed": 400,
            "swipeAngle": false,
            "autoplayButton": false,
            "autoplayButtonOutput": false,
            "touch": true
        });

    };

    let _IniciarSliderSiempreConectados = function () {

        var slider = tns({
            "container": "#sliderSiempreConectados",
            "controlsContainer": null,
            "items": 4,
            "slideBy": "page",
            "autoplay": true,
            "mouseDrag": true,
            "controls": false,
            "controlsPosition": "bottom",
            "speed": 400,
            "swipeAngle": false,
            "autoplayButton": false,
            "autoplayButtonOutput": false,
            "touch": true
        });

    };

    //Espacio Ted Wine
    let _CargarSeccionEspacioTedwine = function (espacioTedwine) {
        let videoTedwine = espacioTedwine.UrlVideo;
        document.querySelector('.seccion-espacio-tedwine-home .video-tedwine').setAttribute('src', videoTedwine);
        document.querySelector('.seccion-espacio-tedwine-home .ver-mas-tedwine a').href = espacioTedwine.UrlCarpeta
    };

    let _MostrarPopUpComentario = function () {

        document.body.style.overflow = "hidden";

        // Obtiene el modal de imagen
        var modal = document.getElementById('divModalComentario');

        modal.style.display = "block";
    }
       
    let _OcultarPopUpComentario = function () {

        document.body.style.overflow = "auto";
        document.querySelector('.modal-comentario .modal-contenido-comentario textarea').value = "";

        // Obtiene el modal de imagen
        var modal = document.getElementById('divModalComentario');

        setTimeout(function () {
            modal.style.display = "none";
        }, 400);
    }

    let _InsertarComentario = function () {

        var foto = JSON.parse(document.querySelector('.imagen-principal-siempre-conectados').dataset.foto);

        let usuario = Opensoft.ObtenerDatoUsuarioLogueado("UsuarioId");
        let fotoId = foto.FotoId;
        let comentario = document.querySelector('.input-comentario').value;; 

        let params = {
            FotoId: fotoId,
            Usuario: usuario,
            Comentario: comentario
        };        

        Opensoft.Post("Home", "InsertarComentario", params, function (data) {

            alert("Comentario ingresado correctamente... A la espera de ser aprobado por el administrador.")
            _OcultarPopUpComentario();

        }, function (respuesta, data) {

             _OcultarPopUpComentario();

            if (data) {
                alert(data.Mensaje);                

            } else {
                alert("Su solicitud no pudo ser procesada");
                console.log("Error: ", respuesta);
            }
        });
    }
    
    let _ProcesarLike = function () {
                       
        var divFoto = [];
        var foto = document.querySelector('.imagen-principal-siempre-conectados').dataset.foto;
        var objFoto = JSON.parse(foto);

        //Obtiene div con info de la fotografía
        let divFotoSiempreConectado = document.querySelectorAll('#sliderSiempreConectados .elemento-carousel');

        divFotoSiempreConectado.forEach(function (divSC) {

            var fotoDiv = divSC.dataset.foto;

            if (fotoDiv == foto) {

                divFoto.push(divSC);
                console.log('div igual');
            }
        });
      
        let usuario = Opensoft.ObtenerDatoUsuarioLogueado("UsuarioId");
        let fotoId = objFoto.FotoId;
        let like = objFoto.LikeUsuario == '0' ? '1' : '0';

        let params = {
            FotoId: fotoId,
            Usuario: usuario,
            Like: like
        };

        Opensoft.Post("Home", "ProcesarLike", params, function (data) {

            let cantidadMG = Number(document.querySelector('.me-gusta-imagen-principal span').innerHTML);

            if (like != "0") {
                document.querySelector('.me-gusta-imagen-principal i').style.color = "red";
                cantidadMG = cantidadMG + 1;

            } else {
                document.querySelector('.me-gusta-imagen-principal i').style.color = "";
                cantidadMG = cantidadMG - 1;
            }

            objFoto.CantMeGusta = cantidadMG;
            objFoto.LikeUsuario = like;

            //Div comentario
            document.querySelector('.imagen-principal-siempre-conectados').setAttribute('data-foto', JSON.stringify(objFoto));

            //like
            divFoto.forEach(function (divConDataFoto) {
                divConDataFoto.setAttribute('data-foto', JSON.stringify(objFoto));
            });            

            document.querySelector('.me-gusta-imagen-principal span').innerHTML = cantidadMG.toString();

        }, function (respuesta, data) {

            if (data) {
                alert(data.Mensaje);

            } else {
                alert("Su solicitud no pudo ser procesada");
                console.log("Error: ", respuesta);
            }
        });
    }
    
    return {
        init: function () {
            _Init();
        },
        CambiarFotoSiempreConectados: _CambiarFotoSiempreConectados,
        CargarTodosLosComentarios: _CargarTodosLosComentarios,
        ToggleSeccionHome: _ToggleSeccionHome,
        ToggleSeccionHomeDiv: _ToggleSeccionHomeDiv,
        MostrarPopupComentario: _MostrarPopUpComentario,
        OcultarPopUpComentario: _OcultarPopUpComentario,
        InsertarComentario: _InsertarComentario,
        ProcesarLike: _ProcesarLike
    };
}();

Opensoft.Ready(function () {
    Home.init();
});