import * as React from 'react';

import 'chart.js';
import { Line, Bar, Radar } from 'react-chartjs';

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

const data = {
	labels: ["January", "February", "March", "April", "May", "June", "July"],
	datasets: [
		{
			label: "My First dataset",
			fillColor: "rgba(220,220,220,0.2)",
			strokeColor: "rgba(220,220,220,1)",
			pointColor: "rgba(220,220,220,1)",
			pointStrokeColor: "#fff",
			pointHighlightFill: "#fff",
			pointHighlightStroke: "rgba(220,220,220,1)",
			data: [65, 59, 80, 81, 56, 55, 40]
		},
		{
			label: "My Second dataset",
			fillColor: "rgba(151,187,205,0.2)",
			strokeColor: "rgba(151,187,205,1)",
			pointColor: "rgba(151,187,205,1)",
			pointStrokeColor: "#fff",
			pointHighlightFill: "#fff",
			pointHighlightStroke: "rgba(151,187,205,1)",
			data: [28, 48, 40, 19, 86, 27, 90]
		}
	]
};

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
            <Line data={data}/>
            <Bar data={data}/>
            <Radar data={data}/>
        </div>
    );
}

export default Stats