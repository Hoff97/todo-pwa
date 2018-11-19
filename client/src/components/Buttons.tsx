import * as React from 'react';
import { CategoryInfo } from 'src/util/category';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'react-day-picker/lib/style.css';
import { EnhancedSuggest } from './EnhancedSuggest';

export interface Props {
    value: string;
    categories: CategoryInfo[];
    addTodo: (str: string) => void;
    inputChanged: (str: string) => void;
    showInstall: boolean;
    install: () => void;
}

function wrapInput(input: JSX.Element, showInstall: boolean, install: () => void) {
    return (
        <div className="input-group">
            {input}
            <div className="input-group-append">
                <button className="btn btn-outline-secondary" type="submit"
                    id="button-addon2"><FontAwesomeIcon icon="plus" /></button>
                {showInstall &&
                    <button onClick={e => install()} className="btn btn-primary" type="button"><FontAwesomeIcon icon="download" /></button>
                }
            </div>
        </div>
    );
}

export function Buttons({ value, addTodo, inputChanged, categories, showInstall, install }: Props) {
    return (
        <div className="mb-2 todo-input-bar">
            <form onSubmit={e => { e.preventDefault(); addTodo(value); }}>
                <EnhancedSuggest value={value} change={inputChanged} categories={categories}
                    wrapInput={input => wrapInput(input, showInstall, install)} />
            </form>
        </div>
    );
}