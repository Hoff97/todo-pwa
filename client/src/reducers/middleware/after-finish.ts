import { Middleware } from "redux";
import { Action } from 'redux-actions';

export type AsyncFinishAction<T> = Action<T> & { asyncFinish: (func: () => void) => void }

export const asyncFinishMiddleware: Middleware<(action: AsyncFinishAction<any>) => void> = store => next => action => {
    let syncActivityFinished = false;
    let actionQueue: (() => void)[] = [];

    function flushQueue() {
        actionQueue.forEach(a => a());
        actionQueue = [];
    }

    function asyncFinish(func: () => void) {
        actionQueue = actionQueue.concat([func]);

        if (syncActivityFinished) {
            flushQueue();
        }
    }

    const actionWithAsyncDispatch =
        Object.assign({}, action, { asyncFinish });

    const res = next(actionWithAsyncDispatch);

    syncActivityFinished = true;
    flushQueue();

    return res;
};