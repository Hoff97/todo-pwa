package em.service

import java.sql.Timestamp
import java.util.Date

import em.db.TodoTable
import em.model._
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.libs.json.Json
import slick.jdbc.JdbcProfile

import scala.concurrent.{ExecutionContext, Future}
import javax.inject._
import play.api._
import play.api.mvc._
import com.mohiva.play.silhouette.api._
import em.auth._
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import em.db.TodoTable
import slick.ast.{BaseTypedType, TypedType}

class TodoServiceImpl @Inject()(
                                 protected val dbConfigProvider: DatabaseConfigProvider,
                                 pushService: PushService,
                                 syncService: SyncService)(implicit context: ExecutionContext)
  extends TodoService with HasDatabaseConfigProvider[JdbcProfile] {

  val log = Logger("service.todo")

  override def updateAndCreateTodos(todos: Seq[Todo], userId: Int) =
    syncService.updateCreateEntity[String, Todo, TodoTable](todos, TodoTable.todo,
      TodoTable.todo.filter(x => x.loginFk === userId),
      todo => Future.successful(pushService.notifyTodo(todo)),
      todo => Future.successful(pushService.notifyTodo(todo)))


  override def getTodosForUser(userId: Int): Future[Seq[TodoV]] = {
    val q = TodoTable.todo.filter(x => x.loginFk === userId)

    db.run(q.detailed)
  }
}
