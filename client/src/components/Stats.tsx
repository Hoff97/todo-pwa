import * as React from 'react';

import { Bar, Line, Scatter } from 'react-chartjs-2';
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
        done: number;
        created: number;
    }[];
    todosByPriority: number[];
    daysPrio: {
        daysLeft: number;
        prio: number;
        name: string;
    }[];
}

function prettyDuration(dur: number) {
    var hours = dur;
    var days = Math.floor(hours / 24);
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

const scatterOpts: ChartScales = {
    yAxes: [{
        ticks: {
            beginAtZero: true,
            callback: function (value, index, values) {
                if (Math.floor(value) === value) {
                    return value;
                }
            },
            reverse: true
        },
        scaleLabel: {
            labelString: 'Priority',
            display: true
        },
        type: 'logarithmic'
    }],
    xAxes: [{
        ticks: {
            beginAtZero: true,
            callback: function (value, index, values) {
                if (Math.floor(value) === value) {
                    return value;
                }
            }
        },
        scaleLabel: {
            labelString: 'Days left',
            display: true
        }
    }]
};

const lineDataOpts = {
    fill: false,
    lineTension: 0.1,
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBackgroundColor: '#fff',
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBorderWidth: 2,
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointRadius: 1,
    pointHitRadius: 10
}

const prioColors = ['#F00', 'rgb(255, 123, 0)', 'rgb(192, 168, 29)', 'rgb(143, 204, 0)', 'rgb(69, 187, 0)', '#AAA'];
function prioColor(prio: number | undefined) {
    return prioColors[5 - (prio ? prio : 0)];
}

function Stats({ openTodos, closedTodos, ttD, categories, todosByCategory, todosByDate, todosByPriority, daysPrio }: Props) {
    const barData = {
        labels: categories.map(x => x.name),
        datasets: [
            {
                label: 'Todos by category',
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
                data: todosByDate.map(x => x.done),
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointBorderColor: 'rgba(75,192,192,1)',
                ...lineDataOpts
            },
            {
                label: 'Todos created by date',
                data: todosByDate.map(x => x.created),
                backgroundColor: 'rgba(192,75,192,0.4)',
                borderColor: 'rgba(192,75,192,1)',
                pointHoverBackgroundColor: 'rgba(192,75,192,1)',
                pointBorderColor: 'rgba(192,75,192,1)',
                ...lineDataOpts
            }
        ]
    };

    const todoCat = {
        labels: ['5', '4', '3', '2', '1', 'none'],
        datasets: [
            {
                label: 'Todos by priority',
                backgroundColor: ['#F00', 'rgb(255, 123, 0)', 'rgb(192, 168, 29)', 'rgb(143, 204, 0)', 'rgb(69, 187, 0)', '#AAA'],
                borderColor: '#000',
                borderWidth: 1,
                hoverBackgroundColor: ['#F00', 'rgb(255, 123, 0)', 'rgb(192, 168, 29)', 'rgb(143, 204, 0)', 'rgb(69, 187, 0)', '#AAA'],
                hoverBorderColor: '#000',
                data: todosByPriority
            }
        ]
    };

    const scatterData = {
        labels: ['Scatter'],
        datasets: [
            {
                label: 'Days left x Priority',
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                pointBorderColor: daysPrio.map(x => prioColor(x.prio)),
                pointBackgroundColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 10,
                pointHoverBackgroundColor: daysPrio.map(x => prioColor(x.prio)),
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 8,
                pointHitRadius: 10,
                data: daysPrio.map(x => { return { x: x.daysLeft, y: x.prio } })
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
            <div className="row">
                <div className="col">
                    <Bar
                        data={todoCat}
                        options={{
                            scales: scaleOptions
                        }}
                    />
                </div>
                <div className="col">
                    <Scatter data={scatterData}
                        options={{
                            scales: scatterOpts,
                            tooltips: {
                                callbacks: {
                                    label: function (tooltipItem, data) {
                                        const ix = tooltipItem.index ? tooltipItem.index : 0;
                                        return [daysPrio[ix].name,`${tooltipItem.xLabel} days left`,`Priority: ${tooltipItem.yLabel}`];
                                    }
                                },
                                displayColors: false
                            },
                        }} />
                </div>
            </div>
        </div>
    );
}

export default Stats