import * as React from 'react';
import * as moment from 'moment';

export interface Props {
  name: string;
  done: boolean;
  toggle: () => void;
  remove: () => void;
  id: string;
  priority?: number;
  category?: string;
  date?: Date;
  categoryColor?: string;
}

function Todo({ name, done, toggle, remove, priority, category, date, categoryColor }: Props) {
  return (
    <tr className={done ? 'table-info' : ''}>
      <td>
        {priority &&
          <span className={'prio ' + 'prio' + priority}>{priority}</span>
        }
      </td>
      <td className="todo-name">
        {name}
      </td>
      <td>
        {category &&
          <span className="category" style={{color: categoryColor}}>{category}</span>
        }
      </td>
      {!done &&
        <td className="todo-name">
          {date &&
            moment(date).format('DD.MM.')
          }
        </td>
      }
      <td colSpan={done ? 2 : 1}>
        <button onClick={toggle} className="float-right btn btn-primary btn-sm">
          <i className={done ? 'fas fa-undo' : 'fas fa-check'}></i>
        </button>
        {done &&
          <button onClick={remove} className="mr-2 float-right btn btn-danger btn-sm">
            <i className="fas fa-trash"></i>
          </button>
        }
      </td>
    </tr>
  );
}

export default Todo;