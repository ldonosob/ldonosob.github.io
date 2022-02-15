let Vacaciones = function () {

    let _Init = function () {
        if (!sessionStorage.getItem("Usuario")) {
            location.href = "login.html";
        }
    };

    let _BuscarSaldoVacaciones = function () {
        let formularioVacaciones = document.querySelector('.formulario-vacaciones');
        let saldoVacaciones = document.querySelector('.saldo-vacaciones');

        let rut = formularioVacaciones.querySelector('.rut-usuario').value;
        let usuario = Opensoft.ObtenerDatoUsuarioLogueado("Username");

        Opensoft.Post("Vacaciones", "ObtenerVacaciones", { Usuario: usuario, Rut: rut }, function (data) {
            let fechaAl = moment(data.VacacionActualizadaAl, "DD/MM/YYYY");

            saldoVacaciones.querySelector(".nombre-usuario").innerHTML = data.Nombre;
            saldoVacaciones.querySelector(".actualizado b").innerHTML = fechaAl.format('DD [de] MMMM [del] YYYY');
            saldoVacaciones.querySelector(".dias-disponibles").innerHTML = data.VacacionLegal + ' Días';

            formularioVacaciones.style.display = "none";
            saldoVacaciones.style.display = "block";
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
            _Init();
        },
        BuscarSaldoVacaciones: _BuscarSaldoVacaciones
    };
}();

Opensoft.Ready(function () {
    Vacaciones.init();
});