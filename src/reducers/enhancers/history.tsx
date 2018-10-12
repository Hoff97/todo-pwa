import { Action } from 'redux';

export interface HistoryState<I> {
    state: I;
    previous: I[];
    next: I[];
}

export const UNDO_HISTORY = 'UNDO_HISTORY';
export type UNDO_HISTORY = typeof UNDO_HISTORY;

export const REDO_HISTORY = 'REDO_HISTORY';
export type REDO_HISTORY = typeof REDO_HISTORY;
export interface UndoHistory extends Action {
    type: UNDO_HISTORY;
}

export interface RedoHistory extends Action {
    type: REDO_HISTORY;
}

export function undo(): UndoHistory {
    return {
        type: UNDO_HISTORY
    }
}

export function redo(): RedoHistory {
    return {
        type: REDO_HISTORY
    }
}

export type HistoryAction = UndoHistory | RedoHistory;

export type WithHistoryAction<A> = A | HistoryAction

export function initHistory<I>(state: I): HistoryState<I> {
    return {
        state: state,
        previous: [],
        next: []
    }
}

export function historyReducer<I>(reducer: (state: I | undefined, action: Action | {}) => I) {
    const initState = initHistory(reducer(undefined, {}));
    return function (state: HistoryState<I>, action: HistoryAction | Action) {
        if (state === undefined) {
            return initState;
        }
        switch (action.type) {
            case UNDO_HISTORY:
                if (state.previous.length > 0) {
                    return {
                        state: state.previous[0],
                        previous: state.previous.slice(1),
                        next: [state.state, ...state.next]
                    }
                } else {
                    return state;
                }
            case REDO_HISTORY:
                if (state.next.length > 0) {
                    return {
                        state: state.next[0],
                        next: state.next.slice(1),
                        previous: [state.state, ...state.previous]
                    }
                } else {
                    return state;
                }
        }
        const newState = reducer(state.state, action);
        if (state.state === newState) {
            return state;
        } else {
            return {
                state: newState,
                previous: [state.state, ...state.previous],
                next: []
            }
        }
    }
}