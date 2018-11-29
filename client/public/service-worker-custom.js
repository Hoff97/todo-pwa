console.log('Hello');

function actionTitle(action) {
    if (action === 'done') {
        return 'Done';
    }
    return '';
}

self.addEventListener('push', function (event) {
    const payload = event.data.json();
    const actions = [];
    for (let action of payload.actions) {
        actions.push({
            action: action,
            title: actionTitle(action)
        });
    }
    console.log(payload);
    event.waitUntil(
        self.registration.showNotification(payload.title, {
            body: payload.content,
            icon: '/favicon.ico',
            actions: actions,
            data: { id: payload.data, token: payload.token }
        }));
});

self.addEventListener('notificationclick', function (event) {
    var messageId = event.notification.data;
    event.notification.close();
    if (event.action === 'done') {
        markDone(event.notification.data.id, event.notification.data.token);
    }
}, false);

const dbName = 'data';
const table = 'todo';

function markDone(id, token) {
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
                fetch('/api/v1/todo', {
                    body: todoToJson(todo),
                    method: 'PUT',
                    headers: {
                        'x-auth-token': token,
                        'Content-Type': 'application/json'
                    }
                });
            }
        };
    };
}

function nAry(n, l) {
    var s = n + "";
    while(s.length < l) {
        s = "0" + s;
    }
    return s;
}

function todoToJson(todo) {
    var day = `${nAry(todo.timestamp.getFullYear(), 4)}-${nAry(todo.timestamp.getMonth()+1, 2)}-${nAry(todo.timestamp.getDate(),2)}`;
    var time = `${nAry(todo.timestamp.getHours(), 2)}:${nAry(todo.timestamp.getMinutes(), 2)}:${nAry(todo.timestamp.getSeconds(), 2)}`;
    todo.timestamp = day + " " + time;
    return JSON.stringify([todo]);
}