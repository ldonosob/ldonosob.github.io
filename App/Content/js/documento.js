let Documento = function () {
    let CarpetaId;
    let InstanciaId;
    let DocumentoId;
    let UsuarioId;

    let _Init = function () {
        
        if (!sessionStorage.getItem("Usuario")) {
            location.href = "login.html";
        }

        let url_string = window.location.href;
        let url = new URL(url_string);

        //Obtener argumentos desde la URL
        CarpetaId = url.searchParams.get("argCarpetaId");
        InstanciaId = url.searchParams.get("argInstanciaId");
        DocumentoId = url.searchParams.get("argDocumentoId");
        UsuarioId = Opensoft.ObtenerDatoUsuarioLogueado("UsuarioId");

        let params = "carpetaId=" + CarpetaId + "&instanciaId=" + InstanciaId + "&documentoId=" + DocumentoId + "&usuarioId=" + encodeURIComponent(UsuarioId);
        
        Opensoft.Get("Documento", "ObtenerDetalle", params, function (data) {
            _CargarElemento(data);
        }, function (respuesta, data) {
            console.log('Error', 'Error al obtener la información del documento');
        });
    };

    let _CargarElemento = function (data) {
        
        if (data.DetalleCarpeta) {
            _CargarCarpeta(data.DetalleCarpeta);
        } else if (data.DetalleDocumento) {
            _CargarDocumento(data.DetalleDocumento);
        } else if (data.DetalleInstancia) {
            _CargarInstancia(data.DetalleInstancia);
        }
    };

    let _CargarDocumento = function (documento) {
        let contenedor = document.querySelector('.detalle-documento');
        let contenido = contenedor.querySelector('.content-documento');
        let iframe = contenedor.querySelector('.iframe-documento');
        
        switch (documento.MostrarQueId) {

            case 1: //Texto
                contenido.innerHTML = documento.Contenido;
                contenido.style.display = 'flex';
                break;
            case 2: //REFERENCIA URL
                iframe.setAttribute('src', documento.ReferenciaURL);
                iframe.style.display = 'block';
                break;
            case 3: //Archivo Adjunto
                iframe.setAttribute('src', documento.UrlVisualizadorAtachado);
                //iframe.setAttribute('css', 'autoHeight');
                //iframe.setAttribute('name', 'objDocumento');
                //iframe.setAttribute('frameborder', '0');
                //iframe.setAttribute('height', '100%');
                //iframe.setAttribute('width', '100%');
                //iframe.setAttribute('scrolling', 'no');
                iframe.style.display = 'block';
                break;
            case 4: //Contenido
                contenido.innerHTML = documento.Contenido;
                contenido.style.display = 'block';
                break;
            case 5: //Vinculo a documento interno
                location.href = 'documento.html?argDocumentoId=' + documento.DocumentoOrigenId + '&argCarpetaId=' + documento.CarpetaId + '&argInstanciaId=' + InstanciaId;
                break;
            default: //Ninguno
                break;
        }

        contenedor.style.display = 'block';
    };

    let _CargarInstancia = function (instancia) {
        if (instancia.ListaCarpetas && instancia.ListaCarpetas.length > 0) {
            _CargarListadoCarpetas(instancia.Titulo, "", "", instancia.ListaCarpetas);
        } else if (instancia.ReferenciaURL) {
            location.href = instancia.ReferenciaURL.replace('../OpenDocs/Default.aspx', 'documento.html').replace('../OpenNews/Default.aspx', 'noticia.html');
        } else if (instancia.Contenido) {
            console.log(instancia.Contenido);
        }
    };

    let _CargarCarpeta = function (carpeta) {
        
        if (carpeta.ListaCarpetas && carpeta.ListaCarpetas.length > 0) {
            _CargarListadoCarpetas(carpeta.Nombre, carpeta.Descripcion, carpeta.UrlBanner, carpeta.ListaCarpetas);
        } else if (carpeta.ListaDocumentos && carpeta.ListaDocumentos.length > 0) {
            if (carpeta.ListaDocumentos.length > 1) {
                _CargarListadoDocumentos(carpeta.Nombre, carpeta.Descripcion, carpeta.UrlBanner, carpeta.ListaDocumentos);
            } else {
                location.href = 'documento.html?argDocumentoId=' + carpeta.ListaDocumentos[0].DocumentoId + '&argCarpetaId=' + carpeta.ListaDocumentos[0].CarpetaId + '&argInstanciaId=' + InstanciaId;
            }
        } else if (carpeta.ListaVideos && carpeta.ListaVideos.length > 0) {
            _CargarListadoVideos(carpeta.ListaVideos);
        }
        if (carpeta.PlantillaId == 21) { // wucDocs_wucDocumentosPlantilla13
            _CargarPlantilla13(carpeta);
            //Se ocultan eb duro
            document.querySelector('.imagen-listado').hidden = true;
            document.querySelector('.resumen-listado').hidden = true;
            document.querySelectorAll('.titulo-listado')[2].hidden = true;
        }
    };

    let _CargarListadoCarpetas = function (nombre, descripcion, banner, carpetas) {
        let contenedor = document.querySelector('.lista-carpetas');
        let listado = contenedor.querySelector('.listado');

        contenedor.querySelector('.titulo-listado h1').innerHTML = nombre;
        contenedor.querySelector('.resumen-listado p').innerHTML = descripcion;
        contenedor.querySelector('.imagen-listado').setAttribute('src', banner);

        if (!descripcion) contenedor.querySelector('.resumen-listado').style.display = 'none';
        if (!banner) contenedor.querySelector('.imagen-listado').style.display = 'none';

        listado.innerHTML = '';

        carpetas.forEach(function (carpeta) {
            let url = 'documento.html?argCarpetaId=' + carpeta.CarpetaId + '&argInstanciaId=' + InstanciaId;

            let elemento = '';
            elemento += '<a href="' + url + '" class="carpeta">';
            elemento += '    <div class="imagen-carpeta" style="background-image: url(' + carpeta.UrlFotoIcono + ')">&nbsp;</div>';
            elemento += '    <div class="contenedor-titulo-carpeta">';
            elemento += '        <label class="titulo-carpeta">' + carpeta.Nombre + '</label>';
            elemento += '    </div>';
            elemento += '</a>';

            listado.innerHTML += elemento;
        });

        contenedor.style.display = 'block';
    };

    let _CargarListadoDocumentos = function (nombre, descripcion, banner, documentos) {
        let contenedor = document.querySelector('.lista-documentos');
        let listado = contenedor.querySelector('.listado');

        contenedor.querySelector('.titulo-listado h1').innerHTML = nombre;
        contenedor.querySelector('.resumen-listado p').innerHTML = descripcion;
        contenedor.querySelector('.imagen-listado').setAttribute('src', banner);

        if (!descripcion) contenedor.querySelector('.resumen-listado').style.display = 'none';
        if (!banner) contenedor.querySelector('.imagen-listado').style.display = 'none';

        listado.innerHTML = '';

        documentos.forEach(function (documento) {
            let url = 'documento.html?argDocumentoId=' + documento.DocumentoId + '&argCarpetaId=' + documento.CarpetaId + '&argInstanciaId=' + InstanciaId;

            let elemento = '';
            elemento += '<a href="' + url + '" class="documento">';
            elemento += '    <div class="imagen-documento" style="background-image: url(' + documento.UrlFotoIcono + ')">&nbsp;</div>';
            elemento += '    <div class="contenedor-titulo-documento">';
            elemento += '        <label class="titulo-documento">' + documento.Titulo + '</label>';
            elemento += '    </div>';
            elemento += '</a>';

            listado.innerHTML += elemento;
        });

        contenedor.style.display = 'block';
    };

    let _CargarListadoVideos = function (listaVideos) {

        let contenedor = document.querySelector('.plantilla-video');
        

        if (listaVideos == null || listaVideos.length == 0) {
            console.log("lista videos vacía").
            return;
        }        

        let elemento = '';
        let primervideo = true;

        listaVideos.forEach(function (video) {

            if (primervideo) {

                elemento += '<div class="video-principal">';
                elemento +=     '<div class="contenedor-video">';
                elemento +=         '<h3 id="VideoTitulo">' + video.Titulo + '</h3>';
                elemento +=         '<p id="VideoResumen">' + video.Resumen + '</p>';
                elemento +=         '<video id="reproductor-galeria-video" class="reproductor-galeria-video" poster="/Repositorio/16656/imagen_.png" controls controlslist="nodownload" preload="none">';
                elemento +=         '<source src="'+ video.UrlVideo +'" type="video/mp4">';
                elemento +=         '</video>';
                elemento +=     '</div>';
                elemento += '</div>';
                
                primervideo = false;
            }                                                      
        });
        elemento += '<div class="video-miniaturas">';
        elemento +=     '<div class="bordes">';
        elemento +=         '<div class="div-titulo-video-miniatura">';
        elemento +=             '<div class="titulo-videos-miniatura">';
        elemento +=                  '<h4><b>Lista de videos:</b></h4>';
        elemento +=             '</div>';
        elemento +=         '</div>';

        listaVideos.forEach(function (video) {
            let strVideo = btoa(JSON.stringify(video));

            elemento += '<div class="caja-video" data-url="' + video.UrlVideo + '" onclick="Documento.VideoActualiza(\'' + strVideo + '\')" data-tipo="archivo" data-titulo="' + video.Titulo +'" data-resumen="' + video.Resumen + '">';
            elemento += '<img class="imagen-video" src="' + video.UrlImagen +'" alt="" />';
            elemento += '<div class="div-titulo-video">';
            elemento += '<span class="span-titulo-video-galeria">';
            elemento += video.Titulo;
            elemento += '</span>';
            elemento += '</div>';
            elemento += '</div>';

        });
       


        elemento +=     '</div>';
        elemento += '</div>';
               
        contenedor.innerHTML = elemento;        
    };

    let _VideoActualiza = function (strVideo) {

        video = JSON.parse(atob(strVideo));

        let contenedor = document.querySelector('.plantilla-video');

        console.log(video);
        console.log(video.UrlVideo);


        contenedor.querySelector('.reproductor-galeria-video source').setAttribute('src',  String(video.UrlVideo));
        contenedor.querySelector('.reproductor-galeria-video').load();


        //$("#reproductor-galeria-video source").attr("src", $(obj).data("url"));
        //$("#reproductor-galeria-video")[0].load();
        //$("#VideoTitulo").html($(obj).data("titulo"));
        //if ($("#VideoResumen").length > 0) {
        //    $("#VideoResumen").html($(obj).data("resumen"));
        //}
    };

    let _CargarPlantilla13 = function (carpeta) {
        let contenedor = document.querySelector('.wucDocumentosPlantilla13');
        let listado = contenedor.querySelector('.listado');
       
        contenedor.querySelector('.titulo-listado h1').innerHTML = carpeta.Nombre;
        contenedor.querySelector('.resumen-listado p').innerHTML = carpeta.Descripcion;
        contenedor.querySelector('.imagen-listado').setAttribute('src', carpeta.UrlBanner);
       
        if (!carpeta.Descripcion) contenedor.querySelector('.resumen-listado').style.display = 'none';
        if (!carpeta.UrlBanner) contenedor.querySelector('.imagen-listado').style.display = 'none';

        carpeta.ListaDocumentos.sort(function (doc1, doc2) {
            if (doc1.Titulo < doc2.Titulo) {
                return 1;
            } else {
                return -1;
            }
        }).forEach(function (documento) {
            let elemento = '';
            elemento += '<div class="elemento-carousel" data-url="' + documento.UrlFotoIcono + '" data-resumen="' + documento.Resumen.replace(/\"/g, "'") + '" onclick="Documento.CargarElementoPlantilla13(this)">';
            elemento += '    <img src="' + documento.UrlFotoIcono + '" class="foto-elemento-carousel" />';
            elemento += '    <div class="texto-elemento-carousel">';
            elemento += '        ' + documento.Titulo;
            elemento += '    </div>';
            elemento += '</div>';

            listado.innerHTML += elemento;
        });

        Opensoft.ReiniciarCarousel('.wucDocumentosPlantilla13 .carousel-opensoft');

        Opensoft.SimularClick(listado.querySelector('.elemento-carousel:nth-child(1)'));

        contenedor.style.display = 'block';
    };

    let _CargarElementoPlantilla13 = function (boton) {
        let contenedor = document.querySelector('.wucDocumentosPlantilla13');
        let urlFoto = boton.getAttribute('data-url');
        let resumen = boton.getAttribute('data-resumen');

        contenedor.querySelector(".detalle-carousel .imagen-detalle-carousel").setAttribute('src', urlFoto);
        contenedor.querySelector(".detalle-carousel .resumen-detalle-carousel").innerHTML = resumen;
    };

    return {
        init: function () {
            _Init();
        },
        CargarElementoPlantilla13: _CargarElementoPlantilla13,
        VideoActualiza: _VideoActualiza
    };

}();

Opensoft.Ready(function () {
    Documento.init();
});
