import * as React from 'react';
import * as Autocomplete from 'react-autocomplete';
import { HTMLProps, CSSProperties } from 'react';
import { longestPreSuffix } from 'src/util/string';
import { dateDescrToDate } from 'src/util/todo';

export interface Props {
    value: string;
    categories: string[];
    addTodo: (str: string) => void;
    undo: () => void;
    redo: () => void;
    inputChanged: (str: string) => void;
}

function renderInput(props: HTMLProps<HTMLInputElement>) {
    return (
        <div className="input-group mb-3">
            <input {...props} type="text" className="form-control" placeholder="Todo"
                aria-label="Recipient's username" aria-describedby="button-addon2" />
            <div className="input-group-append">
                <button className="btn btn-outline-secondary" type="submit"
                    id="button-addon2">Add Todo</button>
            </div>
        </div>
    )
}

const menuStyle: CSSProperties = {
    borderRadius: '0px 0px 5px 5px',
    border: '1px solid #AAA',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
    background: 'rgba(255, 255, 255, 0.9)',
    fontSize: '90%',
    position: 'fixed',
    overflow: 'auto',
    maxHeight: '50%',
}

interface ACOption {
    type: 'prio' | 'category' | 'date';
    payload: any;
    label: string;
}

function prio(prio: number): ACOption {
    return {
        type: 'prio',
        payload: prio,
        label: '!' + prio
    }
}

function date(date: string): ACOption {
    return {
        type: 'date',
        payload: date,
        label: '@' + date
    }
}

function category(category: string): ACOption {
    return {
        type: 'category',
        payload: category,
        label: '#' + category
    }
}

function itemsForValue(value: string, categories: string[]) {
    var items: ACOption[] = [];
    items = [...items, ...[5, 4, 3, 2, 1].map(prio)]
    items = [...items, ...categories.map(category)]
    items = [...items,
    ...['today', 'tomorrow', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(date)]
    return items.filter(item => longestPreSuffix(value, item.label) > 0);
}

function appendACOption(value: string, opt: string) {
    const match = longestPreSuffix(value, opt);
    return value.substring(0, value.length - match) + opt + ' ';
}

function renderItem(item: ACOption, isHighlighted: boolean) {
    return (
        <div style={{ background: isHighlighted ? 'lightgray' : 'white' }} className="autocomplete-item">
            {item.type === 'prio' &&
                <span className={'prio ' + 'prio' + item.payload}>{item.payload}</span>
            }
            {item.type === 'category' &&
                <span>{item.payload}</span>
            }
            {item.type === 'date' &&
                <span>{item.payload} ({dateDescrToDate(item.payload).format('DD.MM.')})</span>
            }
        </div>
    );
}

export function Buttons({ value, addTodo, undo, redo, inputChanged, categories }: Props) {
    const acItems = itemsForValue(value, categories)
    return (
        <div>
            <form onSubmit={e => { e.preventDefault(); addTodo(value) }}>
                <Autocomplete
                    getItemValue={(item) => item.label}
                    items={acItems}
                    open={acItems.length > 0}
                    renderItem={renderItem}
                    wrapperStyle={{ width: '100%' }}
                    renderInput={props => renderInput(props)}
                    value={value}
                    onChange={(e) => inputChanged(e.target.value)}
                    onSelect={(val) => inputChanged(appendACOption(value, val))}
                    menuStyle={menuStyle}
                />
            </form>
            <button onClick={e => undo()} className="btn btn-primary mr-2">Undo</button>
            <button onClick={e => redo()} className="btn btn-primary">Redo</button>
        </div>
    );
}