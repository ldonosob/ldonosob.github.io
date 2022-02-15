let ModificarContrasena = function () {

    let _Init = function () {
        if (!sessionStorage.getItem("Usuario")) {
            location.href = "login.html";
        }
    };
       
    let _CambiarContrasena = function () {

        let formularioContrasena = document.querySelector('.contenedor-formulario');
        let contrasenaActual = formularioContrasena.querySelector('.contrasena-actual').value;
        let contrasena1 = formularioContrasena.querySelector('.contrasena-1').value;
        let contrasena2 = formularioContrasena.querySelector('.contrasena-2').value;

        if (contrasenaActual.trim().length == 0 || contrasena1.trim().length == 0 || contrasena2.trim().length == 0) { 
            alert("Ingrese todos los campos.");
        }
        else if (contrasena1 != contrasena2) {
            alert("Verifique que ambas contraseñas coincidan.");
        } else {
            
            let params = {
                Usuario: Opensoft.ObtenerDatoUsuarioLogueado("Username"),
                Clave: contrasenaActual,
                NuevaClave: contrasena2
            };

            Opensoft.Post("Login", "CambiarClave", params, function (data) {

                alert("Contraseña actualizada correctamente");
                location.href = "mi_perfil.html";
            }, function (respuesta, data) {
                alert(data.Mensaje); 
            });
        }
    }

    return {
        init: function () {
            _Init();           
        },
        CambiarContrasena: _CambiarContrasena
    };
}();

Opensoft.Ready(function () {
    ModificarContrasena.init();
});