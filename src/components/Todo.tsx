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
      {name} <button onClick={toggle}>{done ? 'Undo' : 'Done'}</button>
    </div>
  );
}

export default Todo;