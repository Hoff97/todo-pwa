import * as React from 'react';

export interface Props {
  name: string;
  done: boolean;
  toggle: () => void;
  id: string;
}

function Todo({ name, done, toggle }: Props) {
  return (
    <div>
      {name} <button onClick={toggle} 
        className="float-right btn btn-primary"><i className={done ? 'fas fa-undo' : 'fas fa-check'}></i></button>
    </div>
  );
}

export default Todo;