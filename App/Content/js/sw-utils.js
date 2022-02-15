// Guardar  en el cache dinamico
function actualizaCacheDinamico( dynamicCache, req, res ) {

    if (res.ok) {

        if (req.method === 'POST') {
            //console.log('No se puede guardar un metodo POST en cache');
            return res.clone();
        }
        else {
            return caches.open(dynamicCache).then(cache => {

                //Si es una llamada a la API, válida que el codigo sea 0 para guardar en el caché.
                if (req.url.includes('/api/')) {

                    res.clone().json().then(data => {

                        if (data.Codigo == 0) {
                            cache.put(req, res);
                        }
                    })

                    return res.clone();
                }
                //Si la url incluye un video .mp4 lo 
                else if (req.url.includes('.mp4') || req.url.includes('.MP4')) {
                    return res.clone();
                }
                else {

                    cache.put(req, res.clone());
                    return res.clone();
                }
            });
        }

    }
    else if (res.type == 'opaque') {
        return caches.open(dynamicCache).then(cache => {

            cache.put(req, res.clone());
            return res.clone();
        });

    } else {

        console.log("error");

        if (req.headers.get('accept').includes('png') || req.headers.get('accept').includes('jpeg')) {

            return caches.match('App/Content/images/no_disponible.png');
        }
        else if (req.headers.get('accept').includes('text/html')) {

            return caches.match('App/Layout/offline.html');
        }
        else {

            return res;
        }
    }
}