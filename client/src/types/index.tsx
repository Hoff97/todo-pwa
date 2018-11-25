import * as moment from 'moment';
import { Location } from 'history';

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
    created: Date;
}

export interface TFile extends Timestamped {
    id: string;
    name: string;
    data: string;
    todoFk: string;
}

export type UserSettings = {
    mail: boolean;
    notificationTime: moment.Moment;
}

export interface Sub {
    id: string;
    endpoint: string;
    deviceDescription: string;
    timestamp: string;
}

export type UIState = {
    inputValue: string;
    editingTodo?: string;
    editValue: string;
    loggingIn: boolean;
    accessToken?: string;
    filterCategory?: string;
    showInstall: boolean;
    showSettings: boolean;
    userSettings: UserSettings;
    menuOpen: boolean;
    subscriptions: Sub[];
}

export type StoreState = {
    todos: Todo[];
    ui: UIState;
    routing: Location;
}