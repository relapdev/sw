const value = localStorage.getItem('smthKey');

if(!value) localStorage.setItem('smthKey', '12345');

for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    console.log('!!!!! localStorage', {[key]: localStorage.getItem(key)});
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').
    then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
    });
}

window.addEventListener('message', (e)=>{
    const { data } = e;

    console.log('!!!!! data', data);

    localStorage.setItem(data.key, data.value)

    fetch(`https://avs-git.github.io/relap/?uid=${data.value}`)
})
