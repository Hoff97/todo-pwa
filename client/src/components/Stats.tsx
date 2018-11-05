import * as React from 'react';

interface Props {
    openTodos: number;
    closedTodos: number;
    ttD: number;
}

function prettyDuration(dur: number) {
    var hours = dur;
    var days = Math.floor(hours/24);
    console.log(days);
    const weeks = Math.floor(days/7);
    days = days-weeks*7;
    hours = hours-days*24-weeks*7*24;
    var ret = '';
    if(weeks > 1) {
        ret += weeks + ' weeks ';
    } else if (weeks > 0) {
        ret += weeks + ' week ';
    }
    if(days > 1) {
        ret += days + ' days ';
    } else if (days > 0) {
        ret += days + ' day ';
    }
    if(hours > 0) {
        ret += hours + ' hours';
    } else if (hours > 0) {
        ret += hours + ' hour';
    }
    return ret.trim();
}

function Stats({ openTodos, closedTodos, ttD }: Props) {
    return (
        <div className="container mt-2">
            <table className="table table-striped table-bordered">
                <tbody>
                    <tr>
                        <th>Open todos</th>
                        <td>{ openTodos }</td>
                    </tr>
                    <tr>
                        <th>Closed todos</th>
                        <td>{ closedTodos }</td>
                    </tr>
                    <tr>
                        <th>Average time till done</th>
                        <td>{prettyDuration(ttD)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Stats