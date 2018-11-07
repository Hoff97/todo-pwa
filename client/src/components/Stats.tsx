import * as React from 'react';

import { Bar, Line } from 'react-chartjs-2';
import { CategoryInfo } from 'src/util/category';
import { ChartScales } from 'chart.js';

interface Props {
    openTodos: number;
    closedTodos: number;
    ttD: number;
    categories: CategoryInfo[];
    todosByCategory: number[];
    todosByDate: {
        day: string;
        todos: number;
    }[];
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

const scaleOptions: ChartScales = {
    yAxes: [{
        ticks: {
            beginAtZero: true,
            callback: function (value, index, values) {
                if (Math.floor(value) === value) {
                    return value;
                }
            }
        }
    }]
};

function Stats({ openTodos, closedTodos, ttD, categories, todosByCategory, todosByDate }: Props) {
    const barData = {
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

    const L = Line as any

    const lineData = {
        labels: todosByDate.map(x => x.day),
        datasets: [
            {
                label: 'Todos done by date',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: todosByDate.map(x => x.todos)
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
            <div className="row">
                <div className="col">
                    <Bar
                        data={barData}
                        options={{
                            scales: scaleOptions
                        }}
                    />
                </div>
                <div className="col">
                    <L data={lineData}
                        options={{
                            scales: scaleOptions
                        }} />
                </div>
            </div>
        </div>
    );
}

export default Stats