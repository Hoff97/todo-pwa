import uuid from 'uuid/v4';
import { Todo } from 'src/types';
import moment from 'moment';
import { comparing, dual } from './util';

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
export const dExpr = /@(today|tomorrow|mon|tue|wed|thu|fri|sat|sun|(\d{1,2})-(\d{1,2})-(\d{4})|(\d{1,2})-(\d{1,2}))/
const rExpr = /r:(morning|noon|afternoon|evening|(\d{1,2}):(\d{2,2}))/

export function dateDescrToDate(str: string): moment.Moment {
    switch(str) {
        case 'today': return moment().startOf('day');
        case 'tomorrow': return moment().add(1, 'days').startOf('day');
        case 'mon': return nextWeekday(1).startOf('day');
        case 'tue': return nextWeekday(2).startOf('day');
        case 'wed': return nextWeekday(3).startOf('day');
        case 'thu': return nextWeekday(4).startOf('day');
        case 'fri': return nextWeekday(5).startOf('day');
        case 'sat': return nextWeekday(6).startOf('day');
        case 'sun': return nextWeekday(0).startOf('day');
        default: return moment().startOf('day');
    }
}

export function parseTodo(str: string): Todo {
    const prioMatch = str.match(pExpr);
    var priority: number = 1;
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
            case 'today': date = moment().startOf('day').toDate(); break;
            case 'tomorrow': date = moment().startOf('day').add(1, 'days').toDate(); break;
            case 'mon': date = nextWeekday(1).startOf('day').toDate(); break;
            case 'tue': date = nextWeekday(2).startOf('day').toDate(); break;
            case 'wed': date = nextWeekday(3).startOf('day').toDate(); break;
            case 'thu': date = nextWeekday(4).startOf('day').toDate(); break;
            case 'fri': date = nextWeekday(5).startOf('day').toDate(); break;
            case 'sat': date = nextWeekday(6).startOf('day').toDate(); break;
            case 'sun': date = nextWeekday(0).startOf('day').toDate(); break;
            default:
                if(dateMatch.length === 7 && dateMatch[5] !== undefined && dateMatch[6] !== undefined) {
                    var dateM = moment().month(+dateMatch[6]-1).date(+dateMatch[5]).startOf('day');
                    if(!dateM.isAfter(moment().hour(0).minute(0))) {
                        dateM = dateM.add(1, 'years');
                    }
                    date = dateM.toDate();
                } else if(dateMatch.length === 7 && dateMatch[2] !== undefined && dateMatch[3] !== undefined && dateMatch[4] !== undefined) {
                    var dateM = moment().year(+dateMatch[4]).month(+dateMatch[3]-1).date(+dateMatch[2]).hour(0).minute(0);
                    date = dateM.toDate();
                }
                break;
        }
    }

    const reminderMatch = str.match(rExpr);
    var reminder: Date | undefined = undefined;
    if(reminderMatch !== null && reminderMatch[1] !== null) {
        var dateR = date ? moment(date) : moment();
        switch(reminderMatch[1]) {
            case 'morning': reminder = dateR.hours(9).minutes(0).seconds(0).toDate(); break;
            case 'noon': reminder = dateR.hours(12).minutes(0).seconds(0).toDate(); break;
            case 'afternoon': reminder = dateR.hours(15).minutes(0).seconds(0).toDate(); break;
            case 'evening': reminder = dateR.hours(19).minutes(0).seconds(0).toDate(); break;
            default:
                if(reminderMatch.length === 4) {
                    reminder = dateR.hours(+reminderMatch[2]).minutes(+reminderMatch[3]).seconds(0).toDate(); break;
                }
                break;
        }
    }

    const todo =  {
        id: uuid(),
        name: str.replace(cExpr, '').replace(dExpr, '').replace(pExpr, '').replace(rExpr, '').trim(),
        done: false,
        priority,
        category,
        date,
        reminder,
        timestamp: new Date(),
        files: [],
        created: new Date()
    };
    if(todo.reminder !== undefined) {
        Notification.requestPermission().then(function (result) {
        });
    }
    return todo;
}

export function todoStr(todo: Todo) {
    var ret = todo.name;
    if(todo.category) {
        ret += ' #' + todo.category;
    }
    if(todo.priority) {
        ret += ' !' + todo.priority;
    }
    if(todo.date) {
        ret += ' @';
        if(moment(todo.date).isBefore(moment.utc().startOf('day'))) {
            ret += moment(todo.date).format('DD-MM-YYYY');
        } else {
            ret += moment(todo.date).format('DD-MM');
        }
    }
    if(todo.reminder) {
        ret += ' r:' + moment(todo.reminder).format('HH:mm');
    }
    return ret;
}

export function isOverdue(date?: Date) {
    return date ? moment().startOf('day').isAfter(date) : false;
}

export function isToday(date?: Date) {
    return !isOverdue(date) && (date ? moment().isAfter(date) : false);
}

export const compare = comparing<Todo>(
    a => a.done ? 1 : 0,
    a => isOverdue(a.date) ? 0 : 1,
    a => a.priority ? -a.priority : 0,
    a => a.date ? -moment(a.date).startOf('day').toDate().getTime() : -200000000,
    dual((a,b) => a.name.localeCompare(b.name))
);

export function compareTodo(a: Todo, b: Todo) {
    return JSON.stringify(a) === JSON.stringify(b);
}