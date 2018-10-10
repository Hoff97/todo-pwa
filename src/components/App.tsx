import * as React from 'react';
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from 'src/containers/TodoList';
​
const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
  </div>
)
​
export default App