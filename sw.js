const CACHE = "uid-cache-v7";

self.addEventListener("install", (event) => {
    console.log("!!!!! install");

    // event.waitUntil(
    //     caches.open(CACHE).then((cache) => cache.addAll(["./main.js"]))
    // );

    self.skipWaiting()
});

self.addEventListener("activate", (event) => {
    console.log("Активирован");

    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
    console.log("Происходит запрос на сервер");
    console.log("!!!!!", event.request);

    const { url } = event.request;

    const uid = new URL(url).searchParams.get("uid");

    if (!uid) {
        event.respondWith(fetch(event.request));
        return;
    }

    console.log("!!!!! uid", uid);

    event.respondWith(
            caches.match(event.request, {ignoreSearch: true})
            .then((resp) => resp ? resp.json() : {uid: ''})
            .then((resp)=> {
                console.log("!!!!! event.request", resp);
                return (
                    caches.open(CACHE).then((cache) => {
                        const options = {
                            headers: {
                                "Content-Type": "application/json",
                            },
                            status: 200,
                            ok: true,
                            url: event.request.url,
                        };

                        const jsonResponse = new Response(JSON.stringify({ uid: `${resp.uid}_${uid}` }), options);

                        console.log("!!!!! response", jsonResponse);
                        cache.put(event.request, jsonResponse.clone());
                        return jsonResponse;
                    })
                );
        })
    );

});
