import * as React from 'react';
import ButtonsV from '../containers/Buttons'
import VisibleTodoList from 'src/containers/TodoList';
​
const App = () => (
  <div className="container mt-2">
    <ButtonsV />
    <VisibleTodoList />
  </div>
)
​
export default App