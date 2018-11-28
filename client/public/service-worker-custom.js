console.log('Hello');

function actionTitle(action) {
    if (action === 'done') {
        return 'Done';
    }
    return '';
}

self.addEventListener('push', function (event) {
    const payload = event.data.json();
    console.log(payload);
    const actions = [];
    for (let action of payload.actions) {
        actions.push({
            action: action,
            title: actionTitle(action)
        });
    }
    event.waitUntil(
        self.registration.showNotification(payload.title, {
            body: payload.content,
            icon: '/favicon.ico',
            actions: actions,
            data: payload.data
        }));
});

self.addEventListener('notificationclick', function (event) {
    var messageId = event.notification.data;
    event.notification.close();
    console.log(event);
    if (event.action === 'done') {
        markDone(event.notification.data);
    }
}, false);

const dbName = 'data';
const table = 'todo';

function markDone(id) {
    const request = indexedDB.open(dbName, 2);

    request.onsuccess = ev => {
        db = request.result;
        const tableRequest = db.transaction(table).objectStore(table).get(id);
        tableRequest.onsuccess = _succ => {
            todo = tableRequest.result;
            todo.done = true;
            todo.timestamp = new Date();

            const updateRequest = db.transaction(table, 'readwrite').objectStore(table).put(todo, todo.id);
            updateRequest.onsuccess = _ev => {
                console.log('Updated todo!');
            }
        };
    };
}