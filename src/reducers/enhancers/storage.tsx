import { Action } from 'redux';

export function initByStorage<I>(key: string, state: I): I {
    const storage = localStorage.getItem(key);
    if(storage !== undefined && storage !== null) {
        return JSON.parse(storage);
    }
    return state;
}

export function saveReducer<I>(key: string, reducer: (state: I | undefined, action: Action | {}) => I) {
    const initState = initByStorage(key, reducer(undefined, {}));
    return function (state: I, action: Action) {
        if (state === undefined) {
            return initState;
        }
        const newState = reducer(state, action);
        if (state !== newState) {
            localStorage.setItem(key, JSON.stringify(newState));
        }
        return newState;
    }
}