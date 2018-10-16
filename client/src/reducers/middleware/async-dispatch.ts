import { Middleware } from "redux";
import { Action } from 'redux-actions';

export type AsyncDispatchAction<T> = Action<T> & { asyncDispatch: (action: Action<any>) => void }

export const asyncDispatchMiddleware: Middleware<(action: AsyncDispatchAction<any>) => void> = store => next => action => {
    let syncActivityFinished = false;
    let actionQueue: Action<any>[] = [];

    function flushQueue() {
        actionQueue.forEach(a => store.dispatch(a));
        actionQueue = [];
    }

    function asyncDispatch(asyncAction: Action<any>) {
        actionQueue = actionQueue.concat([asyncAction]);

        if (syncActivityFinished) {
            flushQueue();
        }
    }

    const actionWithAsyncDispatch =
        Object.assign({}, action, { asyncDispatch });

    const res = next(actionWithAsyncDispatch);

    syncActivityFinished = true;
    flushQueue();

    return res;
};