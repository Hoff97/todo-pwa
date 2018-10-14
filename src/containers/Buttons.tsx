import { connect } from 'react-redux';
import { addTodo } from '../actions';
import { Dispatch, Action } from 'redux';
import * as React from 'react';
import { redo, undo } from 'src/reducers/enhancers/history';

function ButtonsF({ dispatch }: { dispatch: Dispatch<Action> }) {
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
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Todo"
                        aria-label="Recipient's username" aria-describedby="button-addon2"
                        ref={node => {
                            input = node as HTMLInputElement
                        }} />
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="submit"
                            id="button-addon2">Add Todo</button>
                    </div>
                </div>
            </form>
            <button onClick={e => dispatch(undo())} className="btn btn-primary mr-2">Undo</button>
            <button onClick={e => dispatch(redo())} className="btn btn-primary">Redo</button>
        </div>
    )
}

let Buttons = connect()(ButtonsF)

export default Buttons