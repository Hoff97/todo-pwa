console.log('Hello');

function actionTitle(action) {
    if (action === 'done') {
        return 'Done';
    } else if (action === 'remind+1h') {
        return 'Remind in 1 hour';
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
    event.waitUntil(fetch('/api/v1/push/notification/' + payload.id, {
        method: 'GET',
        headers: {
            'x-auth-token': payload.token
        }
    }).then(response => {
        if(response.status === 200) {
            return self.registration.showNotification(payload.title, {
                body: payload.content,
                icon: '/favicon.ico',
                actions: actions,
                data: { id: payload.data, token: payload.token, notificationId: payload.id }
            });
        }
    }).catch(error => {
        return self.registration.showNotification(payload.title, {
            body: payload.content,
            icon: '/favicon.ico',
            actions: actions,
            data: { id: payload.data, token: payload.token, notificationId: payload.id }
        });
    }));
});

self.addEventListener('notificationclick', function (event) {
    var messageId = event.notification.data;
    event.notification.close();

    const notificationId = event.notification.data.notificationId;
    const token = event.notification.data.token;
    
    fetch('/api/v1/push/notification/' + notificationId, {
        method: 'DELETE',
        headers: {
            'x-auth-token': token
        }
    });

    if (event.action === 'done') {
        markDone(event.notification.data.id, token);
    } else if (event.action === 'remind+1h') {
        remindAgain(event.notification.data.id, token, 1);
    }
}, false);

self.addEventListener('notificationclose', function (event) {
    var messageId = event.notification.data;

    const notificationId = event.notification.data.notificationId;
    const token = event.notification.data.token;
    
    fetch('/api/v1/push/notification/' + notificationId, {
        method: 'DELETE',
        headers: {
            'x-auth-token': token
        }
    });
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

function remindAgain(id, token, hours) {
    fetch('/api/v1/todo/remindAgain', {
        body: JSON.stringify({
            id,
            hours,
            timestamp: dateToStr(new Date())
        }),
        method: 'PUT',
        headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json'
        }
    });
}

function dateToStr(date) {
    var day = `${nAry(date.getFullYear(), 4)}-${nAry(date.getMonth()+1, 2)}-${nAry(date.getDate(),2)}`;
    var time = `${nAry(date.getHours(), 2)}:${nAry(date.getMinutes(), 2)}:${nAry(date.getSeconds(), 2)}`;
    return day + ' ' + time;
}

function nAry(n, l) {
    var s = n + "";
    while(s.length < l) {
        s = "0" + s;
    }
    return s;
}

function todoToJson(todo) {
    todo.timestamp = dateToStr(todo.timestamp);
    return JSON.stringify([todo]);
}