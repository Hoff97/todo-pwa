export interface Todo {
    id: string;
    name: string;
    done: boolean;
    priority?: number;
    date?: Date;
    category?: string;
}

export type StoreState = Todo[];