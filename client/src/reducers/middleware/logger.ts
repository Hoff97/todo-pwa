import { Middleware } from "redux";

export const logger: Middleware = store => next => action => {
    console.log('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState());
    return result
}