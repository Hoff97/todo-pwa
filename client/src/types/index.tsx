import { HistoryState } from 'src/reducers/enhancers/history';

export interface Timestamped {
    timestamp: Date;
    serverTimestamp?: Date;
}

export interface Todo extends Timestamped {
    id: string;
    name: string;
    done: boolean;
    priority?: number;
    date?: Date;
    category?: string;
    reminder?: Date;
    files: TFile[];
    comment?: string;
}

export interface TFile extends Timestamped {
    id: string;
    name: string;
    data: string;
    todoFk: string;
}

export type UIState = {
    inputValue: string;
    editingTodo?: string;
    editValue: string;
    loggingIn: boolean;
    accessToken?: string;
    filterCategory?: string;
}

export type StoreState = {
    todos: HistoryState<Todo[]>;
    ui: UIState;
}