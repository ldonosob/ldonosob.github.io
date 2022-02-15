if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("/serviceWorker.js")
            .then(res => {
                console.log("service worker registered");
            })
            .catch(err => {
                console.log("service worker not registered", err);
                alert("Ocurrió un error inténtelo nuevamente actualizando la pagina");
            })
    })
} else {
    window.location.href = "error.html";
}

let instaladoAndroid = false;

//Función que obtiene todas las aplicaciones instaladas y compara con el id y en el caso de estar. (Sólo Android)
navigator.getInstalledRelatedApps().then(relatedApps => {

    relatedApps.forEach((app) => {

        if (app.id == 'SantaRita-App') {

            instaladoAndroid = true;
            console.log(instaladoAndroid);
        }
    });
});



// Detects if device is on iOS 
const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
}

// Detects if device is in standalone mode
const isInStandaloneMode = () => (window.matchMedia('(display-mode: standalone)').matches);
const isFullScreen = () => (window.matchMedia('(display-mode: fullscreen)').matches);


//Está Instalado
if (isInStandaloneMode() == true && ( isIos() == true || instaladoAndroid == true )) {
    
    if (sessionStorage.getItem("Usuario")) {

        location.href = "App/Layout/home.html";
    } else {

        location.href = "App/Layout/login.html";
    }  
}
else if (!isInStandaloneMode() == true && isIos() == true) {

    document.getElementById('divMensajeIphone').style.display = "block";
    document.getElementById('divInstalacion').style.display = "none";
    document.getElementById('divMensajeEspera').style.display = "none";
    document.getElementById('divYaInstalado').style.display = "none";

}
else if (!isInStandaloneMode() == true && instaladoAndroid == true)
{
    document.getElementById('divMensajeIphone').style.display = "none";
    document.getElementById('divInstalacion').style.display = "none";
    document.getElementById('divMensajeEspera').style.display = "none";
    document.getElementById('divYaInstalado').style.display = "block";
}
else {
    if (isIos()) {
        document.getElementById('divMensajeIphone').style.display = "block";
        document.getElementById('divInstalacion').style.display = "none";
        document.getElementById('divMensajeEspera').style.display = "none";
        document.getElementById('divYaInstalado').style.display = "none";
    }
    else if (EstaInstaladoEnPC() && !isInStandaloneMode())
    {
        document.getElementById('divMensajeIphone').style.display = "none";
        document.getElementById('divInstalacion').style.display = "none";
        document.getElementById('divMensajeEspera').style.display = "none";
        document.getElementById('divYaInstalado').style.display = "block";
    }
    else if (EstaInstaladoEnPC() && isInStandaloneMode()) {

        if (sessionStorage.getItem("Usuario")) {

            location.href = "App/Layout/home.html";
        } else {

            location.href = "App/Layout/login.html";
        }
    }
    else {
        document.getElementById('divMensajeIphone').style.display = "none";
        document.getElementById('divInstalacion').style.display = "block";
        document.getElementById('divMensajeEspera').style.display = "none";
        document.getElementById('divYaInstalado').style.display = "none";
    }  
}


window.addEventListener('beforeinstallprompt', (e) => {

    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA

    document.getElementById('divInstalacion').style.display = "block";
    document.getElementById('divMensajeEspera').style.display = "none";
    document.getElementById('divMensajeIphone').style.display = "none";
    document.getElementById('divYaInstalado').style.display = "none";
       

    // Optionally, send analytics event that PWA install promo was shown.
    console.log(`Pre evento de instacion disparado.`);
});

window.addEventListener('appinstalled', (evt) => {
       
    // Clear the deferredPrompt so it can be garbage collected
    deferredPrompt = null;
    // Optionally, send analytics event to indicate successful install
    console.log('La aplicación ya esta instalada');

    // Hide the app-provided install promotion
    if (sessionStorage.getItem("Usuario")) {

        location.href = "App/Layout/home.html";
    } else {

        location.href = "App/Layout/login.html";
    }
});

async function invocarInstalacion() {

    // Se esconde popUp
    document.getElementById('divInstalacion').style.display = "none";
    document.getElementById('divMensajeEspera').style.display = "block";
    document.getElementById('divMensajeIphone').style.display = "none";
    document.getElementById('divYaInstalado').style.display = "none";


    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // Optionally, send analytics event with outcome of user choice
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    deferredPrompt = null;
}

function EstaInstaladoEnPC() {

    if (typeof deferredPrompt === 'undefined') {
        return true;
    }
    else {
        return false;
    }
}