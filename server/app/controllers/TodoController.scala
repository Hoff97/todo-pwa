package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import com.mohiva.play.silhouette.api._
import em.auth._
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import em.db.TodoTable
import play.api.libs.json._

import scala.concurrent._
import em.db.Util._
import em.model.{Todo, TodoV}
import com.mohiva.play.silhouette.api.actions.SecuredRequest
import em.service.{PushService, TodoService}

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class TodoController @Inject()(
  cc:                             ControllerComponents,
  val silhouette:                 Silhouette[AuthEnv],
  protected val dbConfigProvider: DatabaseConfigProvider,
  pushService: PushService,
  todoService: TodoService)(implicit context: ExecutionContext)
  extends AbstractController(cc)
  with HasDatabaseConfigProvider[JdbcProfile] {

  val log = Logger("api.todo")

  def getTodos = silhouette.SecuredAction.async { implicit request =>
    val q = TodoTable.todo.filter(x => x.loginFk === request.identity.id.get)

    db.run(q.result).map {
      case todos => Ok(Json.toJson(todos.map(_.toTodoV)))
    }
  }
  
  def updateTodos = silhouette.SecuredAction.async(parse.json[List[TodoV]]) { implicit request: SecuredRequest[AuthEnv, List[TodoV]] =>
    val userId = request.identity.id.get
    todoService.updateAndCreateTodos(request.body.map(x => x.toTodo(userId)), userId)
      .map(res => Ok(Json.toJson(res.map(_.toTodoV))))
  }

  def deleteTodo(id: String) = silhouette.SecuredAction.async(parse.empty) { implicit request: SecuredRequest[AuthEnv, Unit] =>
    db.run(TodoTable.todo.filter(x => x.loginFk === request.identity.id.get && x.id === id).delete)
      .map(x => Ok(id))
  }
}
