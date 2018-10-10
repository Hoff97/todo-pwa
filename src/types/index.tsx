export interface Todo {
    id: string;
    name: string;
    done: boolean;
}

export enum TodoFilter {
    ALL, DONE, UNDONE
}

export interface StoreState {
    todos: Todo[];
    shownTodos: TodoFilter;
}