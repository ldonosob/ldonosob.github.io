let Login = function () {

    let _Init = function () {
        if (sessionStorage.getItem("Usuario")) {
            location.href = "home.html";
        }
    };

    let _Ingresar = function () {
        let usuario = document.querySelector('.usuario-login');
        let clave = document.querySelector('.clave-login');

        let params = {
            Usuario: usuario.value,
            Clave: clave.value
        };

        Opensoft.Post("Login", "Login", params, function (data) {
            sessionStorage.setItem("Usuario", JSON.stringify(data));
            location.href = "home.html";
        }, function (respuesta, data) {
            if (data) {
                alert(data.Mensaje);
            } else {
                alert("Su solicitud no pudo ser procesada");
                console.log("Error: ", respuesta);
            }
        });
    };

    return {
        init: function () {
            console.log("Página Login");
            _Init();
        },
        Ingresar: _Ingresar
    };
}();

Opensoft.Ready(function () {
    Login.init();
});