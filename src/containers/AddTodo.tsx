import { connect } from 'react-redux';
import { addTodo, TodoAction } from '../actions';
import { Dispatch } from 'redux';
import * as React from 'react';

function AddTodoF({ dispatch }: { dispatch: Dispatch<TodoAction> }) {
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
        </div>
    )
}

let AddTodo = connect()(AddTodoF)

export default AddTodo