const CACHE = "uid-cache-v6";

self.addEventListener("install", (event) => {
    console.log("!!!!! install");

    event.waitUntil(
        caches.open(CACHE).then((cache) => cache.addAll(["./main.js"]))
    );
});

self.addEventListener("activate", (event) => {
    console.log("Активирован");

    caches.open(CACHE).then((cache) => {
        console.log(cache.keys());
    });
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
        caches.match(event.request)
            .then((resp) => resp.json())
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
