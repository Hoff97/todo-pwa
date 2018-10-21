package em.service

import em.model.Todo

import scala.concurrent.Future

trait TodoService {
  def updateAndCreateTodos(todos: Seq[Todo], userId: Int): Future[Seq[Todo]]
}
