import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import * as React from 'react'
import { Todo, StoreState } from 'src/types'
import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

interface Props {
    todos: Todo[]
}

export function CalendarF({ todos }: Props) {
    const events = todos.map(todo => {
        return {
            title: todo.name,
            allDay: true,
            start: todo.date,
            end: todo.date
        }
    });

    return (
        <div className="container mt-2" style={{height: '90%'}}>
            <h3>Calendar</h3>
            <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                views={['month', 'agenda']}
                popup={true}
            />
        </div>)
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