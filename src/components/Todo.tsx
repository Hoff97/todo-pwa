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
  date?: Date
}

function Todo({ name, done, toggle, remove, priority, category, date }: Props) {
  return (
    <div className="row">
      <div className="col-1">
        {priority &&
          <span className={'prio ' + 'prio' + priority}>{priority}</span>
        }
      </div>
      <div className="col-7 todo-name">
        {name}
        {category &&
          <span className="category">#{category}</span>
        }
      </div>
      <div className="col-2 todo-name">
        {date &&
          moment(date).format('DD.MM.')
        }
      </div>
      <div className="col-2">
        <button onClick={toggle} className="float-right btn btn-primary">
          <i className={done ? 'fas fa-undo' : 'fas fa-check'}></i>
        </button>
        {done &&
          <button onClick={remove} className="mr-2 float-right btn btn-danger">
            <i className="fas fa-trash"></i>
          </button>
        }
      </div>
    </div>
  );
}

export default Todo;