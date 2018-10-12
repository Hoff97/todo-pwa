import * as React from 'react';
import Buttons from '../containers/Buttons'
import VisibleTodoList from 'src/containers/TodoList';
​
const App = () => (
  <div className="container mt-2">
    <Buttons />
    <VisibleTodoList />
  </div>
)
​
export default App