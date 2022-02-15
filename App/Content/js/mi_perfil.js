let MiPerfil = function () {

    let _Init = function () {
        if (!sessionStorage.getItem("Usuario")) {
            location.href = "login.html";
        }

        let usuario = JSON.parse(sessionStorage.getItem("Usuario"));

        _CargarMiPerfil(usuario);
    };

    let _CargarMiPerfil = function (usuario) {
        
        document.querySelector('.contenido-mi-perfil').innerHTML = "";

        let contenido = "";

        contenido += '<div class="titulo-seccion-mi-perfil">';
        contenido +=    '<div class="texto-titulo-seccion-mi-perfil">';
        contenido +=        '<label>Mi Perfil</label>';
        contenido +=    '</div>';
        contenido += '</div>';
        contenido +='<div class="contenedor-rosa">';
        contenido +=    '<div class="contenedor-izquierdo">';
        contenido +=    '</div>';
        contenido +=    '<div class="contenedor-nombre">';
        contenido +=        '<h2 class="texto-nombre">' + usuario.Nombre + '</h2>';
        contenido +=    '</div>';
        contenido += '</div>';
        contenido +='<div class="contenedor-gris">';
        contenido +=    '<div class="contenedor-izquierdo">';
        contenido +=        '<img class="imagen-usuario" src="' + usuario.UrlFoto + '" />';
        contenido +=    '</div>';
        contenido +=    '<div class="contenedor-texto">';
        contenido +=        '<h3 class="texto-cargo">' + usuario.OfiCargo + '<br />' + usuario.Empresa + '</h3>';
        contenido +=    '</div>';
        contenido +=    '<div class="contenedor-botones">';
        contenido +=        '<a href="saldo_vacaciones.html"><i class="icono-boton fa fa-calendar-alt"></i> <label class="texto-boton">Saldo de vacaciones</label></a>';
        contenido +=        '<a href="modificar_contrasena.html"><i class="icono-boton fa fa-lock"></i> <label class="texto-boton">Seguridad</label> </a>';
        contenido +=        '<a href="#" onclick="Opensoft.CerrarSesion()"><i class="icono-boton fa fa-sign-out-alt"></i> <label class="texto-boton">Salir</label></a>';
        contenido +=    '</div>';
        contenido += '</div>';

        document.querySelector('.contenido-mi-perfil').innerHTML = contenido;
    };   

    return {
        init: function () {
            _Init();
            _CargarMiPerfil;
        }        
    };
}();

Opensoft.Ready(function () {
    MiPerfil.init();
});