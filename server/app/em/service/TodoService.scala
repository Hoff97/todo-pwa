package em.service

import em.model.{Todo, TodoV}

import scala.concurrent.Future

trait TodoService {
  def updateAndCreateTodos(todos: Seq[Todo], userId: Int): Future[_]

  def getTodosForUser(userId: Int): Future[Seq[TodoV]]
}
