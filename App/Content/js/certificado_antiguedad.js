let Certificados = function () {

    let _Init = function () {
        if (!sessionStorage.getItem("Usuario")) {
            location.href = "login.html";
        }
    };

    let _BuscarCertificadoAntiguedad = function () {
                
        let usuarioId = Opensoft.ObtenerDatoUsuarioLogueado("UsuarioId");

        Opensoft.Post("Certificados", "ObtenerCertificadoAntiguedad", { usuarioId: usuarioId }, function (data) {

            document.querySelector('.contenido-certificado-antiguedad').innerHTML = "";

            let usuario = data.Usuario;
            let fechaActual = data.FechaActual;
            let certificado = "";

            certificado += '<div class="contenedor-certificado" id="certificado">';
            certificado += '<div class="contenedor-logo">';
            certificado += '    <img src="../Content/images/LogoCertificado.png" class="imagen-certificado" />';
            certificado += '</div>';
            certificado += '<div class="contenedor-titulo">';
            certificado += '    <h2 class="titulo-certificado">Certificado de Antigüedad</h2>';
            certificado += '</div>';
            certificado += '<div class="contenedor-texto">';
            certificado += '    <h4>';
            certificado += '        Viña Carmen S.A., certifica que don/a, <b>' + usuario.Nombre + '</b>,';
            certificado += '        R.U.T. <b>' + usuario.Rut + '</b>, es empleado de nuestra empresa desde el ' + usuario.FechaIngreso + ',';
            certificado += '        desempeñándose en el cargo de <b>' + usuario.OfiCargo + '</b>. y su contrato se encuentra <b>' + usuario.TipoContrato + '</b> a la fecha.';
            certificado += '    </h4>';
            certificado += '    <h4 style="margin-bottom: 35px;">';
            certificado += '        Se extiende el presente certificado a petición del';
            certificado += '        interesado para los fines que estime convenientes,';
            certificado += '        sin ulterior responsabilidad para nuestra empresa.';
            certificado += '    </h4>';
            certificado += '</div>';
            certificado += '<div class="contenedor-firma">';
            certificado += '    <img src="../Content/images/logo-negro.png" class="imagen-logo" />';
            certificado += '    <img src="../Content/images/firma-marta.png" class="imagen-firma" />';
            certificado += '</div>';
            certificado += '<div class="contenedor-firmante">';
            certificado += '    <p class="text-center">MARTA VALENZUELA HENRIQUEZ <br>GERENTE DE RECURSOS HUMANOS</p>';
            certificado += '</div>';
            certificado += '<div class="contenedor-fecha-actual">';
            certificado += '    <h4>Santiago, ' + fechaActual + '</h4>';
            certificado += '</div>';
            certificado += '<div class="contenedor-disclaimer">';
            certificado += '    <hr />';
            certificado += '    <h6 class="disclaimer">';
            certificado += '        <small>';
            certificado += '            La información contenida en este certificado puede ser corroborada con el área Gestión de Personas de Santa Rita Estate, al teléfono <strong>+56 2 22 22 222</strong>.<br>';
            certificado += '            El presente certificado no es válido para gestionar crédito en Cajas de Compensación ni en Cooperativas. (Superintendencia de Seguridad Circular N°2 - 5052 de año 2003, modificada por la circular N°2 - 824 del año 2012).';
            certificado += '        </small>';
            certificado += '    </h6>';
            certificado += '</div>';
            certificado += '</div>';
            certificado += '<br />';

            document.querySelector('.contenido-certificado-antiguedad').innerHTML = certificado;

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
            _BuscarCertificadoAntiguedad();
        }
    };
}();

Opensoft.Ready(function () {
    Certificados.init();
});