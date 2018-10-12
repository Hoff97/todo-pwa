import * as React from 'react';

export interface Props {
  name: string;
  done: boolean;
  toggle: () => void;
  remove: () => void;
  id: string;
}

function Todo({ name, done, toggle, remove }: Props) {
  return (
    <div>
      {name}
      <button onClick={toggle} className="float-right btn btn-primary">
        <i className={done ? 'fas fa-undo' : 'fas fa-check'}></i>
      </button>
      {done &&
        <button onClick={remove} className="mr-2 float-right btn btn-danger">
          <i className="fas fa-trash"></i>
        </button>
      }
    </div>
  );
}

export default Todo;