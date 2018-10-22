import * as React from 'react';
import * as Autocomplete from 'react-autocomplete';
import { HTMLProps, CSSProperties } from 'react';
import { longestPreSuffix } from 'src/util/string';
import { dateDescrToDate } from 'src/util/todo';
import { CategoryInfo } from 'src/util/category';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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

function renderInput(props: HTMLProps<HTMLInputElement>, undo: () => void, redo: () => void, loggedIn: boolean, login: () => void) {
    return (
        <div className="input-group">
            <input {...props} type="text" className="form-control" placeholder="Todo"
                aria-label="Recipient's username" aria-describedby="button-addon2" />
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
    type: 'prio' | 'category' | 'date' | 'reminder';
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

function category(category: string, color: string): ACOption {
    return {
        type: 'category',
        payload: color,
        label: '#' + category
    }
}

function reminder(time: string): ACOption {
    return {
        type: 'reminder',
        payload: time,
        label: 'r:' + time
    }
}

function itemsForValue(value: string, categories: CategoryInfo[]) {
    var items: ACOption[] = [];
    items = [...items, ...[5, 4, 3, 2, 1].map(prio)]
    items = [...items, ...categories.map(cat => category(cat.name, cat.color))]
    items = [...items,
    ...['today', 'tomorrow', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(date)]
    items = [...items, ...['morning', 'noon', 'afternoon', 'evening'].map(rem => reminder(rem))]
    return items.filter(item => longestPreSuffix(value, item.label) > 0);
}

function appendACOption(value: string, opt: string) {
    const match = longestPreSuffix(value, opt);
    return value.substring(0, value.length - match) + opt + ' ';
}

function renderItem(item: ACOption, isHighlighted: boolean) {
    return (
        <div style={{ background: isHighlighted ? 'lightgray' : 'white' }} className="autocomplete-item"
            key={item.label}>
            {item.type === 'prio' &&
                <span className={'ml-2 prio ' + 'ml-2 prio' + item.payload}>{item.payload}</span>
            }
            {item.type === 'category' &&
                <span style={{ color: item.payload }} className="ml-2">{item.label}</span>
            }
            {item.type === 'date' &&
                <span className="ml-2">{item.payload} ({dateDescrToDate(item.payload).format('DD.MM.')})</span>
            }
            {item.type === 'reminder' &&
                <span className="ml-2"><FontAwesomeIcon icon="bell"></FontAwesomeIcon> {item.payload}</span>
            }
        </div>
    );
}

export function Buttons({ value, addTodo, undo, redo, inputChanged, categories, loggedIn, login }: Props) {
    const acItems = itemsForValue(value, categories)
    return (
        <div className="mb-2">
            <form onSubmit={e => { e.preventDefault(); addTodo(value) }}>
                <Autocomplete
                    getItemValue={(item) => item.label}
                    items={acItems}
                    open={acItems.length > 0}
                    renderItem={renderItem}
                    wrapperStyle={{ width: '100%' }}
                    renderInput={props => renderInput(props, undo, redo, loggedIn, login)}
                    value={value}
                    onChange={(e) => inputChanged(e.target.value)}
                    onSelect={(val) => inputChanged(appendACOption(value, val))}
                    menuStyle={menuStyle}
                />
            </form>
        </div>
    );
}