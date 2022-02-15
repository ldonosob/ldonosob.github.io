let Cumpleanos = function () {

    let _Init = function () {
        if (!sessionStorage.getItem("Usuario")) {
            location.href = "login.html";
        }


        _CargarCumpleanos(new Date().toISOString().slice(0, 10).replaceAll("-",""));
    };

    let _CargarCumpleanos = function (fecha) {
        
        let usuarioId = Opensoft.ObtenerDatoUsuarioLogueado("UsuarioId");
        let params = "usuarioId=" + encodeURIComponent(usuarioId) + "&fecha=" + encodeURIComponent(fecha);


        Opensoft.Get("Cumpleano", "ObtenerCumpleanos", params, function (data) {
           
            let divCumpleanos = document.querySelector('.contenedor-lista-cumpleanos');
            let elemento = "";

            if(data.Cumpleanos != null && data.Cumpleanos.length > 0){

                data.Cumpleanos.forEach(function (cumpleano) {

                    elemento +=  '<div class="cumpleano">';
                    elemento +='<div class="nombre">';
                    elemento +=     '<label><span class="fa fa-gift"></span> ' + cumpleano.Nombres + ' '+ cumpleano.ApPaterno + ' ' + cumpleano.ApMaterno + '</label>';
                    elemento +='</div>';
                    elemento +='<div class="cumpleanero">';
                    elemento +=    '<div class="div-imagen-cumpleanero">';
                    elemento +=        '<img class="imagen-cumpleanero" src="' + cumpleano.UrlFoto + '">';
                    elemento +=    '</div>';
                    elemento +=    '<div class="datos-cumpleanero">';
                    elemento +=        '<p><span class="fa fa-envelope"></span> Email: ' + cumpleano.Email + '</p>';
                    elemento +=        '<p><span class="fa fa-user"></span> Cargo: ' + cumpleano.Cargo + '</p>';
                    elemento +=        '<p><span class="fa fa-phone"></span> Fono: ' + cumpleano.Fono + '</p>';
                    elemento +=    '</div>';
                    elemento +='</div>';
                    elemento +='</div>';  

                });

                divCumpleanos.innerHTML = elemento;
            }
            else
            {
                elemento += '<div class="no-cumpleanos">'
                elemento += '<h3>No existen cumpleaños para la fecha seleccionada.</h3>'
                elemento += '</div>'
                
                divCumpleanos.innerHTML = elemento;
            }

        }, function (respuesta, data) {
            console.log('Error', 'Error al obtener la información del documento');
        });
    };   

    return {
        init: function () {
            _Init();
        },    
        cargarCumpleanos:_CargarCumpleanos
        
    };
}();

Opensoft.Ready(function () {
    Cumpleanos.init();
});