let Offline = function () {

    return {
        init: function () {
            console.log("Página Offline");
        }
    };
}();

Opensoft.Ready(function () {
    Login.init();
});