import * as React from 'react';

import { Bar } from 'react-chartjs-2';
import { CategoryInfo } from 'src/util/category';

interface Props {
    openTodos: number;
    closedTodos: number;
    ttD: number;
    categories: CategoryInfo[];
    todosByCategory: number[];
}

function prettyDuration(dur: number) {
    var hours = dur;
    var days = Math.floor(hours / 24);
    console.log(days);
    const weeks = Math.floor(days / 7);
    days = days - weeks * 7;
    hours = hours - days * 24 - weeks * 7 * 24;
    var ret = '';
    if (weeks > 1) {
        ret += weeks + ' weeks ';
    } else if (weeks > 0) {
        ret += weeks + ' week ';
    }
    if (days > 1) {
        ret += days + ' days ';
    } else if (days > 0) {
        ret += days + ' day ';
    }
    if (hours > 0) {
        ret += hours + ' hours';
    } else if (hours > 0) {
        ret += hours + ' hour';
    }
    return ret.trim();
}

function Stats({ openTodos, closedTodos, ttD, categories, todosByCategory }: Props) {
    const data = {
        labels: categories.map(x => x.name),
        datasets: [
            {
                label: 'Issues by category',
                backgroundColor: categories.map(x => x.color),
                borderColor: '#000',
                borderWidth: 1,
                hoverBackgroundColor: categories.map(x => x.color),
                hoverBorderColor: '#000',
                data: todosByCategory
            }
        ]
    };
    return (
        <div className="container mt-2">
            <table className="table table-striped table-bordered">
                <tbody>
                    <tr>
                        <th>Open todos</th>
                        <td>{openTodos}</td>
                    </tr>
                    <tr>
                        <th>Closed todos</th>
                        <td>{closedTodos}</td>
                    </tr>
                    <tr>
                        <th>Average time till done</th>
                        <td>{prettyDuration(ttD)}</td>
                    </tr>
                </tbody>
            </table>
            <Bar
                data={data}
                width={100}
                height={50}
                options={{
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }}
            />
        </div>
    );
}

export default Stats