import { HistoryState } from 'src/reducers/enhancers/history';

export interface Todo {
    id: string;
    name: string;
    done: boolean;
    priority?: number;
    date?: Date;
    category?: string;
    timestamp: Date;
    reminder?: Date;
    serverTimestamp?: Date;
    files: TFile[];
    comment?: string;
}

export interface TFile {
    id: string;
    name: string;
    content: string;
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