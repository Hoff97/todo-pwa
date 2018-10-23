import * as React from 'react';
import { CategoryInfo } from 'src/util/category';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'react-day-picker/lib/style.css';
import { EnhancedSuggest } from './EnhancedSuggest';

export interface Props {
    value: string;
    categories: CategoryInfo[];
    addTodo: (str: string) => void;
    undo: () => void;
    redo: () => void;
    login: () => void;
    loggedIn: boolean;
    inputChanged: (str: string) => void;
}

function wrapInput(input: JSX.Element, undo: () => void, redo: () => void, login: () => void, loggedIn: boolean) {
    return (
        <div className="input-group">
            {input}
            <div className="input-group-append">
                <button className="btn btn-outline-secondary" type="submit"
                    id="button-addon2"><FontAwesomeIcon icon="plus" /></button>
                <button onClick={e => undo()} className="btn btn-primary" type="button"><FontAwesomeIcon icon="undo" /></button>
                <button onClick={e => redo()} className="btn btn-primary" type="button"><FontAwesomeIcon icon="redo" /></button>
                {!loggedIn &&
                    <button onClick={e => login()} className="btn btn-primary" type="button"><FontAwesomeIcon icon="user" /></button>
                }
            </div>
        </div>
    );
}

export function Buttons({ value, addTodo, undo, redo, inputChanged, categories, loggedIn, login }: Props) {
    return (
        <div className="mb-2">
            <form onSubmit={e => { e.preventDefault(); addTodo(value); }}>
                <EnhancedSuggest value={value} change={inputChanged} categories={categories}
                    wrapInput={input => wrapInput(input, undo, redo, login, loggedIn)} />
            </form>
        </div>
    );
}