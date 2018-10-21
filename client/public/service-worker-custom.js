console.log('Hello');

function actionTitle(action) {
    return 'Testtitle';
}

self.addEventListener('push', function (event) {
    const payload = event.data.json();
    console.log(payload);
    const actions = [];
    for(let action of payload.actions) {
        actions.push({
            action: action,
            title: actionTitle(action)
        });
    }
    event.waitUntil(
        self.registration.showNotification(payload.title, {
            body: payload.content,
            icon: '/favicon.ico',
            actions: actions
        }));
});