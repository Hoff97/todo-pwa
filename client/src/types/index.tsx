import { HistoryState } from 'src/reducers/enhancers/history';

export interface Todo {
    id: string;
    name: string;
    done: boolean;
    priority?: number;
    date?: Date;
    category?: string;
}

export type UIState = {
    inputValue: string;
    editingTodo?: string;
    editValue: string;
}

export type StoreState = {
    todos: HistoryState<Todo[]>;
    ui: UIState;
}