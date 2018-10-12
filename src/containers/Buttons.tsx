import { connect } from 'react-redux';
import { addTodo, TodoAction } from '../actions';
import { Dispatch } from 'redux';
import * as React from 'react';
import { redo, HistoryAction, undo } from 'src/reducers/enhancers/history';

function ButtonsF({ dispatch }: { dispatch: Dispatch<TodoAction | HistoryAction> }) {
    let input: HTMLInputElement
    return (
        <div>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    if (!input.value.trim()) {
                        return
                    }
                    dispatch(addTodo(input.value))
                    input.value = ''
                }}
            >
                <input
                    ref={node => {
                        input = node as HTMLInputElement
                    }}
                />
                <button type="submit">
                    Add Todo
                </button>
            </form>
            <button onClick={e => dispatch(undo())}>Undo</button>
            <button onClick={e => dispatch(redo())}>Redo</button>
        </div>
    )
}

let Buttons = connect()(ButtonsF)

export default Buttons