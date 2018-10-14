export interface Todo {
    id: string;
    name: string;
    done: boolean;
}

export type StoreState = Todo[];