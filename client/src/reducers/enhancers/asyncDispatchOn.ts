import { Reducer, Action } from 'redux';

export function withNewState<A extends Action<any>, T>(f: (oldState: T, action: A, newState: T) => void) {
    return (reducer: Reducer<T, A>): Reducer<T, A> => {
        return (state: T, action: A) => {
            let newState = reducer(state, action);
            f(state, action, newState);
            return newState;
        }
    }
}