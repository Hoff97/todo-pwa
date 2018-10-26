import * as React from 'react'
import * as moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EnhancedSuggest } from './EnhancedSuggest';
import { CategoryInfo } from 'src/util/category';

export interface Props {
  name: string
  done: boolean
  toggle: () => void
  remove: () => void
  edit: () => void
  doneEditing: (str: string) => void
  editing: boolean
  id: string
  priority?: number
  category?: string
  date?: Date
  categoryColor?: string
  editChange: (str: string) => void
  editValue: string
  filterCategory: (category: string) => void;
  categories: CategoryInfo[];
}

function wrapInput(input: JSX.Element) {
  return (
    <div className="input-group" style={{ 'margin': '-4px' }}>
      {input}
      <div className="input-group-append">
        <button className="btn btn-outline-secondary" type="submit"
          id="button-addon2">Done</button>
      </div>
    </div>
  );
}

const letterWidth = 30;
function cutOffName(name: string) {
  let slice = name.slice(0, (window.innerWidth-letterWidth*3)/letterWidth);
  if(slice.length < name.length) {
    return slice + '...';
  } else {
    return slice;
  }
}

function Todo({ name, done, toggle, remove, priority, category,
  date, categoryColor, edit, editing, doneEditing, editChange, editValue, filterCategory, categories }: Props) {
  let overdue = date ? moment().startOf('day').isAfter(date) : false;
  let today = !overdue && (date ? moment().isAfter(date) : false);
  let trClass = done ? 'table-info' : overdue ? 'table-danger' : today ? 'table-warning' : '';
  if (!editing) {
    return (
      <tr className={trClass} onDoubleClick={e => { e.preventDefault(); if (!done) { edit() } }}>
        <td>
          {priority &&
            <span className={'prio ' + 'prio' + priority}>{priority}</span>
          }
        </td>
        <td className="todo-name">
          {cutOffName(name)}
        </td>
        <td>
          {category &&
            <span className="category" style={{ color: categoryColor }}
              onClick={e => filterCategory(category)}>{category}</span>
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
            <FontAwesomeIcon icon={done ? 'undo' : 'check'} />
          </button>
          {done &&
            <button onClick={remove} className="mr-2 float-right btn btn-danger btn-sm">
              <FontAwesomeIcon icon="trash" />
            </button>
          }
        </td>
      </tr>
    );
  } else {
    return (
      <tr className={done ? 'table-info' : ''} onDoubleClick={e => { e.preventDefault(); doneEditing(editValue) }}>
        <td colSpan={5}>
          <form onSubmit={e => { e.preventDefault(); doneEditing(editValue) }}>
            <EnhancedSuggest value={editValue} change={editChange} categories={categories}
              wrapInput={wrapInput} />
          </form>
        </td>
      </tr>
    );
  }
}

export default Todo