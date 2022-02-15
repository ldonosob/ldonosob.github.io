let Noticia = function () {

    let _Init = function () {
        if (!sessionStorage.getItem("Usuario")) {
            location.href = "login.html";
        }

        var url_string = window.location.href;
        var url = new URL(url_string);
        
        //Obtener argumentos desde la URL
        let instanciaId = url.searchParams.get("argInstanciaId");
        let cuerpoId = url.searchParams.get("argCuerpoId");        
        let edicionId = url.searchParams.get("argEdicionId");
        let noticiaId = url.searchParams.get("argNoticiaId");
        let usuarioId = Opensoft.ObtenerDatoUsuarioLogueado("UsuarioId");

        let argumentosURL = "instanciaId=" + instanciaId + "&cuerpoId=" + cuerpoId + "&edicionId=" + edicionId + "&noticiaId=" + noticiaId + "&usuarioId=" + encodeURIComponent(usuarioId);

        Opensoft.Get("Noticia", "ObtenerDetalle", argumentosURL, function (data) {

            _CargarNoticia(data);

        }, function (respuesta, data) {

            console.log('respuesta', respuesta);
            console.log('data', data);
        });
       
    };

    let _CargarNoticia = function (noticia) {

        if (noticia) {

            if (noticia.TipoDespliegue == 1) //Detalle Noticia
            {
                _CargarDetalleNoticia(noticia.Detalle);
            }
            else {                          //Lista Noticias
                _CargarListaNoticias(noticia.Detalle);
            }            
        }
    }


    let _CargarDetalleNoticia = function (noticia) {

        document.querySelector('.contenido-noticia').innerHTML = "";

        let noticiaHtml = ""

        noticiaHtml +=  '<div class="seccion-home seccion-noticia">';
        noticiaHtml +=      '<div class="contenedor-seccion-noticia">';
        noticiaHtml +=          '<img class="foto-portada-noticia" onclick="Opensoft.HacerZoomImagen(this,\'' + noticia.Titulo + '\' )" src="' + noticia.BannerPortada + '" />';
        noticiaHtml +=          '<div class="fecha-noticia">';
        noticiaHtml +=              '<span>' + noticia.Dia + '</span>';
        noticiaHtml +=              '</br>';
        noticiaHtml +=              noticia.Mes;
        noticiaHtml +=          '</div >'; 
        noticiaHtml +=          '<div class="contenedor-titulo-noticia">';
        noticiaHtml +=              '<h1 class="titulo-noticia">' + noticia.Titulo + '</h1>';
        noticiaHtml +=              '<h4 class="resumen-noticia">' + noticia.Resumen+ '</h4>';
        noticiaHtml +=          '</div>'
        noticiaHtml +=          '<label class="contenido-noticia">' + noticia.Contenido + '</label>';
        noticiaHtml +=      '</div>';
        noticiaHtml += '</div>';

        document.querySelector('.contenido-noticia').innerHTML = noticiaHtml;
    }

    let _CargarListaNoticias = function (lista) {        

        document.querySelector('.contenido-noticia').innerHTML = "";

        let listaNoticiaHtml = '<div class="seccion-home seccion-noticia">';

        lista.forEach(function (noticia, index) {

            listaNoticiaHtml += '<div class="contenedor-seccion-noticia">';
            
            listaNoticiaHtml += '<div class="contenedor-imagen-noticia">';

            listaNoticiaHtml += '   <a title="' + noticia.Titulo +'" href="' + noticia.UrlNoticia + '"><img class="imagen-noticia" src="' + noticia.BannerPortada + '" /></a>';

            listaNoticiaHtml += '</div>';
            listaNoticiaHtml +=     '<a class="vinculo-noticia" href="' + noticia.UrlNoticia + '">';
            listaNoticiaHtml +=         '<span class="fecha-publicacion">Publicado el: ' + noticia.FechaOcurrencia + '</span>';
            listaNoticiaHtml +=         '<div class="titulo-noticia" ><h3 class="titulo-resumen-noticia">' + noticia.Titulo + '</h3></div>';
            listaNoticiaHtml +=         '<div class="resumen-noticia" >';
            listaNoticiaHtml +=             '<p>';
            listaNoticiaHtml +=                 noticia.Resumen;
            listaNoticiaHtml +=             '<p>';
            listaNoticiaHtml +=         '</div>';   
            listaNoticiaHtml +=         '<div class="contenedor-seguir-leyendo">';
            listaNoticiaHtml +=             '<div class="seguir-leyendo" > Seguir leyendo <i class="fa fa-chevron-right"></i></div>';
            listaNoticiaHtml +=         '</div>';
            listaNoticiaHtml +=     '</a>';
            listaNoticiaHtml += '</div>';

        });

        listaNoticiaHtml += '</div>';

        document.querySelector('.contenido-noticia').innerHTML = listaNoticiaHtml;
    }
       
    return {
        init: function () {
            _Init();
        },
    };
}();

Opensoft.Ready(function () {
    Noticia.init();
});