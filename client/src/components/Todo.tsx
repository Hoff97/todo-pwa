import * as React from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EnhancedSuggest } from './EnhancedSuggest';
import { CategoryInfo } from 'src/util/category';
import { isOverdue, isToday } from 'src/util/todo';
import { TFile } from 'src/types';
import { dataSize } from 'src/util/util';
import { Link } from 'react-router-dom';

export interface Props {
  name: string
  done: boolean
  toggle: () => void
  remove: () => void
  edit: () => void
  doneEditing: (str: string) => void
  editing: boolean
  id: string
  priority: number
  category?: string
  date?: Date
  categoryColor?: string
  editChange: (str: string) => void
  editValue: string;
  categories: CategoryInfo[];
  comment?: string;
  files: TFile[];
  addFile: (file: File) => void;
  deleteFile: (id: string) => void;
  commentChanged: (comment: string) => void;
  timestamp: Date;
  lastSynch: Date;
  serverTimestamp: Date | undefined;
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
  let slice = name.slice(0, (window.innerWidth - letterWidth * 3) / letterWidth);
  if (slice.length < name.length) {
    return slice + '...';
  } else {
    return slice;
  }
}

function cutOffCategory(category: string) {
  let slice = category.slice(0, (window.innerWidth/3 - letterWidth * 3) / letterWidth);
  if (slice.length < category.length) {
    return slice + '..';
  } else {
    return slice;
  }
}

function isUnsynched(ts: Date, lastSynch: Date) {
  return moment(ts).isAfter(moment(lastSynch));
}

function Todo({ name, done, toggle, remove, priority, category,
  date, categoryColor, edit, editing, doneEditing, editChange,
  editValue, categories, comment, files, addFile, 
  deleteFile, commentChanged, timestamp, lastSynch, serverTimestamp, id }: Props) {
  let overdue = isOverdue(date);
  let today = isToday(date);
  let trClass = done ? 'table-info' : overdue ? 'table-danger' : today ? 'table-warning' : '';
  let indicator = serverTimestamp === undefined ? 'created' :
    isUnsynched(timestamp,lastSynch) ? 'unsynched' : '';
  if (!editing) {
    return (
      <tr className={trClass} onDoubleClick={e => { e.preventDefault(); if (!done) { edit() } }}
          id={'todo-' + id}>
        <td className={"indicator " + indicator}>
        </td>
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
            <Link to={{ pathname: '/', search: `?category=${category}` }} style={{ textDecoration: 'none' }}>
              <span className="category" style={{ color: categoryColor }}>{cutOffCategory(category)}</span>
            </Link>
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
        <td colSpan={6}>
          <form onSubmit={e => { e.preventDefault(); doneEditing(editValue) }}>
            <EnhancedSuggest value={editValue} change={editChange} categories={categories}
              wrapInput={wrapInput} /><br />
            <div className="form-group">
              <label htmlFor="exampleFormControlTextarea1">Kommentar</label>
              <textarea className="form-control" id="exampleFormControlTextarea1" rows={3}
                value={comment} onChange={ev => commentChanged(ev.target.value)}></textarea>
            </div>
            <ul className="list-group">
              {files.map(file => (
                <li className="list-group-item" key={file.id}>
                  <a href={file.data}>{file.name}</a> <span className="text-muted">({dataSize(file.data.length)})</span>
                  <button onClick={e => {e.preventDefault();deleteFile(file.id)}} className="mr-2 float-right btn btn-danger btn-sm">
                    <FontAwesomeIcon icon="trash" />
                  </button>
                </li>
              ))}
              <li className="list-group-item">
                <div className="form-group">
                  <label htmlFor="exampleFormControlFile1">Add file</label>
                  <input type="file" className="form-control-file" id="exampleFormControlFile1"
                    onChange={ev => {
                      if(ev.target.files) {
                        addFile(ev.target.files[0])
                      }
                     }}/>
                </div>
              </li>
            </ul>
          </form>
        </td>
      </tr>
    );
  }
}

export default Todo