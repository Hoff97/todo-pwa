import * as React from 'react';
import Buttons from '../containers/Buttons'
import VisibleTodoList from 'src/containers/TodoList';
​
const App = () => (
  <div>
    <Buttons />
    <VisibleTodoList />
  </div>
)
​
export default App