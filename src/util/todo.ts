import * as uuid from 'uuid/v4';
import { Todo } from 'src/types';
import * as moment from 'moment';

function nextWeekday(wd: number) {
    const today = moment().isoWeekday();
    if (today <= wd) {
        return moment().isoWeekday(wd);
    } else {
        return moment().add(1, 'weeks').isoWeekday(wd);
    }
}

const pExpr = /!([1-5])/
const cExpr = /#([A-Za-z]+)/
const dExpr = /@(today|tomorrow|mon|tue|wed|thu|fri|sat|sun|(\d{1,2})-(\d{1,2}))/

export function dateDescrToDate(str: string): moment.Moment {
    switch(str) {
        case 'today': return moment();
        case 'tomorrow': return moment().add(1, 'days');
        case 'mon': return nextWeekday(1);
        case 'tue': return nextWeekday(2);
        case 'wed': return nextWeekday(3);
        case 'thu': return nextWeekday(4);
        case 'fri': return nextWeekday(5);
        case 'sat': return nextWeekday(6);
        case 'sun': return nextWeekday(0);
        default: return moment();
    }
}

export function parseTodo(str: string): Todo {
    const prioMatch = str.match(pExpr);
    var priority: number | undefined = undefined;
    if (prioMatch !== null) {
        priority = +prioMatch[1]
    }

    const categoryMatch = str.match(cExpr)
    var category: string | undefined = undefined;
    if (categoryMatch !== null) {
        category = categoryMatch[1];
    }

    const dateMatch = str.match(dExpr);
    var date: Date | undefined = undefined;
    if (dateMatch !== null && dateMatch[1] !== null) {
        switch (dateMatch[1]) {
            case 'today': date = moment().toDate(); break;
            case 'tomorrow': date = moment().add(1, 'days').toDate(); break;
            case 'mon': date = nextWeekday(1).toDate(); break;
            case 'tue': date = nextWeekday(2).toDate(); break;
            case 'wed': date = nextWeekday(3).toDate(); break;
            case 'thu': date = nextWeekday(4).toDate(); break;
            case 'fri': date = nextWeekday(5).toDate(); break;
            case 'sat': date = nextWeekday(6).toDate(); break;
            case 'sun': date = nextWeekday(0).toDate(); break;
            default:
                if(dateMatch.length === 4) {
                    var dateM = moment().month(+dateMatch[3]-1).date(+dateMatch[2]);
                    if(!dateM.isAfter(moment())) {
                        dateM = dateM.add(1, 'years');
                    }
                    date = dateM.toDate();
                }
                break;
        }
    }

    const todo =  {
        id: uuid(),
        name: str.replace(cExpr, '').replace(dExpr, '').replace(pExpr, '').trim(),
        done: false,
        priority,
        category,
        date
    };
    return todo;
}

export function todoStr(todo: Todo) {
    return `${todo.name} ${todo.category ? '#' + todo.category : ''} ${todo.priority ? '!' + todo.priority : ''} ${todo.date ? '@' + moment(todo.date).format('DD-MM') : ''}`.trim();
}