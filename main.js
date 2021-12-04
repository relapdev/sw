const value = localStorage.getItem('smthKey');

if (!value) localStorage.setItem('smthKey', '12345');

for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    console.log('!!!!! localStorage', {[key]: localStorage.getItem(key)});
}

// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./sw.js').
//     then(function(registration) {
//         // Registration was successful
//         console.log('ServiceWorker registration successful with scope: ', registration.scope);
//         window.top.postMessage({uid: `ServiceWorker registration successful with scope: ${registration.scope}`}, '*')
//     }, function(err) {
//         // registration failed :(
//         console.log('ServiceWorker registration failed: ', err);
//         window.top.postMessage({uid: `ServiceWorker registration failed: ${err}`}, '*')
//
//     });
// }

window.addEventListener('message', (e) => {
    const {data} = e;

    console.log('!!!!! data', data);


    localStorage.setItem(data.key, data.value)

    // ------------

    const uid = data.value;
    const url = 'https://relapdev.github.io/sw/store';

    const request = new Request(url);

    const responseOptions = {
        headers: {
            "Content-Type": "application/json",
        },
        status: 200,
        ok: true,
        url,
    };

    const CACHE = 'v1'

    const cacheMatchOptions = {ignoreSearch: true, ignoreVary: true};

    caches.open(CACHE)
        .then((cache) => cache.match(request, cacheMatchOptions))
        .then((resp) => resp ? resp.json() : {uid: ''})
        .then((resp) => {
            const respBody = {uid: `${resp.uid}_${uid}`};

            const jsonResponse = new Response(
                JSON.stringify(respBody),
                responseOptions
            );

            caches.open(CACHE).then((cache) => {
                cache.put(request, jsonResponse)
            })

            window.top.postMessage(respBody, '*')
        })


    // fetch(`https://relapdev.github.io/sw/request.html/?uid=${data.value}`)
    //     .then((resp) => resp.json())
    //     .then((resp) => {
    //         console.log('!!!!! resp', resp);
    //         window.top.postMessage(resp, '*')
    //     })
})
