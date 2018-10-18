console.log('Hello');

self.addEventListener('push', function (event) {
    event.waitUntil(
        self.registration.showNotification('ServiceWorker Cookbook', {
            body: 'Yay',
        }));
});