import { Todo } from 'src/types';

export interface CategoryInfo {
    name: string;
    color: string;
}

const colors = ['#0267c1','#efa00b','#0075c4','#d65108','#591f0a',
 '#5d6ad0', '#b63636', '#596b38', '#3a3a3a', '#2f441d']

export function catInfoFromTodos(todos: Todo[]): CategoryInfo[] {
    return todos
        .map(todo => todo.category ? [todo.category] : [])
        .reduce((acc, val) => acc.concat(val), [])
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort((a,b) => a.localeCompare(b))
        .map((name, ix) => {
            return {
                name,
                color: colors[ix]
            }
        });
}