import * as React from 'react';
import * as moment from 'moment';

export interface Props {
  name: string;
  done: boolean;
  toggle: () => void;
  remove: () => void;
  edit: () => void;
  doneEditing: (str: string) => void;
  editing: boolean;
  id: string;
  priority?: number;
  category?: string;
  date?: Date;
  categoryColor?: string;
  editChange: (str: string) => void
  editValue: string;
}

function Todo({ name, done, toggle, remove, priority, category, 
    date, categoryColor, edit, editing, doneEditing, editChange, editValue }: Props) {
  if(!editing) {
    return (
      <tr className={done ? 'table-info' : ''} onDoubleClick={e => {e.preventDefault;if(!done){edit();}}}>
        <td>
          {priority &&
            <span className={'prio ' + 'prio' + priority}>{priority}</span>
          }
        </td>
        <td className="todo-name">
          {name} {editing ? 'Editing!' : ''}
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
  } else {
    return (
      <tr className={done ? 'table-info' : ''} onDoubleClick={e => {e.preventDefault;doneEditing(editValue);}}>
        <td colSpan={5}>
          <form onSubmit={e => { e.preventDefault(); doneEditing(editValue) }}>
              <div className="input-group" style={{'margin': '-4px'}}>
                <input type="text" className="form-control"
                  aria-label="Todo" aria-describedby="button-addon2" value={editValue} onChange={val => editChange(val.target.value)}/>
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="submit"
                        id="button-addon2">Done</button>
                </div>
              </div>
          </form>
        </td>
      </tr>
    );
  }
}

export default Todo;