import { Action } from 'redux';

export function initByStorage<I>(key: string, state: I, fallback: (contents: any) => I): I {
    const storage = localStorage.getItem(key);
    if(storage !== undefined && storage !== null) {
        return fallback(JSON.parse(storage));
    }
    return state;
}

export function idbReducer<I>(dbName: string, table: string, key: keyof I, reducer: (state: I[] | undefined, action: Action | {}) => I[], 
        comp: (a: I, b: I) => boolean, onLoaded: (items: I[]) => void) {
    const request = indexedDB.open(dbName, 2);
    var db: IDBDatabase;
    var initState: I[];

    request.onupgradeneeded = event => {
        if(event.target !== null) {
            var db: IDBDatabase = (event.target as any).result;
            db.createObjectStore(table);
        }
     }

    request.onsuccess = ev => {
        db = request.result;
        const tableRequest = db.transaction(table).objectStore(table).getAll();
        tableRequest.onsuccess = _succ => {
            initState = tableRequest.result;
            onLoaded(initState);
        };
    };

    
    return function (state: I[], action: Action) {
        if (state === undefined) {
            if(initState === undefined) {
                return [];
            }
            return initState;
        }
        var oldKeys = {};
        state.forEach(item => oldKeys[item[key] as unknown as string] = item);
        
        const newState = reducer(state, action);

        var newKeys = {};
        newState.forEach(item => newKeys[item[key] as unknown as string] = item);

        var newItems: I[] = [];
        var deleteKeys = [];
        var update: I[] = [];
        for(let key in oldKeys) {
            if(newKeys[key] === undefined) {
                deleteKeys.push(key);
            } else if(!comp(oldKeys[key], newKeys[key])){
                update.push(newKeys[key]);
            }
        }
        for(let key in newKeys) {
            if(oldKeys[key] === undefined) {
                newItems.push(newKeys[key]);
            }
        }

        const deleteQuery = db.transaction(table, 'readwrite').objectStore(table).delete(deleteKeys);
        deleteQuery.onsuccess = _ev => {
            addAll(db, table, key, newItems, () => {
                putAll(db, table, key, update, () => {console.log('Done updating')});
            });
        }

        return newState;
    }
}

function putAll<I>(db: IDBDatabase,  table: string, key: keyof I, items: I[], resolve: () => void) {
    if(items.length > 0) {
        const query = db.transaction(table, 'readwrite').objectStore(table).put(items[0], items[0][key] as unknown as string);
        query.onsuccess = _ev => {
            putAll(db, table, key, items.slice(1), resolve);
        };
    } else {
        resolve();
    }
}

function addAll<I>(db: IDBDatabase,  table: string, key: keyof I, items: I[], resolve: () => void) {
    if(items.length > 0) {
        const query = db.transaction(table, 'readwrite').objectStore(table).add(items[0], items[0][key] as unknown as string);
        query.onsuccess = _ev => {
            addAll(db, table, key, items.slice(1), resolve);
        };
    } else {
        resolve();
    }
}