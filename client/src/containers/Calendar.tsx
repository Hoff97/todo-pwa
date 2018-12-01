import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import * as React from 'react'
import { Todo, StoreState } from 'src/types'
import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Route } from 'react-router';
import { inputChanged } from 'src/actions';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

interface Props {
    todos: Todo[];
    dispatch: Dispatch<Action<any>>;
}

export function CalendarF({ todos, dispatch }: Props) {
    const events = todos.map(todo => {
        return {
            title: todo.name,
            allDay: true,
            start: todo.date,
            end: todo.date,
            id: todo.id
        }
    });

    return (
        <Route render={loc => (
            <div className="container mt-2" style={{ height: '92%' }}>
                <h3>Calendar</h3>
                <BigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    views={['month', 'agenda']}
                    popup={true}
                    onSelectEvent={ev => {
                        loc.history.push('/');
                        setTimeout(() => {
                            const el = document.getElementById(`todo-${ev.id}`);
                            console.log(el);
                            if(el !== null) {
                                el.scrollIntoView({
                                    behavior: 'smooth',
                                    block: "center"
                                })
                            }
                        }, 500);
                    }}
                    onSelectSlot={ev => {
                        console.log(ev);
                        if(ev.action === 'doubleClick') {
                            loc.history.push('/');
                            dispatch(inputChanged('@' + moment(ev.start).format('DD-MM') + ' '));
                            setTimeout(() => {
                                const input = document.getElementById('main-todo-input');
                                if(input !== null) {
                                    input.focus();
                                }
                            }, 200);
                        }
                    }}
                    selectable={true}
                />
            </div>
        )} />
    );
}

let Calendar = connect((state: StoreState) => {
    return {
        todos: state.todos
    }
}, (dispatch: Dispatch<Action<any>>) => {
    return {
        dispatch
    }
})(CalendarF);

export default Calendar;